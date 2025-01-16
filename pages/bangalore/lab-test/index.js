// pages/[location]/lab-test.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import Layout from '@/components/Layout';
import LabtestHero from '@/components/labtest/LabtestHero';
import PopularTests from '@/components/labtest/PopularTests';
import CheckupsSection from '@/components/home/CheckupsSection';
import VitalOrgans from '@/components/labtest/VitalOrgans';
import MultiTestSection from '@/components/labtest/MultiTestSection';
import BannerCarousel from '@/components/home/BannerCarousel';
import FeatureSection from '@/components/labtest/FeatureSection';
import DiscountBanner from '@/components/labtest/DiscountBanner';
import HealthCheckupSlider from '@/components/home/HeathcheckupSlider';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/labtest-home/671dcc88de80dea24f266179';

// Helper function to capitalize location names
const capitalizeLocation = (loc) => {
  if (!loc) return 'Bangalore';
  return loc.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to format currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price);
};

// Helper function for date formatting
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// Helper function to generate location-aware URLs
const generateLocationUrl = (baseUrl, location, hasBangalore, path = '') => {
  if (hasBangalore) {
    return `${baseUrl}/bangalore/${location ? `${location}/` : ''}${path}`;
  }
  return `${baseUrl}/${location ? `${location}/` : ''}${path}`;
};

// Generate all required schemas
const generateSchemas = (locationName, baseUrl, location, hasBangalore, pageData) => {
  const currentUrl = generateLocationUrl(baseUrl, location, hasBangalore, 'lab-test');
  
  const pageTitle = location 
    ? `Reliable Lab Tests  ${hasBangalore ? `in ${locationName}` : 'near you'} | Cadabams Diagnostics`
    : `Reliable Lab Tests  ${hasBangalore ? `in ${locationName}` : 'near you'} | Cadabams Diagnostics`;
    
  const pageDescription = location
    ? `Get accurate and reliable lab test services in ${locationName} at Cadabams Diagnostics. From routine blood tests to advanced diagnostics, we ensure precise results with state-of-the-art technology and expert care. Book your test today!`
    : 'Get accurate and reliable lab test services in Bangalore at Cadabams Diagnostics. From routine blood tests to advanced diagnostics, we ensure precise results with state-of-the-art technology and expert care. Book your test today!';

  // Medical Webpage Schema
  const medicalWebpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: pageTitle,
    description: pageDescription,
    url: currentUrl,
    image: `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`,
    citation: 'https://',
    audio: {
      '@type': 'AudioObject',
      contentUrl: '',
      description: '',
      duration: 'T0M15S',
      encodingFormat: 'audio/mpeg',
      name: ''
    },
    hasMap: 'https://google.com/maps',
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
        'https://linkedin.com/in/shreyas-cadabam-30a2429a/',
        'https://instagram.com/cadabams_diagnostics/',
        'https://facebook.com/cadabamsdiagnostics',
        'https://twitter.com/CadabamsDX',
        'https://linkedin.com/company/cadabam\'s-group/'
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
    alternativeHeadline: `Comprehensive Lab Tests in ${locationName}`,
    dateCreated: formatDate(pageData?.createdAt || new Date()),
    dateModified: formatDate(pageData?.updatedAt || new Date()),
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Cadabams Diagnostics'
    },
    keywords: `lab tests, medical tests, diagnostic tests, blood tests, pathology lab, ${locationName}, healthcare`

  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cadabams Diagnostics',
    alternateName: 'Cadabams Diagnostic Center',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: `Leading diagnostic center in ${locationName} providing comprehensive medical testing services.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Healthcare Street',
      addressLocality: locationName,
      addressRegion: 'Karnataka',
      postalCode: '560001',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+918050381444',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi', 'kn']
    },
    sameAs: [
      'https://www.facebook.com/cadabamsdiagnostics',
      'https://twitter.com/CadabamsDX',
      'https://www.linkedin.com/company/cadabam\'s-group/',
      'https://www.instagram.com/cadabams_diagnostics/'
    ]
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
        name: 'Bangalore',
        item: `${baseUrl}/bangalore`
      },
      ...(location ? [{
        '@type': 'ListItem',
        position: 3,
        name: locationName,
        item: `${baseUrl}/bangalore/${location}`
      }] : []),
      {
        '@type': 'ListItem',
        position: location ? 4 : 3,
        name: 'Lab Tests',
        item: currentUrl
      }
    ]
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiagnosticLab',
    name: `Cadabams Diagnostics - ${locationName}`,
    image: [
      `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`
    ],
    '@id': currentUrl,
    url: currentUrl,
    telephone: '+918050381444',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Healthcare Street',
      addressLocality: locationName,
      addressRegion: 'Karnataka',
      postalCode: '560001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9716,
      longitude: 77.5946
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    },
    sameAs: [
      'https://www.facebook.com/cadabamsdiagnostics',
      'https://twitter.com/CadabamsDX',
      'https://www.instagram.com/cadabams_diagnostics/'
    ]
  };

  return [
    medicalWebpageSchema,
    organizationSchema,
    breadcrumbSchema,
    localBusinessSchema
  ];
};

// Helper function to track test impressions
const trackTestImpressions = (analytics, tests, listName, offset = 0) => {
  if (!tests?.length) return;

  analytics.trackViewItemList(
    tests.map((test, index) => ({
      ...test,
      index: offset + index,
      list_name: listName
    })),
    listName
  );
};

// Helper function to get section data
const getSectionData = (pageData, sectionId) => {
  switch(sectionId) {
    case 'hero':
      return {
        tests: pageData?.hero?.tests || [],
        title: 'Hero Tests'
      };
    case 'test_card':
      return {
        tests: pageData?.test_card?.tests || [],
        title: 'Featured Tests'
      };
    case 'health_monitoring':
      return {
        tests: pageData?.healthMonitoring?.content?.map(item => item.test) || [],
        title: 'Health Monitoring Tests'
      };
    default:
      return pageData?.multiTestSection?.find(section => section._id === sectionId);
  }
};

export async function getServerSideProps({ query, req, res }) {
  const { location } = query;
  const baseUrl = 'https://cadabamsdiagnostics.com';
  const locationName = capitalizeLocation(location);
  const hasBangalore = req.url.includes('/bangalore/');

  try {
    const response = await axios.get(API_BASE_URL);
    const pageData = response.data.success ? response.data.data : null;

    const pageTitle = location 
      ? `Reliable Lab Tests  ${hasBangalore ? `in ${locationName}` : 'near you'} | Cadabams Diagnostics`
      : `Reliable Lab Tests ${hasBangalore ? `in ${locationName}` : 'near you'} | Cadabams Diagnostics`
    
    const pageDescription = location
      ? `Get accurate and reliable lab test services in ${locationName} at Cadabams Diagnostics. From routine blood tests to advanced diagnostics, we ensure precise results with state-of-the-art technology and expert care. Book your test today!`
      : 'Get accurate and reliable lab test services in Bangalore at Cadabams Diagnostics. From routine blood tests to advanced diagnostics, we ensure precise results with state-of-the-art technology and expert care. Book your test today!';

    const currentUrl = generateLocationUrl(baseUrl, location, hasBangalore, 'lab-test');

    // Set cache control headers
    if (res) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      );
    }

    return {
      props: {
        pageData,
        baseUrl,
        locationName,
        pageTitle,
        pageDescription,
        currentUrl,
        location: location || null,
        hasBangalore,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Server-side error:', error);
    
    // Log error details for debugging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status
    };
    console.error('Error details:', errorDetails);

    return {
      props: {
        pageData: null,
        error: 'Failed to fetch data',
        errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : null,
        baseUrl,
        locationName,
        location: location || null,
        hasBangalore,
        lastUpdated: new Date().toISOString()
      }
    };
  }
}

// Main component
export default function LabtestPage({ 
  pageData, 
  baseUrl, 
  locationName, 
  pageTitle, 
  pageDescription, 
  currentUrl,
  location,
  error,
  errorDetails,
  hasBangalore,
  lastUpdated
}) {
  const router = useRouter();
  const analytics = useAnalytics();
  const [viewedSections, setViewedSections] = useState(new Set());
  const [initialTrackingComplete, setInitialTrackingComplete] = useState(false);
  const [visibleTests, setVisibleTests] = useState(new Set());
  const [isPageVisible, setIsPageVisible] = useState(true);
  const schemas = generateSchemas(locationName, baseUrl, location, hasBangalore, pageData);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Initial tracking of all test lists
  useEffect(() => {
    if (pageData && !initialTrackingComplete && isPageVisible) {
      let totalTests = 0;

      // Function to track a section's tests
      const trackSection = (tests, sectionName, offset = 0) => {
        if (tests?.length > 0) {
          analytics.trackViewItemList(
            tests.map((test, index) => ({
              ...test,
              index: offset + index,
              list_name: sectionName,
              section: sectionName
            })),
            sectionName
          );
          totalTests += tests.length;
        }
      };

      // Track all sections
      if (pageData.hero?.tests) {
        trackSection(pageData.hero.tests, 'Hero Featured Tests', 0);
      }

      if (pageData.test_card?.tests) {
        trackSection(pageData.test_card.tests, 'Featured Tests', 100);
      }

      pageData.multiTestSection?.forEach((section, idx) => {
        if (section.tests) {
          trackSection(
            section.tests,
            section.title || `Test Section ${idx + 1}`,
            (idx + 2) * 100
          );
        }
      });

      if (pageData.healthMonitoring?.content) {
        trackSection(
          pageData.healthMonitoring.content.map(item => item.test),
          'Health Monitoring Tests',
          1000
        );
      }

      // Log total tests tracked for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Tracked ${totalTests} tests across all sections`);
      }

      setInitialTrackingComplete(true);
    }
  }, [pageData, analytics, initialTrackingComplete, isPageVisible]);

  // Track test impressions using Intersection Observer
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const testId = entry.target.dataset.testId;
          const sectionId = entry.target.dataset.sectionId;

          if (testId && !visibleTests.has(testId)) {
            const section = getSectionData(pageData, sectionId);
            const test = section?.tests?.find(t => t._id === testId || t.id === testId);

            if (test) {
              analytics.trackViewItem({
                ...test,
                section: section.title,
                viewTimestamp: new Date().toISOString()
              });
              setVisibleTests(prev => new Set([...prev, testId]));
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
      rootMargin: '0px'
    });

    // Observe all test elements
    document.querySelectorAll('[data-test-id]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pageData, analytics, visibleTests]);

  // Section visibility tracking
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.dataset.sectionId;
            if (sectionId && !viewedSections.has(sectionId)) {
              const section = getSectionData(pageData, sectionId);
              if (section?.tests?.length > 0) {
                analytics.trackViewItemList(
                  section.tests.map((test, index) => ({
                    ...test,
                    index,
                    section: section.title
                  })),
                  section.title || 'Test Section'
                );
                setViewedSections(prev => new Set([...prev, sectionId]));
              }
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-section-id]').forEach(el => {
      sectionObserver.observe(el);
    });

    return () => sectionObserver.disconnect();
  }, [pageData, viewedSections, analytics]);

  // Event Handlers
  const handleTestSelect = (test, section) => {
    analytics.trackSelectItem(
      {
        ...test,
        section: section.title,
        selectionTimestamp: new Date().toISOString()
      },
      section.title || 'Test List',
      test.index
    );
    
    // Handle navigation
    const testUrl = `/bangalore/${location ? `${location}/` : ''}lab-test/${test.route || test.slug}`;
    router.push(testUrl);
  };

  const handleAddToCart = (test, section) => {
    analytics.trackAddToCart(
      {
        ...test,
        section: section.title,
        addedTimestamp: new Date().toISOString()
      },
      1,
      section.title
    );
  };

  const handleRemoveFromCart = (test, section) => {
    analytics.trackRemoveFromCart(
      {
        ...test,
        section: section.title,
        removedTimestamp: new Date().toISOString()
      }
    );
  };

  // Error handling
  if (error) {
    return (
      <AuthProvider>
        <Layout>
          <div className={styles.errorContainer}>
            <h1>Error Loading Page</h1>
            <p>{error}</p>
            {errorDetails && process.env.NODE_ENV === 'development' && (
              <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
            )}
            <button onClick={() => router.reload()} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  if (!pageData) {
    return (
      <AuthProvider>
        <Layout>
          <div className={styles.noDataContainer}>
            <h1>No Data Available</h1>
            <p>Please try again later or contact support if the issue persists.</p>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Layout title={pageTitle}>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={`lab tests, medical tests, diagnostic tests, blood tests, pathology lab, ${hasBangalore ? locationName : 'near you'}, healthcare`} />
          
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={currentUrl} />
          
          {/* Open Graph Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content={`${baseUrl}/images/og-image.jpg`} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:site_name" content="Cadabams Diagnostics" />
          
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={`${baseUrl}/images/og-image.jpg`} />
          
          {/* Schemas */}
          {schemas.map((schema, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
          ))}
        </Head>

        <div data-section-id="hero">
          <LabtestHero 
            heroData={pageData?.hero}
            onTestSelect={(test) => handleTestSelect(test, { title: 'Hero Section' })}
            onAddToCart={(test) => handleAddToCart(test, { title: 'Hero Section' })}
            onRemoveFromCart={(test) => handleRemoveFromCart(test, { title: 'Hero Section' })}
          />
        </div>

        <FeatureSection features={pageData?.features} />

        <div data-section-id="test_card">
          <MultiTestSection 
            testData={pageData?.test_card}
            onTestSelect={(test) => handleTestSelect(test, { title: 'Featured Tests' })}
            onAddToCart={(test) => handleAddToCart(test, { title: 'Featured Tests' })}
            onRemoveFromCart={(test) => handleRemoveFromCart(test, { title: 'Featured Tests' })}
          />
        </div>

        <div data-section-id="health_monitoring">
          <HealthCheckupSlider 
            healthData={pageData?.healthMonitoring}
            onTestSelect={(test) => handleTestSelect(test, { title: 'Health Monitoring' })}
            onAddToCart={(test) => handleAddToCart(test, { title: 'Health Monitoring' })}
            onRemoveFromCart={(test) => handleRemoveFromCart(test, { title: 'Health Monitoring' })}
          />
        </div>

        {pageData?.multiTestSection?.map((section) => (
          <div key={section._id} data-section-id={section._id}>
            <MultiTestSection 
              sections={[section]}
              onTestSelect={(test) => handleTestSelect(test, section)}
              onAddToCart={(test) => handleAddToCart(test, section)}
              onRemoveFromCart={(test) => handleRemoveFromCart(test, section)}
            />
          </div>
        ))}

        <BannerCarousel banners={pageData?.banner} />
      </Layout>
    </AuthProvider>
  );
}