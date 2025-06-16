import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CenterPage from './CenterPage';
import styles from './DynamicCenterPage.module.css';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-prod.cadabamsdiagnostics.com/api/v1/cms/component/pagetemplate';

// Helper function to transform center data
const transformCenterData = (data) => {
  if (!data) return null;
  
  try {
    return {
      ...data,
      services: data.services?.map(service => ({
        ...service,
        image: service.image || '/placeholder.jpg',
        tests: service.tests?.map(test =>
          typeof test === 'object' ? test.testName : test
        )
      })) || []
    };
  } catch (error) {
    console.error('Error transforming center data:', error);
    return null;
  }
};

// SEO data preparation function
const getSEOData = (centerData) => {
  if (!centerData) return null;

  const center = centerData.basic_info || {};
  const centerInfo = centerData.center_info || {};

  return {
    title: `${center.center_name || 'Diagnostic Center'} | Cadabam's Diagnostics Bangalore`,
    description: `Visit Cadabam's Diagnostics ${center.center_name} for comprehensive medical testing and diagnostic services. ${center.center_description || 'We offer advanced diagnostic solutions with state-of-the-art equipment and experienced professionals.'}`,
    keywords: `diagnostic center bangalore, medical tests, health checkup, ${center.center_name}, ${center.area || 'bangalore'}, diagnostic services`,
    url: `https://cadabamsdiagnostics.com/bangalore/center/${center.slug || ''}`,
    imageUrl: center.center_image || 'https://cadabamsdiagnostics.com/images/center-default.jpg'
  };
};

// Server-side props
export async function getServerSideProps({ params, res }) {
  const { slug } = params;

  if (!slug) {
    return {
      redirect: {
        destination: '/bangalore',
        permanent: false,
      },
    };
  }

  try {
    // Add cache control headers
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    );

    // Convert slug to lowercase for API consistency
    const normalizedSlug = Array.isArray(slug) ? slug[0].toLowerCase() : slug.toLowerCase();
    
    console.log('Fetching data for slug:', normalizedSlug);
    
    const response = await axios.get(`${API_BASE_URL}/center/${normalizedSlug}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response status:', response.status);
    console.log('API Response data structure:', response.data ? 'Data exists' : 'No data');

    const centerData = response.data?.data;

    if (!centerData) {
      console.log('No center data found in response');
      return {
        redirect: {
          destination: '/bangalore',
          permanent: false,
        },
      };
    }

    const transformedData = transformCenterData(centerData);

    if (!transformedData) {
      console.log('Data transformation failed');
      return {
        props: {
          centerData: null,
          error: 'Failed to process center data'
        }
      };
    }

    console.log('Successfully transformed data for:', transformedData.basic_info?.center_name);

    return {
      props: {
        centerData: transformedData,
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching center data:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: `${API_BASE_URL}/center/${slug}`
    });
    
    // Return more specific error information
    const errorMessage = error.response?.status === 404 
      ? 'Center not found' 
      : error.response?.status 
        ? `API Error: ${error.response.status}` 
        : 'Network connection failed';

    return {
      props: {
        centerData: null,
        error: errorMessage
      }
    };
  }
}

const CenterDetailPage = ({ centerData, error }) => {
  const router = useRouter();

  // Loading state
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div className={styles.loadingContainer}>
          <h2>Loading center information...</h2>
        </div>
      </Layout>
    );
  }

  // Error state
  if (!centerData && error) {
    return (
      <Layout title="Error">
        <Head>
          <title>Error | Cadabam's Diagnostics</title>
          <meta name="robots" content="noindex, follow" />
        </Head>
        <div className={styles.errorContainer}>
          <h2>Error: {error}</h2>
          <p>We're having trouble loading the center information.</p>
          <div className={styles.errorActions}>
            <button 
              onClick={() => router.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push('/bangalore')}
              className={styles.backButton}
            >
              Go Back to Centers
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if no data and no error (shouldn't happen, but just in case)
  if (!centerData) {
    if (typeof window !== 'undefined') {
      router.push('/bangalore');
    }
    return null;
  }

  const seoData = getSEOData(centerData);
  const { center_info = {}, basic_info = {} } = centerData;
  const { slug } = router.query;

  return (
    <Layout title={basic_info.center_name || 'Diagnostic Center'}>
      <Head>
        <title>{seoData?.title || 'Cadabam\'s Diagnostics'}</title>
        <meta name="description" content={seoData?.description || ''} />
        <meta name="keywords" content={seoData?.keywords || ''} />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href={`https://cadabamsdiagnostics.com/bangalore/center/${slug}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData?.title || ''} />
        <meta property="og:description" content={seoData?.description || ''} />
        <meta property="og:type" content="medical.business" />
        <meta property="og:url" content={seoData?.url || ''} />
        <meta property="og:image" content={seoData?.imageUrl || ''} />
        <meta property="og:site_name" content="Cadabam's Diagnostics" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData?.title || ''} />
        <meta name="twitter:description" content={seoData?.description || ''} />
        <meta name="twitter:image" content={seoData?.imageUrl || ''} />
        
        {/* Schema.org JSON-LD Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": centerData.faq?.map(faqItem => ({
                "@type": "Question",
                "name": faqItem.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faqItem.answer?.replace(/<[^>]*>/g, '') // Strip HTML tags
                }
              })) || []
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": basic_info.center_name,
              "url": seoData?.url,
              "description": basic_info.center_description,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": center_info.address || "",
                "addressLocality": basic_info.area || "Bangalore",
                "addressRegion": "Karnataka",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": center_info.phone || "",
                "contactType": "Customer Service",
                "areaServed": "IN",
                "availableLanguage": "en"
              },
              "openingHours": [
                `Mo-Sa ${centerData.working_hours?.weekdays?.start || '06:30'}-${centerData.working_hours?.weekdays?.end || '21:00'}`,
                `Su ${centerData.working_hours?.sunday?.start || '06:30'}-${centerData.working_hours?.sunday?.end || '13:00'}`
              ]
            })
          }}
        />
      </Head>

      <div className={styles.container}>
        <div className={styles.wrapper}>
          <CenterPage centerData={centerData} />
        </div>
      </div>
    </Layout>
  );
};

export default CenterDetailPage;
