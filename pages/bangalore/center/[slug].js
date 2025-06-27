// File: pages/bangalore/center/[slug].js
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CenterPage from './CenterPage';
import styles from './DynamicCenterPage.module.css';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-prod.cadabamsdiagnostics.com/api/v1/cms/component/pagetemplate';

// Safe object property access utility
const safeGet = (obj, path, defaultValue = '') => {
  try {
    return path.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : defaultValue;
    }, obj);
  } catch {
    return defaultValue;
  }
};

// Safe array check utility
const safeArray = (arr) => {
  return Array.isArray(arr) ? arr : [];
};

// Comprehensive data transformation with bulletproof error handling
const transformCenterData = (rawData) => {
  console.log('=== Starting data transformation ===');
  
  if (!rawData || typeof rawData !== 'object') {
    console.warn('transformCenterData: Invalid or missing data, using fallback');
    return createFallbackCenterData();
  }

  try {
    const data = rawData?.data || rawData; // Handle both wrapped and unwrapped data
    
    console.log('Processing center:', safeGet(data, 'basic_info.center_name', 'Unknown Center'));
    
    // Transform basic info with comprehensive defaults
    const basicInfo = {
      center_name: safeGet(data, 'basic_info.center_name', 'Cadabam\'s Diagnostic Center'),
      center_image: safeGet(data, 'basic_info.center_image', ''),
      center_sub_title: safeGet(data, 'basic_info.center_sub_title', 'Quality Diagnostic Services'),
      center_description: safeGet(data, 'basic_info.center_description', 'Comprehensive diagnostic services with advanced technology and expert care.'),
      location: safeGet(data, 'basic_info.location', ''),
      city: safeGet(data, 'basic_info.city', 'bangalore'),
      area: safeGet(data, 'basic_info.area', '')
    };

    // Transform center info with safe defaults
    const centerInfo = {
      address: safeGet(data, 'center_info.address', ''),
      phone: safeGet(data, 'center_info.phone', ''),
      whatsapp: safeGet(data, 'center_info.whatsapp', ''),
      email: safeGet(data, 'center_info.email', 'info@cadabamsdiagnostics.com'),
      map_location: safeGet(data, 'center_info.map_location', '')
    };

    // Transform working hours with safe defaults
    const workingHours = {
      weekdays: {
        start: safeGet(data, 'working_hours.weekdays.start', '06:30'),
        end: safeGet(data, 'working_hours.weekdays.end', '21:00'),
        _id: safeGet(data, 'working_hours.weekdays._id', '')
      },
      sunday: {
        start: safeGet(data, 'working_hours.sunday.start', '06:30'),
        end: safeGet(data, 'working_hours.sunday.end', '13:00'),
        _id: safeGet(data, 'working_hours.sunday._id', '')
      }
    };

    // Transform gallery with safe defaults
    const gallery = {
      reception: safeGet(data, 'gallery.reception', null),
      collection_room: safeGet(data, 'gallery.collection_room', null),
      lab_equipment: safeGet(data, 'gallery.lab_equipment', null),
      waiting_area: safeGet(data, 'gallery.waiting_area', null)
    };

    // Transform SEO with safe defaults
    const seo = {
      title: safeGet(data, 'seo.title', ''),
      description: safeGet(data, 'seo.description', '')
    };

    // Transform video gallery with safe defaults
    const videoGallery = {
      overview: {
        url: safeGet(data, 'video_gallery.overview.url', ''),
        description: safeGet(data, 'video_gallery.overview.description', '')
      },
      testing_process: {
        url: safeGet(data, 'video_gallery.testing_process.url', ''),
        description: safeGet(data, 'video_gallery.testing_process.description', '')
      },
      testimonials: {
        url: safeGet(data, 'video_gallery.testimonials.url', ''),
        description: safeGet(data, 'video_gallery.testimonials.description', '')
      }
    };

    // Transform services with ultra-safe handling
    const services = transformServices(safeArray(data.services));
    
    // Transform team with safe handling
    const team = transformTeam(safeArray(data.team));
    
    // Transform testimonials with safe handling
    const testimonials = transformTestimonials(safeArray(data.testimonials));
    
    // Transform FAQ with safe handling
    const faq = transformFAQ(safeArray(data.faq));

    const transformedData = {
      _id: safeGet(data, '_id', `center-${Date.now()}`),
      basic_info: basicInfo,
      center_info: centerInfo,
      working_hours: workingHours,
      gallery: gallery,
      seo: seo,
      video_gallery: videoGallery,
      services: services,
      team: team,
      testimonials: testimonials,
      faq: faq,
      other_centers: safeArray(data.other_centers),
      health_insights: safeArray(data.health_insights),
      templateName: safeGet(data, 'templateName', 'center'),
      createdAt: safeGet(data, 'createdAt', new Date().toISOString()),
      updatedAt: safeGet(data, 'updatedAt', new Date().toISOString()),
      __v: safeGet(data, '__v', 0)
    };

    console.log('=== Data transformation successful ===');
    console.log(`Center: ${transformedData.basic_info.center_name}`);
    console.log(`Services: ${transformedData.services.length}`);
    console.log(`Team: ${transformedData.team.length}`);
    
    return transformedData;

  } catch (error) {
    console.error('transformCenterData: Transformation error:', error);
    return createFallbackCenterData();
  }
};

// Transform services with comprehensive error handling
const transformServices = (servicesArray) => {
  if (!Array.isArray(servicesArray)) {
    console.warn('transformServices: Invalid services array, using empty array');
    return [];
  }

  return servicesArray.map((service, index) => {
    try {
      const serviceId = safeGet(service, '_id', `service-${index}-${Date.now()}`);
      const title = safeGet(service, 'title', `Service ${index + 1}`);
      const description = safeGet(service, 'description', '');
      const icon = safeGet(service, 'icon', '');
      
      // Transform tests safely
      const tests = transformTests(safeArray(service.tests));
      
      console.log(`Processed service: ${title} with ${tests.length} tests`);
      
      return {
        _id: serviceId,
        title: title,
        description: description,
        icon: icon,
        image: icon || '/placeholder.jpg',
        tests: tests
      };
    } catch (error) {
      console.error(`Error transforming service at index ${index}:`, error);
      return {
        _id: `service-error-${index}`,
        title: `Service ${index + 1}`,
        description: '',
        icon: '',
        image: '/placeholder.jpg',
        tests: []
      };
    }
  });
};

// Transform tests with bulletproof handling
const transformTests = (testsArray) => {
  if (!Array.isArray(testsArray)) {
    return [];
  }

  const validTests = [];
  
  testsArray.forEach((test, index) => {
    try {
      let testName = null;
      
      // Handle different test formats
      if (typeof test === 'string') {
        const trimmed = test.trim();
        if (trimmed && trimmed.length > 0) {
          testName = trimmed;
        }
      } else if (test && typeof test === 'object') {
        // Try multiple possible property names
        const possibleNames = [
          test.testName,
          test.name,
          test.title,
          test.test_name,
          test.label
        ];
        
        for (const name of possibleNames) {
          if (name && typeof name === 'string') {
            const trimmed = name.trim();
            if (trimmed && trimmed.length > 0) {
              testName = trimmed;
              break;
            }
          }
        }
      }
      
      if (testName) {
        validTests.push(testName);
        console.log(`Valid test: "${testName}"`);
      } else {
        console.log(`Skipping invalid test at index ${index}`);
      }
    } catch (error) {
      console.error(`Error processing test at index ${index}:`, error);
    }
  });
  
  return validTests;
};

// Transform team with safe handling
const transformTeam = (teamArray) => {
  if (!Array.isArray(teamArray)) {
    return [];
  }

  return teamArray.map((member, index) => {
    try {
      return {
        _id: safeGet(member, '_id', `team-${index}-${Date.now()}`),
        name: safeGet(member, 'name', 'Team Member'),
        designation: safeGet(member, 'designation', ''),
        experience: safeGet(member, 'experience', ''),
        qualification: safeGet(member, 'qualification', ''),
        image: safeGet(member, 'image', null)
      };
    } catch (error) {
      console.error(`Error transforming team member at index ${index}:`, error);
      return {
        _id: `team-error-${index}`,
        name: 'Team Member',
        designation: '',
        experience: '',
        qualification: '',
        image: null
      };
    }
  });
};

// Transform testimonials with safe handling
const transformTestimonials = (testimonialsArray) => {
  if (!Array.isArray(testimonialsArray)) {
    return [];
  }

  return testimonialsArray.map((testimonial, index) => {
    try {
      return {
        _id: safeGet(testimonial, '_id', `testimonial-${index}-${Date.now()}`),
        name: safeGet(testimonial, 'name', 'Anonymous'),
        content: safeGet(testimonial, 'content', ''),
        location: safeGet(testimonial, 'location', ''),
        rating: parseInt(safeGet(testimonial, 'rating', 5)) || 5,
        date: safeGet(testimonial, 'date', new Date().toISOString())
      };
    } catch (error) {
      console.error(`Error transforming testimonial at index ${index}:`, error);
      return {
        _id: `testimonial-error-${index}`,
        name: 'Anonymous',
        content: '',
        location: '',
        rating: 5,
        date: new Date().toISOString()
      };
    }
  });
};

// Transform FAQ with safe handling
const transformFAQ = (faqArray) => {
  if (!Array.isArray(faqArray)) {
    return [];
  }

  return faqArray.map((faqItem, index) => {
    try {
      return {
        _id: safeGet(faqItem, '_id', `faq-${index}-${Date.now()}`),
        question: safeGet(faqItem, 'question', ''),
        answer: safeGet(faqItem, 'answer', '')
      };
    } catch (error) {
      console.error(`Error transforming FAQ at index ${index}:`, error);
      return {
        _id: `faq-error-${index}`,
        question: '',
        answer: ''
      };
    }
  });
};

// Create fallback center data when transformation fails
const createFallbackCenterData = () => {
  return {
    _id: `fallback-${Date.now()}`,
    basic_info: {
      center_name: 'Cadabam\'s Diagnostic Center',
      center_image: '',
      center_sub_title: 'Quality Diagnostic Services',
      center_description: 'We provide comprehensive diagnostic services with advanced technology and expert medical professionals to support your health journey.',
      location: '',
      city: 'bangalore',
      area: ''
    },
    center_info: {
      address: '',
      phone: '',
      whatsapp: '',
      email: 'info@cadabamsdiagnostics.com',
      map_location: ''
    },
    working_hours: {
      weekdays: { start: '06:30', end: '21:00', _id: '' },
      sunday: { start: '06:30', end: '13:00', _id: '' }
    },
    gallery: {
      reception: null,
      collection_room: null,
      lab_equipment: null,
      waiting_area: null
    },
    seo: {
      title: '',
      description: ''
    },
    video_gallery: {
      overview: { url: '', description: '' },
      testing_process: { url: '', description: '' },
      testimonials: { url: '', description: '' }
    },
    services: [],
    team: [],
    testimonials: [],
    faq: [],
    other_centers: [],
    health_insights: [],
    templateName: 'center',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  };
};

// SEO data preparation with comprehensive error handling
const getSEOData = (centerData) => {
  try {
    if (!centerData || !centerData.basic_info) {
      return getDefaultSEOData();
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
    return getDefaultSEOData();
  }
};

// Default SEO data fallback
const getDefaultSEOData = () => {
  return {
    title: 'Diagnostic Center | Cadabam\'s Diagnostics Bangalore',
    description: 'Comprehensive diagnostic services in Bangalore with advanced technology and expert medical professionals.',
    keywords: 'diagnostic center bangalore, medical tests, health checkup',
    url: 'https://cadabamsdiagnostics.com/bangalore',
    imageUrl: 'https://cadabamsdiagnostics.com/images/center-default.jpg'
  };
};

// Enhanced slug normalization with better mapping
const normalizeSlug = (slug) => {
  if (!slug) return null;
  
  let normalized = Array.isArray(slug) ? slug[0] : slug;
  normalized = normalized.toLowerCase().trim().replace(/[^a-z0-9\-]/g, '');
  
  // Handle known variations
  const slugMappings = {
    'kanakpura': 'kanakapura',
    'kanakapuraroad': 'kanakapura',
    'kalyannagar': 'kalyannagar',
    'kalyan-nagar': 'kalyannagar',
    'indira-nagar': 'indiranagar',
    'jayanagar': 'jayanagar',
    'banashankari': 'banashankari'
  };
  
  return slugMappings[normalized] || normalized;
};

// Generate comprehensive slug variations for API attempts
const generateSlugVariations = (baseSlug) => {
  const variations = new Set([baseSlug]);
  
  // Add common variations
  const commonSlugs = ['kanakapura', 'kalyannagar', 'banashankari', 'indiranagar', 'jayanagar'];
  commonSlugs.forEach(slug => variations.add(slug));
  
  // Add specific mappings
  const mappings = {
    'kanakapura': ['kanakpura', 'kanakapuraroad'],
    'kalyannagar': ['kalyan-nagar', 'kalyannagar'],
    'indiranagar': ['indira-nagar', 'indiranagar'],
  };
  
  if (mappings[baseSlug]) {
    mappings[baseSlug].forEach(variant => variations.add(variant));
  }
  
  return Array.from(variations).filter(Boolean);
};

// Robust API call with retry logic
const fetchCenterData = async (slug, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API attempt ${attempt}/${maxRetries} for slug: ${slug}`);
      
      const apiUrl = `${API_BASE_URL}/center/${slug}`;
      const response = await axios.get(apiUrl, {
        timeout: 15000, // Increased timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Next.js/Cadabams-Website'
        },
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      });

      console.log(`API Response: Status ${response.status} for ${slug}`);

      if (response.status === 200 && response.data) {
        return {
          success: true,
          data: response.data,
          slug: slug
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: 'not_found',
          slug: slug
        };
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      console.log(`Attempt ${attempt} failed for ${slug}:`, error.message);
      
      // If it's the last attempt or a definitive 404, don't retry
      if (attempt === maxRetries || error.response?.status === 404) {
        return {
          success: false,
          error: error.message,
          status: error.response?.status,
          slug: slug
        };
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
  
  return {
    success: false,
    error: 'Max retries exceeded',
    slug: slug
  };
};

// Server-side props with bulletproof error handling
export async function getServerSideProps(context) {
  const { params, res, req } = context;
  const { slug } = params;

  console.log('=== getServerSideProps START ===');
  console.log('Raw slug:', slug);
  console.log('Request URL:', req.url);

  // Validate slug
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
    // Set cache headers for better performance
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );

    // Normalize and generate slug variations
    const normalizedSlug = normalizeSlug(slug);
    if (!normalizedSlug) {
      return {
        redirect: {
          destination: '/bangalore',
          permanent: false,
        },
      };
    }

    const slugVariations = generateSlugVariations(normalizedSlug);
    console.log('Trying slug variations:', slugVariations);

    let result = null;
    
    // Try each slug variation
    for (const trySlug of slugVariations) {
      result = await fetchCenterData(trySlug);
      
      if (result.success) {
        console.log(`SUCCESS: Found data with slug "${trySlug}"`);
        break;
      }
      
      if (result.error === 'not_found') {
        console.log(`404 for slug "${trySlug}", trying next variation`);
        continue;
      }
      
      console.log(`Error for slug "${trySlug}":`, result.error);
    }

    // Handle no data found
    if (!result || !result.success) {
      console.log('No data found for any slug variation');
      
      // Check if it's a definitive 404
      if (result?.status === 404 || result?.error === 'not_found') {
        return {
          redirect: {
            destination: '/bangalore',
            permanent: false,
          },
        };
      }
      
      // Return error page for other failures
      return {
        props: {
          centerData: null,
          error: `Center not found. Please check the URL or try again later.`,
          slug: normalizedSlug
        }
      };
    }

    // Transform the data
    const transformedData = transformCenterData(result.data);
    
    if (!transformedData) {
      console.error('Data transformation failed completely');
      return {
        props: {
          centerData: createFallbackCenterData(),
          error: null,
          slug: result.slug,
          warning: 'Using fallback data due to transformation error'
        }
      };
    }

    console.log('=== SUCCESS ===');
    console.log('Center name:', transformedData.basic_info?.center_name);
    console.log('Services count:', transformedData.services?.length || 0);
    console.log('=== getServerSideProps END ===');

    return {
      props: {
        centerData: transformedData,
        error: null,
        slug: result.slug
      }
    };

  } catch (error) {
    console.error('=== CRITICAL ERROR ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3),
      slug: slug
    });
    
    // Always return fallback data instead of breaking the page
    return {
      props: {
        centerData: createFallbackCenterData(),
        error: null,
        slug: slug,
        warning: 'Using fallback data due to server error'
      }
    };
  }
}

// Main component with comprehensive error handling
const CenterDetailPage = ({ centerData, error, slug, warning }) => {
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

  // Always ensure we have valid center data
  const validCenterData = centerData || createFallbackCenterData();
  const seoData = getSEOData(validCenterData);
  const { center_info = {}, basic_info = {} } = validCenterData;

  // Handle error state (only show error if no data at all)
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
        {validCenterData.faq && validCenterData.faq.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": validCenterData.faq.map(faqItem => ({
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
              "openingHours": validCenterData.working_hours ? [
                `Mo-Sa ${validCenterData.working_hours.weekdays?.start || '06:30'}-${validCenterData.working_hours.weekdays?.end || '21:00'}`,
                `Su ${validCenterData.working_hours.sunday?.start || '06:30'}-${validCenterData.working_hours.sunday?.end || '13:00'}`
              ] : [],
              "priceRange": "$$",
              "aggregateRating": validCenterData.testimonials && validCenterData.testimonials.length > 0 ? {
                "@type": "AggregateRating",
                "ratingValue": (validCenterData.testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / validCenterData.testimonials.length).toFixed(1),
                "reviewCount": validCenterData.testimonials.length
              } : undefined
            })
          }}
        />
      </Head>

      <div className={styles.container}>
        {warning && (
          <div className={styles.warningBanner}>
            <span>⚠️ Some information may be limited due to connectivity issues.</span>
          </div>
        )}
        <div className={styles.wrapper}>
          <CenterPage centerData={validCenterData} />
        </div>
      </div>
    </Layout>
  );
};

export default CenterDetailPage;
