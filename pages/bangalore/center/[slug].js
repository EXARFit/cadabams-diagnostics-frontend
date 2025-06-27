// File: pages/bangalore/center/[slug].js
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CenterPage from './CenterPage';
import styles from './DynamicCenterPage.module.css';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-prod.cadabamsdiagnostics.com/api/v1/cms/component/pagetemplate';

// Enhanced helper function to transform center data with comprehensive error handling
const transformCenterData = (data) => {
  if (!data) {
    console.log('transformCenterData: No data provided');
    return null;
  }
  
  try {
    console.log('transformCenterData: Processing data for', data.basic_info?.center_name);
    
    const transformed = {
      ...data,
      // Ensure services is always an array with proper test handling
      services: Array.isArray(data.services) ? data.services.map((service, serviceIndex) => {
        console.log(`Processing service ${serviceIndex}: ${service.title}`);
        
        const processedTests = Array.isArray(service.tests) ? service.tests
          .map((test, testIndex) => {
            // Handle different test data formats
            if (typeof test === 'string') {
              const trimmed = test.trim();
              console.log(`String test "${trimmed}" - valid: ${!!trimmed}`);
              return trimmed || null; // Return null for empty strings
            }
            
            if (typeof test === 'object' && test !== null) {
              // Extract testName and ensure it's a valid string
              const testName = test.testName || test.name;
              console.log(`Object test - testName: "${testName}" - type: ${typeof testName}`);
              
              // Check if testName exists and is a non-empty string
              if (testName && typeof testName === 'string' && testName.trim()) {
                const result = testName.trim();
                console.log(`Valid testName result: "${result}"`);
                return result;
              }
              
              // If testName is empty string or null/undefined, return null
              console.log('Invalid or empty testName, filtering out');
              return null;
            }
            
            console.log('Unhandled test type, filtering out');
            return null;
          })
          .filter(test => {
            const isValid = test !== null && test !== '' && typeof test === 'string';
            console.log(`Filter check - test: "${test}" - valid: ${isValid}`);
            return isValid;
          }) // Remove null/empty entries and ensure only strings
        : [];
        
        console.log(`Final processed tests for ${service.title}:`, processedTests);
        
        return {
          ...service,
          image: service.icon || service.image || '/placeholder.jpg',
          tests: processedTests
        };
      }) : [],
      // Ensure other required fields exist
      basic_info: data.basic_info || {},
      center_info: data.center_info || {},
      working_hours: data.working_hours || {},
      team: Array.isArray(data.team) ? data.team : [],
      testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
      faq: Array.isArray(data.faq) ? data.faq : [],
      gallery: data.gallery || {},
      video_gallery: data.video_gallery || {},
      other_centers: Array.isArray(data.other_centers) ? data.other_centers : []
    };
    
    console.log('transformCenterData: Successfully transformed data');
    return transformed;
  } catch (error) {
    console.error('transformCenterData: Error transforming data:', error);
    return null;
  }
};

// SEO data preparation function
const getSEOData = (centerData) => {
  if (!centerData || !centerData.basic_info) return {
    title: 'Diagnostic Center | Cadabam\'s Diagnostics Bangalore',
    description: 'Comprehensive diagnostic services in Bangalore',
    keywords: 'diagnostic center bangalore, medical tests, health checkup',
    url: 'https://cadabamsdiagnostics.com/bangalore',
    imageUrl: 'https://cadabamsdiagnostics.com/images/center-default.jpg'
  };

  const center = centerData.basic_info;
  const centerInfo = centerData.center_info || {};

  return {
    title: centerData.seo?.title || `${center.center_name || 'Diagnostic Center'} | Cadabam's Diagnostics Bangalore`,
    description: centerData.seo?.description || `Visit ${center.center_name} for comprehensive medical testing and diagnostic services. ${(center.center_description || '').substring(0, 150)}...`,
    keywords: `diagnostic center bangalore, medical tests, health checkup, ${center.center_name}, ${center.area || 'bangalore'}, diagnostic services`,
    url: `https://cadabamsdiagnostics.com/bangalore/center/${center.location || ''}`,
    imageUrl: center.center_image || centerData.gallery?.reception || 'https://cadabamsdiagnostics.com/images/center-default.jpg'
  };
};

// Server-side props with comprehensive error handling
export async function getServerSideProps(context) {
  const { params, res, req } = context;
  const { slug } = params;

  // Log the incoming request
  console.log('getServerSideProps called with slug:', slug);
  console.log('Request URL:', req.url);

  if (!slug) {
    console.log('No slug provided, redirecting to bangalore');
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

    // Normalize slug: handle both string and array, convert to lowercase
    const normalizedSlug = Array.isArray(slug) ? slug[0].toLowerCase().trim() : slug.toLowerCase().trim();
    
    console.log('Normalized slug:', normalizedSlug);
    
    // Enhanced slug mapping with all variations
    const slugMap = {
      'kanakapura': 'kanakapura',
      'kanakpura': 'kanakapura',  // Common misspelling
      'kanakapura-road': 'kanakapura',
      'jayanagar': 'jayanagar',
      'banashankari': 'banashankari',
      'indiranagar': 'indiranagar',
      'kalyan-nagar': 'kalyannagar',
      'kalyannagar': 'kalyannagar',
      'kalyan_nagar': 'kalyannagar',  // Handle underscore variant
      'kalyan nagar': 'kalyannagar'   // Handle space variant
    };
    
    const finalSlug = slugMap[normalizedSlug] || normalizedSlug;
    console.log('Final slug for API call:', finalSlug);
    
    const apiUrl = `${API_BASE_URL}/center/${finalSlug}`;
    console.log('Making API call to:', apiUrl);
    
    // Make API request with proper error handling
    const response = await axios.get(apiUrl, {
      timeout: 15000, // 15 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Next.js/Cadabams-Website'
      },
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);

    // Handle different response statuses
    if (response.status === 404) {
      console.log('Center not found (404), redirecting to bangalore');
      return {
        redirect: {
          destination: '/bangalore',
          permanent: false,
        },
      };
    }

    if (response.status !== 200) {
      console.log('API returned non-200 status:', response.status);
      throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }

    const responseData = response.data;
    console.log('API Response data structure:', {
      hasData: !!responseData,
      hasDataField: !!responseData?.data,
      dataKeys: responseData ? Object.keys(responseData) : [],
      centerName: responseData?.data?.basic_info?.center_name
    });

    const centerData = responseData?.data;

    if (!centerData) {
      console.log('No center data found in API response');
      return {
        props: {
          centerData: null,
          error: 'Center data not found'
        }
      };
    }

    // Transform the data with the enhanced function
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

    console.log('Successfully processed center data for:', transformedData.basic_info?.center_name);

    return {
      props: {
        centerData: transformedData,
        error: null,
        slug: finalSlug
      }
    };

  } catch (error) {
    console.error('getServerSideProps Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      stack: error.stack
    });
    
    // Determine error type and message
    let errorMessage = 'Failed to load center data';
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Network connection failed';
    } else if (error.response?.status === 404) {
      errorMessage = 'Center not found';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout';
    }

    return {
      props: {
        centerData: null,
        error: errorMessage,
        slug: slug
      }
    };
  }
}

const CenterDetailPage = ({ centerData, error, slug }) => {
  const router = useRouter();

  // Handle loading state
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <h2>Loading center information...</h2>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (!centerData && error) {
    return (
      <Layout title="Error">
        <Head>
          <title>Error | Cadabam's Diagnostics</title>
          <meta name="robots" content="noindex, follow" />
        </Head>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <div className={styles.errorActions}>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push('/bangalore')}
              className={styles.backButton}
            >
              View All Centers
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle case where no data and no error (shouldn't happen)
  if (!centerData) {
    if (typeof window !== 'undefined') {
      router.push('/bangalore');
    }
    return null;
  }

  const seoData = getSEOData(centerData);
  const { center_info = {}, basic_info = {} } = centerData;

  return (
    <Layout title={basic_info.center_name || 'Diagnostic Center'}>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href={`https://cadabamsdiagnostics.com/bangalore/center/${slug || router.query.slug}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:image" content={seoData.imageUrl} />
        <meta property="og:site_name" content="Cadabam's Diagnostics" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.imageUrl} />
        
        {/* Schema.org JSON-LD for FAQ */}
        {centerData.faq && centerData.faq.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": centerData.faq.map(faqItem => ({
                  "@type": "Question",
                  "name": faqItem.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faqItem.answer?.replace(/<[^>]*>/g, '') || ''
                  }
                }))
              })
            }}
          />
        )}

        {/* Schema.org JSON-LD for Medical Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": basic_info.center_name || "Cadabam's Diagnostics",
              "description": basic_info.center_description || "",
              "url": seoData.url,
              "image": seoData.imageUrl,
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
                "contactType": "Customer Service"
              },
              "openingHours": centerData.working_hours ? [
                `Mo-Sa ${centerData.working_hours.weekdays?.start || '06:30'}-${centerData.working_hours.weekdays?.end || '21:00'}`,
                `Su ${centerData.working_hours.sunday?.start || '06:30'}-${centerData.working_hours.sunday?.end || '13:00'}`
              ] : [],
              "priceRange": "$",
              "aggregateRating": centerData.testimonials && centerData.testimonials.length > 0 ? {
                "@type": "AggregateRating",
                "ratingValue": (centerData.testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / centerData.testimonials.length).toFixed(1),
                "reviewCount": centerData.testimonials.length
              } : undefined
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
