import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import NonLabTestPage from '@/components/NonLabTestPage';
import NotFound from '@/components/NotFound';
import { fetchTestData } from '@/utils/api';
import styles from '../../../styles/TestPage.module.css';

// Improved helper function to determine test category from the route and basic info
const getTestType = (test = '', basicInfo = null) => {
  if (!test) return null;
  
  // First check basic info if available
  if (basicInfo?.testCategory) {
    const category = basicInfo.testCategory.toLowerCase();
    if (category.includes('ultrasonography') || category.includes('ultrasound')) {
      return 'ultrasound-scan';
    }
    if (category.includes('x-ray')) return 'xray-scan';
    if (category.includes('mri')) return 'mri-scan';
    if (category.includes('ct')) return 'ct-scan';
  }

  // Fallback to URL-based detection
  const testLower = test.toLowerCase();
  if (testLower.includes('x-ray') || testLower.includes('xray')) return 'xray-scan';
  if (testLower.includes('msk') || testLower.includes('musculoskeletal')) return 'ultrasound-scan';
  if (testLower.includes('ultrasound') || testLower.includes('doppler') || 
      testLower.includes('sonography') || testLower.includes('elastography')) return 'ultrasound-scan';
  if (testLower.includes('mri')) return 'mri-scan';
  if (testLower.includes('ct')) return 'ct-scan';
  if (testLower.includes('pregnancy')) return 'pregnancy-scan';
  
  // Check for specific scan types
  const scanTypes = ['thyroid', 'breast', 'fetal', 'penile'];
  if (scanTypes.some(type => testLower.includes(type))) return 'ultrasound-scan';
  
  return null;
};

// Helper function to format test type for display in UI
const formatTestType = (testType) => {
  if (!testType) return '';
  return testType
    .split('-')
    .map(word => {
      if (word.toLowerCase() === 'ct' || word.toLowerCase() === 'mri') {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Helper function to clean URL path
const cleanPath = (path) => {
  if (!path) return '';
  return path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
};

// Helper function to construct proper URLs for related tests
const getRelatedTestUrl = (testRoute, basicInfo = null) => {
  if (!testRoute) return '';
  const cleanRoute = cleanPath(testRoute);
  const category = getTestType(cleanRoute, basicInfo);
  return category ? `/bangalore/${category}/${cleanRoute}` : '';
};

// Breadcrumb Component
const Breadcrumb = ({ title, testType }) => (
  <nav className={styles.breadcrumb} aria-label="breadcrumb">
    <div className={styles.breadcrumbContainer}>
      <Link href="/" className={styles.breadcrumbLink}>
        Home
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      <Link href={`/bangalore/${testType}`} className={styles.breadcrumbLink}>
        {formatTestType(testType)}
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      <span className={styles.breadcrumbCurrent}>{title}</span>
    </div>
  </nav>
);

// Schema Generator Function
const generateSchemas = (data, currentUrl, test, testType) => {
  // ... [Previous schema generation code remains the same]
};

// Get server-side props
export async function getServerSideProps({ params, req }) {
  const { test } = params;
  
  try {
    // First fetch the test data
    const testData = await fetchTestData(test);
    
    // Get the test type using both URL and basic info
    const basicInfo = testData?.alldata?.[0]?.basic_info;
    const testType = getTestType(test, basicInfo);
    const hasBangalore = req.url.includes('/bangalore/');

    // If we have data but no valid category, we should still show the page
    // as the data exists but might need a different categorization
    return {
      props: {
        testData,
        testType,
        error: null,
        invalidCategory: !testType, // Only invalid if we really can't determine the category
        hasBangalore
      }
    };
  } catch (error) {
    console.error('Error fetching test data:', error);
    return {
      props: {
        testData: null,
        testType: null,
        error: 'Failed to fetch test data',
        invalidCategory: false,
        hasBangalore: req.url.includes('/bangalore/')
      }
    };
  }
}

export default function TestDetailPage({ testData, testType: initialTestType, error, invalidCategory, hasBangalore }) {
  const router = useRouter();
  const { test } = router.query;
  const baseUrl = 'https://cadabamsdiagnostics.com';
  
  // If we have testData but no initial testType, try to determine it from basic info
  const testType = initialTestType || (testData?.alldata?.[0]?.basic_info ? 
    getTestType(test, testData.alldata[0].basic_info) : null);
    
  const currentUrl = hasBangalore && testType
    ? `${baseUrl}/bangalore/${testType}/${test}`
    : `${baseUrl}/${testType}/${test}`;

  if (!test) {
    return (
      <Layout title="Loading Test...">
        <div className={styles.loadingContainer}>
          <h2>Loading...</h2>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className={styles.errorContainer}>
          <h2>Error: {error}</h2>
          <button 
            onClick={() => router.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  // Only show NotFound if we have no test data
  if (!testData) {
    return (
      <Layout title="Not Found">
        <NotFound />
      </Layout>
    );
  }

  const relatedTests = testData?.alldata?.[13]?.relative_test?.tests || [];
  const schemas = generateSchemas(testData, currentUrl, test, testType);

  return (
    <Layout title={testData.testName || 'Test Page'}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{testData.seo?.title}</title>
        <meta name="description" content={testData.seo?.description || `Learn about ${testData.testName} at Cadabams Diagnostics`} />
        <meta 
          name="keywords" 
          content={testData.seo?.keywords || `diagnostic test, medical test, ${testData.testName}, Cadabams Diagnostics`} 
        />
        
        {/* [Rest of the meta tags remain the same] */}
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemas)
          }}
        />
      </Head>

      <div className={styles.container}>
        {testType && <Breadcrumb title={testData.testName} testType={testType} />}
        <NonLabTestPage testData={testData} />

        {/* Related Tests Section */}
        {relatedTests.length > 0 && (
          <section className={styles.relatedTestsSection}>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>
                <h2>Related Tests</h2>
              </div>
              <div className={styles.relatedTestsGrid}>
                {relatedTests.map((relatedTest) => {
                  const url = getRelatedTestUrl(relatedTest.route, testData?.alldata?.[0]?.basic_info);
                  if (!url) return null; // Skip invalid categories
                  return (
                    <Link
                      key={relatedTest._id}
                      href={url}
                      className={styles.relatedTestCard}
                    >
                      <div className={styles.testName}>
                        {relatedTest.testName}
                      </div>
                      <div className={styles.arrowIcon}>→</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}