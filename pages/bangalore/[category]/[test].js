import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import NonLabTestPage from '@/components/NonLabTestPage';
import NotFound from '@/components/NotFound';
import { fetchTestData } from '@/utils/api';
import styles from '../../../styles/TestPage.module.css';

// Helper function to determine test category from the route
const getTestType = (test = '') => {
  if (test.includes('x-ray') || test.includes('xray')) return 'xray-scan';
  if (test.includes('msk')) return 'msk-scan';
  if (test.includes('mri')) return 'mri-scan';
  if (test.includes('ct')) return 'ct-scan';
  if (test.includes('ultrasound')) return 'ultrasound-scan';
  if (test.includes('pregnancy')) return 'pregnancy-scan';
  return null; // Return null for non-matching categories
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
const getRelatedTestUrl = (testRoute) => {
  if (!testRoute) return '';
  const cleanRoute = cleanPath(testRoute);
  const category = getTestType(cleanRoute);
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
const generateSchemas = (data, baseUrl, test) => {
  const testType = getTestType(test);
  
  if (!testType) return [];
  
  // Medical Webpage Schema
  const medicalWebpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: data.seo?.title || `${data.testName} at Cadabams`,
    description: data.seo?.description || `Learn about ${data.testName} at Cadabams`,
    url: `${baseUrl}/bangalore/${testType}/${test}`,
    image: data.imageUrl || `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`,
    citation: 'https://',
    audio: {
      '@type': 'AudioObject',
      contentUrl: '',
      description: '',
      duration: 'T0M15S',
      encodingFormat: 'audio/mpeg',
      name: ''
    },
    hasMap: 'https://www.google.com/maps',
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Patients',
      healthCondition: {
        '@type': 'MedicalCondition',
        name: 'Medical Diagnostics'
      }
    },
    reviewedBy: {
      '@type': 'Person',
      name: 'Dr. Shreyas Cadabam',
      jobTitle: 'Consultant specialist in Radiology and Interventional Musculoskeletal imaging',
      url: 'https://www.cadabamsdiagnostics.com/clinical-team',
      sameAs: [
        'https://www.linkedin.com/in/shreyas-cadabam-30a2429a/',
        'https://www.instagram.com/cadabams_diagnostics/',
        'https://www.facebook.com/cadabamsdiagnostics',
        'https://twitter.com/CadabamsDX',
        'https://www.linkedin.com/company/cadabam\'s-group/'
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Radiologist',
        educationRequirements: 'MBBS , MD Radiodiagnosis'
      }
    },
    specialty: 'Medical Diagnostics',
    about: {
      '@type': 'MedicalCondition',
      name: data.alldata[2]?.about_test?.title || 'Diagnostic Testing'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100'
    },
    alternativeHeadline: `${data.testName} - Medical Diagnostic Test`,
    dateCreated: data.createdAt || new Date().toISOString(),
    dateModified: data.updatedAt || new Date().toISOString(),
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Cadabams Diagnostics'
    },
    keywords: data.seo?.keywords || `diagnostic test, ${data.testName}, medical test`
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.alldata[12]?.faqs?.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    })) || []
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: formatTestType(testType),
        item: `${baseUrl}/bangalore/${testType}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.testName,
        item: `${baseUrl}/bangalore/${testType}/${test}`
      }
    ]
  };

  return [medicalWebpageSchema, faqSchema, breadcrumbSchema];
};

// Get server-side props
export async function getServerSideProps({ params }) {
  const { test } = params;
  const testType = getTestType(test);

  // Return early if test type is not recognized
  if (!testType) {
    return {
      props: {
        testData: null,
        error: null,
        invalidCategory: true
      }
    };
  }

  try {
    const testData = await fetchTestData(test);
    
    return {
      props: {
        testData,
        error: null,
        invalidCategory: false
      }
    };
  } catch (error) {
    console.error('Error fetching test data:', error);
    return {
      props: {
        testData: null,
        error: 'Failed to fetch test data',
        invalidCategory: false
      }
    };
  }
}

export default function TestDetailPage({ testData, error, invalidCategory }) {
  const router = useRouter();
  const { test } = router.query;
  const baseUrl = 'https://www.cadabamsdiagnostics.com';
  const testType = getTestType(test);

  if (!test) {
    return (
      <Layout title="Loading Test...">
        <div className={styles.loadingContainer}>
          <h2>Loading...</h2>
        </div>
      </Layout>
    );
  }

  if (invalidCategory) {
    return (
      <Layout title="Test Not Found">
        <NotFound />
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

  if (!testData) {
    return (
      <Layout title="Not Found">
        <NotFound />
      </Layout>
    );
  }

  const currentUrl = `${baseUrl}/bangalore/${testType}/${test}`;
  const relatedTests = testData?.alldata?.[13]?.relative_test?.tests || [];

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
        
        {/* Robots Meta Tags */}
        <meta name="robots" content={testData.seo?.robotsMeta || "index, follow"} />
        <meta name="googlebot" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Enhanced Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={testData.seo?.title} />
        <meta property="og:description" content={testData.seo?.description || `Learn about ${testData.testName} at Cadabams Diagnostics`} />
        <meta property="og:image" content={testData.seo?.ogImage || `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Cadabams Diagnostics" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:price:currency" content="INR" />
        <meta property="og:price:amount" content={testData.alldata[0]?.basic_info?.price || ''} />
        <meta property="og:availability" content="in stock" />
        <meta property="og:brand" content="Cadabams Diagnostics" />
        <meta property="og:email" content="info@cadabamsdiagnostics.com" />
        <meta property="og:phone_number" content="+918050381444" />
        <meta property="og:street-address" content="Bangalore" />
        <meta property="og:locality" content="Bangalore" />
        <meta property="og:region" content="Karnataka" />
        <meta property="og:postal-code" content="560001" />
        <meta property="og:country-name" content="India" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CadabamsDX" />
        <meta name="twitter:creator" content="@CadabamsDX" />
        <meta name="twitter:title" content={testData.seo?.title} />
        <meta name="twitter:description" content={testData.seo?.description || `Learn about ${testData.testName} at Cadabams Diagnostics`} />
        <meta name="twitter:image" content={testData.seo?.ogImage || `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`} />
        <meta name="twitter:image:alt" content={`${testData.testName} at Cadabams Diagnostics`} />
        <meta name="twitter:label1" content="Price" />
        <meta name="twitter:data1" content={`₹${testData.alldata[0]?.basic_info?.price || ''}`} />
        <meta name="twitter:label2" content="Location" />
        <meta name="twitter:data2" content="Bangalore" />

        {/* Additional Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#0047AB" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cadabams Diagnostics" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateSchemas(testData, baseUrl, test))
          }}
        />
      </Head>

      <div className={styles.container}>
        <Breadcrumb title={testData.testName} testType={testType} />
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
                  const url = getRelatedTestUrl(relatedTest.route);
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