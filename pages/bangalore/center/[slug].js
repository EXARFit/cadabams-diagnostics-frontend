// File: pages/bangalore/center/[slug].js
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CenterPage from './CenterPage';
import styles from './DynamicCenterPage.module.css';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-prod.cadabamsdiagnostics.com/api/v1/cms/component/pagetemplate';

// Completely robust helper function to transform center data
const transformCenterData = (data) => {
  if (!data) {
    console.log('transformCenterData: No data provided');
    return null;
  }
  
  try {
    console.log('transformCenterData: Processing data for', data.basic_info?.center_name);
    
    // Ensure all required fields exist with proper defaults
    const transformed = {
      ...data,
      basic_info: {
        center_name: '',
        center_image: '',
        center_sub_title: '',
        center_description: '',
        location: '',
        city: 'bangalore',
        area: '',
        ...data.basic_info
      },
      center_info: {
        address: '',
        phone: '',
        whatsapp: '',
        email: '',
        map_location: '',
        ...data.center_info
      },
      working_hours: {
        weekdays: { start: '06:30', end: '21:00' },
        sunday: { start: '06:30', end: '13:00' },
        ...data.working_hours
      },
      gallery: {
        reception: null,
        collection_room: null,
        lab_equipment: null,
        waiting_area: null,
        ...data.gallery
      },
      seo: {
        title: '',
        description: '',
        ...data.seo
      },
      video_gallery: {
        overview: { url: '', description: '' },
        testing_process: { url: '', description: '' },
        testimonials: { url: '', description: '' },
        ...data.video_gallery
      },
      // Process services array with comprehensive error handling
      services: Array.isArray(data.services) ? data.services.map((service, serviceIndex) => {
        console.log(`Processing service ${serviceIndex}: ${service?.title || 'Unknown'}`);
        
        // Ensure service has required fields
        const processedService = {
          _id: service._id || `service-${serviceIndex}`,
          title: service.title || 'Service',
          description: service.description || '',
          icon: service.icon || '',
          image: service.icon || service.image || '/placeholder.jpg',
          tests: []
        };
        
        // Process tests with ultra-safe handling
        if (Array.isArray(service.tests)) {
          const processedTests = [];
          
          service.tests.forEach((test, testIndex) => {
            try {
              let testName = null;
              
              // Handle string tests
              if (typeof test === 'string') {
                const trimmed = test.trim();
                if (trimmed && trimmed.length > 0) {
                  testName = trimmed;
                }
              }
              // Handle object tests
              else if (test && typeof test === 'object') {
                const candidateName = test.testName || test.name || test.title;
                if (candidateName && typeof candidateName === 'string') {
                  const trimmed = candidateName.trim();
                  if (trimmed && trimmed.length > 0) {
                    testName = trimmed;
                  }
                }
              }
              
              // Only add valid test names
              if (testName) {
                console.log(`Valid test found: "${testName}"`);
                processedTests.push(testName);
              } else {
                console.log(`Invalid test at index ${testIndex}, skipping`);
              }
            } catch (testError) {
              console.error(`Error processing test ${testIndex}:`, testError);
            }
          });
          
          processedService.tests = processedTests;
          console.log(`Final tests for ${processedService.title}:`, processedTests);
        }
        
        return processedService;
      }) : [],
      
      // Safely process other arrays
      team: Array.isArray(data.team) ? data.team.map(member => ({
        _id: member._id || `team-${Date.now()}`,
        name: member.name || 'Team Member',
        designation: member.designation || '',
        experience: member.experience || '',
        qualification: member.qualification || '',
        image: member.image || null,
        ...member
      })) : [],
      
      testimonials: Array.isArray(data.testimonials) ? data.testimonials.map(testimonial => ({
        _id: testimonial._id || `testimonial-${Date.now()}`,
        name: testimonial.name || 'Anonymous',
        content: testimonial.content || '',
        location: testimonial.location || '',
        rating: testimonial.rating || 5,
        date: testimonial.date || new Date().toISOString(),
        ...testimonial
      })) : [],
      
      faq: Array.isArray(data.faq) ? data.faq.map(faqItem => ({
        _id: faqItem._id || `faq-${Date.now()}`,
        question: faqItem.question || '',
        answer: faqItem.answer || '',
        ...faqItem
      })) : [],
      
      other_centers: Array.isArray(data.other_centers) ? data.other_centers : [],
      health_insights: Array.isArray(data.health_insights) ? data.health_insights : [],
      
      // Preserve original fields
      templateName: data.templateName || 'center',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      __v: data.__v,
      _id: data._id
    };
    
    console.log('transformCenterData: Successfully transformed data');
    return transformed;
  } catch (error) {
    console.error('transformCenterData: Critical error:', error);
    // Return a minimal safe structure instead of null
    return {
      basic_info: {
        center_name: 'Diagnostic Center',
        center_image: '',
        center_sub_title: '',
        center_description: '',
        location: '',
        city: 'bangalore',
        area: ''
      },
      center_info: {
        address: '',
        phone: '',
        whatsapp: '',
        email: '',
        map_location: ''
      },
      working_hours: {
        weekdays: { start: '06:30', end: '21:00' },
        sunday: { start: '06:30', end: '13:00' }
      },
      services: [],
      team: [],
      testimonials: [],
      faq: [],
      gallery: {},
      seo: {},
      video_gallery: {},
      other_centers: [],
      health_insights: []
    };
  }
};

// SEO data preparation function with safe fallbacks
const getSEOData = (centerData) => {
  try {
    if (!centerData || !centerData.basic_info) {
      return {
        title: 'Diagnostic Center | Cadabam\'s Diagnostics Bangalore',
        description: 'Comprehensive diagnostic services in Bangalore',
        keywords: 'diagnostic center bangalore, medical tests, health checkup',
        url: 'https://cadabamsdiagnostics.com/bangalore',
        imageUrl: 'https://cadabamsdiagnostics.com/images/center-default.jpg'
      };
    }

    const center = centerData.basic_info;
    const centerInfo = centerData.center_info || {};
    const seo = centerData.seo || {};

    const centerName = center.center_name || 'Diagnostic Center';
    const description = center.center_description || '';
    const area = center.area || center.location || 'bangalore';

    return {
      title: seo.title || `${centerName} | Cadabam's Diagnostics Bangalore`,
      description: seo.description || `Visit ${centerName} for comprehensive medical testing and diagnostic services. ${description.substring(0, 150)}${description.length > 150 ? '...' : ''}`,
      keywords: `diagnostic center bangalore, medical tests, health checkup, ${centerName}, ${area}, diagnostic services`,
      url: `https://cadabamsdiagnostics.com/bangalore/center/${area.toLowerCase().replace(/\s+/g, '')}`,
      imageUrl: center.center_image || centerData.gallery?.reception || 'https://cadabamsdiagnostics.com/images/center-default.jpg'
    };
  } catch (error) {
    console.error('getSEOData error:', error);
    return {
      title: 'Diagnostic Center | Cadabam\'s Diagnostics Bangalore',
      description: 'Comprehensive diagnostic services in Bangalore',
      keywords: 'diagnostic center bangalore, medical tests, health checkup',
      url: 'https://cadabamsdiagnostics.com/bangalore',
      imageUrl: 'https://cadabamsdiagnostics.com/images/center-default.jpg'
    };
  }
};

// Server-side props with ultra-robust error handling
export async function getServerSideProps(context) {
  const { params, res, req } = context;
  const { slug } = params;

  console.log('=== getServerSideProps START ===');
  console.log('Raw slug:', slug);
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

    // Ultra-robust slug normalization
    let normalizedSlug = Array.isArray(slug) ? slug[0] : slug;
    normalizedSlug = normalizedSlug.toLowerCase().trim().replace(/[^a-z0-9\-]/g, '');
    
    console.log('Normalized slug:', normalizedSlug);
    
    // Comprehensive slug mapping - try multiple API endpoints
    const slugVariations = [
      normalizedSlug,
      // Direct mappings
      normalizedSlug === 'kanakapura' ? 'kanakapura' : null,
      normalizedSlug === 'kanakpura' ? 'kanakapura' : null,
      normalizedSlug === 'kanakapuraroad' ? 'kanakapura' : null,
      normalizedSlug === 'kalyannagar' ? 'kalyannagar' : null,
      normalizedSlug === 'kalyannagar' ? 'kalyan-nagar' : null,
      normalizedSlug === 'kalyannagar' ? 'Kalyan Nagar' : null,
      normalizedSlug === 'banashankari' ? 'banashankari' : null,
      normalizedSlug === 'indiranagar' ? 'indiranagar' : null,
      normalizedSlug === 'jayanagar' ? 'jayanagar' : null,
      // Alternative spellings
      'kanakapura',
      'kalyannagar', 
      'banashankari',
      'indiranagar',
      'jayanagar'
    ].filter(Boolean);

    let centerData = null;
    let successfulSlug = null;
    let lastError = null;

    // Try each slug variation until one works
    for (const trySlug of slugVariations) {
      try {
        console.log(`Trying API call with slug: "${trySlug}"`);
        const apiUrl = `${API_BASE_URL}/center/${trySlug}`;
        
        const response = await axios.get(apiUrl, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Next.js/Cadabams-Website'
          },
          validateStatus: function (status) {
            return status < 500;
          }
        });

        console.log(`API Response for ${trySlug}: Status ${response.status}`);

        if (response.status === 200 && response.data?.data) {
          centerData = response.data.data;
          successfulSlug = trySlug;
          console.log(`SUCCESS: Found data with slug "${trySlug}"`);
          console.log('Center name:', centerData.basic_info?.center_name);
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch data for slug "${trySlug}":`, error.message);
        lastError = error;
        continue;
      }
    }

    // Handle case where no data was found
    if (!centerData) {
      console.log('No data found for any slug variation');
      
      // If it's a 404, redirect to bangalore page
      if (lastError?.response?.status === 404) {
        return {
          redirect: {
            destination: '/bangalore',
            permanent: false,
          },
        };
      }
      
      // Otherwise return error props
      return {
        props: {
          centerData: null,
          error: `Center not found. Tried variations: ${slugVariations.join(', ')}`,
          slug: normalizedSlug
        }
      };
    }

    // Transform the data safely
    const transformedData = transformCenterData(centerData);
    
    if (!transformedData) {
      console.error('Data transformation returned null');
      return {
        props: {
          centerData: null,
          error: 'Failed to process center data',
          slug: normalizedSlug
        }
      };
    }

    console.log('=== SUCCESS ===');
    console.log('Successfully processed center:', transformedData.basic_info?.center_name);
    console.log('Services count:', transformedData.services?.length || 0);
    console.log('=== getServerSideProps END ===');

    return {
      props: {
        centerData: transformedData,
        error: null,
        slug: successfulSlug || normalizedSlug
      }
    };

  } catch (error) {
    console.error('=== CRITICAL ERROR ===');
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      stack: error.stack?.split('\n').slice(0, 5)
    });
    
    // Determine error message
    let errorMessage = 'Failed to load center data';
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Network connection failed';
    } else if (error.response?.status === 404) {
      return {
        redirect: {
          destination: '/bangalore',
          permanent: false,
        },
      };
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error - please try again later';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - please try again';
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

// Main component with comprehensive error handling
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

  // Handle case where no data and no error
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
        <link rel="canonical" href={`https://cadabamsdiagnostics.com/bangalore/center/${slug}`} />
        
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
                  "name": faqItem.question || '',
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": (faqItem.answer || '').replace(/<[^>]*>/g, '')
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
              "priceRange": "$$",
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
