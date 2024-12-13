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
  // Medical Webpage Schema
  const medicalWebpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: data.seo?.title || `${data.testName} Test at Cadabams`,
    description: data.seo?.description || `Learn about ${data.testName} test at Cadabams`,
    url: `${baseUrl}/bangalore/lab-test/${slug}`,
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
        name: 'Medical Testing'
      }
    },
    reviewedBy: {
      '@type': 'Person',
      name: 'Dr. Shreyas Cadabam',
      jobTitle: 'Consultant specialist in Radiology and Interventional Musculoskeletal imaging',
      url: 'https://cadabamsdiagnostics.com/clinical-team',
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
      name: 'Laboratory Testing'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100'
    },
    alternativeHeadline: `${data.testName} - Medical Laboratory Test`,
    dateCreated: data.createdAt || new Date().toISOString(),
    dateModified: data.updatedAt || new Date().toISOString(),
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Cadabams Diagnostics'
    },
    keywords: data.seo?.keywords || `lab test, ${data.testName}, medical test, diagnostic test`
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.alldata[3]?.faqs?.map(faq => ({
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

  return [medicalWebpageSchema, faqSchema, breadcrumbSchema];
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

export async function getServerSideProps(context) {
  const { slug, location } = context.params;
  const baseUrl = 'https://cadabamsdiagnostics.com';
  const locationName = capitalizeLocation(location);

  try {
    const testData = await fetchTestData(slug);
    
    if (!testData || !testData.testName) {
      return {
        notFound: true
      };
    }

    const pageTitle = location 
      ? `Lab Test Services in ${locationName} | Cadabams Diagnostics`
      : 'Lab Test Services in Bangalore | Cadabams Diagnostics';
      
    const pageDescription = location
      ? `Accurate lab results you can rely on. Certified centres in ${locationName}.`
      : 'Accurate lab results you can rely on. Certified centres in Bangalore.';

    return {
      props: {
        testData,
        baseUrl,
        locationName,
        pageTitle,
        pageDescription,
        slug
      }
    };
  } catch (error) {
    console.error('Server-side error:', error);
    return {
      notFound: true
    };
  }
}

export default function SlugPage({ testData, baseUrl, locationName, pageTitle, pageDescription, slug }) {
  const router = useRouter();
  const { location } = router.query;
  const [error, setError] = useState(null);

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

  const currentUrl = `${baseUrl}/bangalore/${location ? `${location}/` : ''}lab-test/${slug}`;

  return (
    <Layout title={testData.testName || 'Test Page'}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{testData.seo?.title || pageTitle}</title>
        <meta name="description" content={testData.seo?.description || pageDescription} />
        <meta 
          name="keywords" 
          content={testData.seo?.keywords || `lab test, medical test, diagnostic test, Cadabams Diagnostics, medical diagnosis, ${locationName}`} 
        />
        
        {/* Robots Meta Tags */}
        <meta name="robots" content={testData.seo?.robotsMeta || "index, follow"} />
        <meta name="googlebot" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Enhanced Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={testData.seo?.title || pageTitle} />
        <meta property="og:description" content={testData.seo?.description || pageDescription} />
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
        <meta property="og:locality" content={locationName} />
        <meta property="og:region" content="Karnataka" />
        <meta property="og:postal-code" content="560001" />
        <meta property="og:country-name" content="India" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CadabamsDX" />  
        <meta name="twitter:creator" content="@CadabamsDX" />
        <meta name="twitter:title" content={testData.seo?.title || pageTitle} />
        <meta name="twitter:description" content={testData.seo?.description || pageDescription} />
        <meta name="twitter:image" content={testData.seo?.ogImage || `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`} />
        <meta name="twitter:image:alt" content={`${testData.testName} at Cadabams Diagnostics`} />
        <meta name="twitter:label1" content="Price" />
        <meta name="twitter:data1" content={`₹${testData.alldata[0]?.basic_info?.price || ''}`} />
        <meta name="twitter:label2" content="Location" />
        <meta name="twitter:data2" content={locationName} />

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