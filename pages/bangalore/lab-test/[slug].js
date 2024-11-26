import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import TestPage from '../../../components/TestPage';
import NotFound from '../../../components/NotFound';
import { fetchTestData } from '../../../utils/api';
import styles from '../../../styles/TestPage.module.css';

// Schema Generator Function
const generateSchemas = (data, baseUrl, slug) => {
  // Main Schema
  const testSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalTest',
    name: data.testName,
    description: data.metaDescription || `Learn about ${data.testName} test at Cadabams`,
    image: data.imageUrl ? [data.imageUrl] : [],
    provider: {
      '@type': 'MedicalOrganization',
      name: 'Cadabams Healthcare',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    relevantSpecialty: 'Medical Diagnostics',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/bangalore/lab-test/${slug}`
    }
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
        name: 'Lab Tests',
        item: `${baseUrl}/bangalore/lab-test`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.testName,
        item: `${baseUrl}/lab-test/${slug}`
      }
    ]
  };

  return [testSchema, breadcrumbSchema];
};

// Helper function to capitalize location
const capitalizeLocation = (loc) => {
  if (!loc) return 'Bangalore';
  return loc.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Breadcrumb Component
const Breadcrumb = ({ title }) => (
  <nav className={styles.breadcrumb} aria-label="breadcrumb">
    <div className={styles.breadcrumbContainer}>
      <Link href="/" className={styles.breadcrumbLink}>
        Home
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      <Link href="/bangalore/lab-test" className={styles.breadcrumbLink}>
        Lab Tests
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      <span className={styles.breadcrumbCurrent}>{title}</span>
    </div>
  </nav>
);

export default function SlugPage() {
  const router = useRouter();
  const { slug, location } = router.query;
  const [testData, setTestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
  const locationName = capitalizeLocation(location);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      fetchTestData(slug)
        .then((response) => {
          if (response && response.testName) {
            setTestData(response);
          } else {
            setNotFound(true);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          if (err.message.includes('404') || err.response?.status === 404) {
            setNotFound(true);
          } else {
            setError('Failed to fetch data');
          }
          setIsLoading(false);
        });
    }
  }, [slug]);

  if (isLoading) {
    return (
      <Layout title="Loading Test...">
        <div className={styles.loadingContainer}>
          <h2>Loading...</h2>
        </div>
      </Layout>
    );
  }

  if (notFound) {
    return <NotFound />;
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
    return <NotFound />;
  }

  const pageTitle = location 
    ? `Lab Test Services in ${locationName} | Cadabams Health Labs`
    : 'Lab Test Services in Bangalore | Cadabams Health Labs';
    
  const pageDescription = location
    ? `Accurate lab results you can rely on. Certified centres in ${locationName}.`
    : 'Accurate lab results you can rely on. Certified centres in Bangalore.';

  return (
    <Layout title={testData.testName || 'Test Page'}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta 
          name="keywords" 
          content={`lab test, medical test, diagnostic test, Cadabams healthcare, medical diagnosis, ${locationName}`} 
        />
        
        {/* Robots Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${baseUrl}/bangalore/${location ? `${location}/` : ''}lab-test`} />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${baseUrl}/default-test-image.jpg`} />
        <meta property="og:url" content={`${baseUrl}/bangalore/${location ? `${location}/` : ''}lab-test`} />
        <meta property="og:site_name" content="Cadabams Health Labs" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CadabamsGroup" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${baseUrl}/default-test-image.jpg`} />

        {/* Additional Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#0047AB" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateSchemas(testData, baseUrl, slug))
          }}
        />
      </Head>

      <div className={styles.container}>
        <Breadcrumb title={testData.testName} />
        <TestPage testData={testData} />
      </div>
    </Layout>
  );
}