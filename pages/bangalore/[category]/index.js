// pages/[category].js
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CategoryOverview from '@/components/CategoryOverview';
import NonLabTestPage1 from '@/components/NonLabTestPage1';
import RelatedTests from '@/components/RelatedTests';
import { useCart } from '@/contexts/CartContext';
import styles from '../Category.module.css';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

// Helper Functions
const formatCategoryTitle = (category) => {
  const titles = {
    'mri-scan': 'MRI Scan Centre',
    'ct-scan': 'CT Scan Centre',
    'ultrasound-scan': 'Ultrasound Scan Centre',
    'xray-scan': 'X-ray Scan Centre',
    'pregnancy-scan': 'Pregnancy Scan Centre'
  };
  return titles[category] || 'Diagnostic Centre';
};

const formatCategoryDescription = (category) => {
  const descriptions = {
    'mri-scan': 'Get accurate imaging with MRI scans',
    'ct-scan': 'Book CT scans for advanced diagnostic imaging',
    'ultrasound-scan': 'Book ultrasound scans for accurate imaging',
    'xray-scan': 'Book X-ray scans for accurate results',
    'pregnancy-scan': 'Book pregnancy scans for comprehensive prenatal care'
  };
  return descriptions[category] || 'Book diagnostic scans';
};

const capitalizeLocation = (loc) => {
  if (!loc) return 'Bangalore';
  return loc.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Schema Generator Functions
const generateMedicalWebpageSchema = (data, locationName, currentUrl) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: data.title,
  description: data.description,
  url: currentUrl,
  image: data.imageUrl,
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
    name: 'Medical Testing'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: '100'
  },
  alternativeHeadline: `Diagnostic Tests in ${locationName}`,
  dateCreated: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  copyrightHolder: {
    '@type': 'Organization',
    name: 'Cadabams Diagnostics'
  },
  keywords: data.keywords
});

const generateFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

const generateBreadcrumbSchema = (locationName, baseUrl, currentUrl) => ({
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
      name: locationName,
      item: `${baseUrl}/bangalore`
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Diagnostics',
      item: currentUrl
    }
  ]
});

const generateLocalBusinessSchema = (locationName, currentUrl) => ({
  '@context': 'https://schema.org',
  '@type': 'DiagnosticLab',
  name: `Cadabams Diagnostics - ${locationName}`,
  image: `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`,
  '@id': currentUrl,
  url: currentUrl,
  telephone: '+918050381444',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brigade Road',
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
  department: [
    {
      '@type': 'MedicalSpecialty',
      name: 'Laboratory',
      availableService: {
        '@type': 'MedicalTest',
        name: 'Blood Tests'
      }
    },
    {
      '@type': 'MedicalSpecialty',
      name: 'Radiology',
      availableService: {
        '@type': 'MedicalTest',
        name: 'Diagnostic Imaging'
      }
    }
  ],
  medicalSpecialty: [
    'Diagnostic Imaging',
    'Laboratory Medicine',
    'Radiology'
  ]
});

const generateOrganizationSchema = (baseUrl, locationName) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cadabams Diagnostics',
  alternateName: 'Cadabams Diagnostic Center',
  url: baseUrl,
  logo: `${baseUrl}/images/logo.png`,
  sameAs: [
    'https://www.facebook.com/cadabamsdiagnostics',
    'https://twitter.com/CadabamsDX',
    'https://www.instagram.com/cadabams_diagnostics/',
    'https://www.linkedin.com/company/cadabam\'s-group/'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+918050381444',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi', 'Kannada']
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brigade Road',
    addressLocality: locationName,
    addressRegion: 'Karnataka',
    postalCode: '560001',
    addressCountry: 'IN'
  }
});

// GTM Event Tracking Functions
const trackPageView = (category) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_type: 'category',
      page_category: category,
      timestamp: new Date().toISOString()
    });
  }
};

const trackViewItemList = (items, listName) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: listName,
        item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
        items: items.map((item, index) => ({
          item_id: item._id || item.id,
          item_name: item.testName || item.name,
          affiliation: "Cadabam's Diagnostics",
          item_brand: "Cadabam's Diagnostics",
          item_category: formatCategoryTitle(item.category),
          item_category2: item.alldata?.[0]?.basic_info?.category || '',
          price: item.alldata?.[0]?.basic_info?.price || 0,
          discount: item.alldata?.[0]?.basic_info?.discount || 0,
          index: index,
          quantity: 1,
          timestamp: new Date().toISOString()
        }))
      }
    });
  }
};

const trackSelectItem = (item, listName, index) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'select_item',
      ecommerce: {
        item_list_name: listName,
        item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
        items: [{
          item_id: item._id || item.id,
          item_name: item.testName || item.name,
          affiliation: "Cadabam's Diagnostics",
          item_brand: "Cadabam's Diagnostics",
          item_category: formatCategoryTitle(item.category),
          item_category2: item.alldata?.[0]?.basic_info?.category || '',
          price: item.alldata?.[0]?.basic_info?.price || 0,
          discount: item.alldata?.[0]?.basic_info?.discount || 0,
          index: index,
          quantity: 1,
          timestamp: new Date().toISOString()
        }]
      }
    });
  }
};

// Continue from previous code...

export async function getServerSideProps({ params, query, res, req }) {
  const { category } = params;
  const location = query.location || null;
  const baseUrl = 'https://cadabamsdiagnostics.com';
  const hasBangalore = req.url.includes('/bangalore/');

  try {
    const response = await axios.get(`${API_BASE_URL}/${category}`);
    
    if (!response.data.success || !response.data.data?.[0]) {
      return { notFound: true };
    }

    const categoryData = response.data.data[0];
    const locationName = capitalizeLocation(location || '');
    const categoryTitle = formatCategoryTitle(category);
    const categoryDesc = formatCategoryDescription(category);
    
    const seoLocation = hasBangalore ? `in ${locationName}` : 'near you';
    const currentUrl = hasBangalore 
      ? `${baseUrl}/bangalore${location ? `/${location}` : ''}/${category}`
      : `${baseUrl}/${category}`;

    const seoData = {
      title: `${categoryTitle} ${seoLocation} | Cadabam's Diagnostics`,
      description: `${categoryDesc} ${seoLocation}. Trusted diagnostic centers with quick results.`,
      keywords: `${categoryTitle}, diagnostic center, ${hasBangalore ? locationName : 'near you'}, medical testing, health checkup, diagnostic scan`,
      url: currentUrl,
      imageUrl: `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`
    };

    // Set cache headers
    if (res) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=300'
      );
    }

    return {
      props: {
        categoryData,
        seoData,
        category,
        location: location || null,
        error: null,
        hasBangalore,
        timestamp: new Date().toISOString() // For tracking purposes
      }
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      props: {
        categoryData: null,
        seoData: null,
        category: category || null,
        location: location || null,
        error: 'Failed to fetch category data',
        hasBangalore,
        timestamp: new Date().toISOString()
      }
    };
  }
}

export default function CategoryPage({ 
  categoryData, 
  seoData, 
  category, 
  location, 
  error, 
  hasBangalore,
  timestamp 
}) {
  const router = useRouter();
  const baseUrl = 'https://cadabamsdiagnostics.com';
  const { cart, addToCart, removeFromCart } = useCart();
  const [viewedItems, setViewedItems] = useState(new Set());
  const [initialTrackingDone, setInitialTrackingDone] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const currentUrl = hasBangalore 
    ? `${baseUrl}/bangalore${location ? `/${location}` : ''}/${category}`
    : `${baseUrl}/${category}`;

  // Monitor page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Track initial page view and item lists
  useEffect(() => {
    if (!initialTrackingDone && categoryData && isPageVisible) {
      // Track page view
      trackPageView(category);

      // Track main category tests
      if (categoryData.allData?.tests?.length > 0) {
        trackViewItemList(
          categoryData.allData.tests,
          formatCategoryTitle(category)
        );
      }

      // Track related tests
      if (categoryData.allData?.relative_test?.tests?.length > 0) {
        trackViewItemList(
          categoryData.allData.relative_test.tests,
          'Related Tests'
        );
      }

      // Track any additional test sections
      categoryData.allData?.additionalSections?.forEach((section, index) => {
        if (section.tests?.length > 0) {
          trackViewItemList(
            section.tests,
            section.title || `Additional Tests ${index + 1}`
          );
        }
      });

      setInitialTrackingDone(true);
    }
  }, [categoryData, category, initialTrackingDone, isPageVisible]);

  // Track test impressions using Intersection Observer
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && isPageVisible) {
          const testId = entry.target.dataset.testId;
          const sectionName = entry.target.dataset.sectionName;

          if (testId && !viewedItems.has(testId)) {
            const test = findTestById(testId);
            if (test) {
              trackViewItemList([test], sectionName || 'Test List');
              setViewedItems(prev => new Set([...prev, testId]));
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
      rootMargin: '0px'
    });

    document.querySelectorAll('[data-test-id]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [viewedItems, isPageVisible]);

  // Helper function to find test by ID
  const findTestById = (testId) => {
    const allTests = [
      ...(categoryData.allData?.tests || []),
      ...(categoryData.allData?.relative_test?.tests || []),
      ...categoryData.allData?.additionalSections?.reduce((acc, section) => 
        [...acc, ...(section.tests || [])], 
      [])
    ];
    return allTests.find(test => test._id === testId || test.id === testId);
  };

  // Handle test selection
  const handleTestSelect = useCallback((test, sectionName, index) => {
    if (isPageVisible) {
      trackSelectItem(test, sectionName, index);
      // Navigate to test page
      const testUrl = `/bangalore/${location ? `${location}/` : ''}lab-test/${test.route || test.slug}`;
      router.push(testUrl);
    }
  }, [router, location, isPageVisible]);

  // Generate all schemas
  const generateAllSchemas = useCallback(() => {
    const locationName = hasBangalore ? capitalizeLocation(location) : 'Near Me';
    
    return [
      // Medical Webpage Schema
      generateMedicalWebpageSchema(seoData, locationName, currentUrl),
      
      // FAQ Schema
      generateFAQSchema(categoryData.allData?.faqs || []),
      
      // Breadcrumb Schema
      generateBreadcrumbSchema(locationName, baseUrl, currentUrl),
      
      // Local Business Schema
      generateLocalBusinessSchema(locationName, currentUrl),
      
      // Organization Schema
      generateOrganizationSchema(baseUrl, locationName)
    ];
  }, [seoData, categoryData, location, currentUrl, baseUrl, hasBangalore]);

  // Error handling with tracking
  if (error) {
    // Track error event
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_error',
        error_type: 'category_load_error',
        error_message: error,
        timestamp: new Date().toISOString()
      });
    }

    return (
      <Layout>
        <Head>
          <title>Error | Cadabam's Diagnostics</title>
          <meta name="robots" content="index, follow" />
        </Head>
        <div className={styles.errorContainer}>
          <div className={styles.error}>{error}</div>
        </div>
      </Layout>
    );
  }

  if (!categoryData) {
    return (
      <Layout>
        <Head>
          <title>Category Not Found | Cadabam's Diagnostics</title>
          <meta name="robots" content="index, follow" />
        </Head>
        <div className={styles.errorContainer}>
          <div className={styles.error}>Category not found</div>
        </div>
      </Layout>
    );
  }

  const schemas = generateAllSchemas();

  return (
    <Layout title={categoryData.name}>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="index, follow" />
        
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.imageUrl} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Cadabams Diagnostics" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:brand" content="Cadabams Diagnostics" />
        <meta property="og:email" content="info@cadabamsdiagnostics.com" />
        <meta property="og:phone_number" content="+918050381444" />
        <meta property="og:street-address" content="Bangalore" />
        <meta property="og:locality" content={hasBangalore ? capitalizeLocation(location) : 'Near Me'} />
        <meta property="og:region" content="Karnataka" />
        <meta property="og:postal-code" content="560001" />
        <meta property="og:country-name" content="India" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CadabamsDX" />
        <meta name="twitter:creator" content="@CadabamsDX" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.imageUrl} />
        <meta name="twitter:image:alt" content={`${categoryData.name} at Cadabams Diagnostics`} />

        {/* Schema.org JSON-LD */}
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema)
            }}
          />
        ))}
      </Head>

      <div className={styles.pageContainer}>
        <main className={styles.content}>
          <section className={styles.overviewSection} data-section-name={formatCategoryTitle(category)}>
            <CategoryOverview
              category={{
                ...categoryData,
                categoryType: category
              }}
            />
          </section>

          <section className={styles.testInfoSection}>
            <NonLabTestPage1
              testInfo={{
                about: categoryData.allData?.about_test,
                parameters: categoryData.allData?.testParameters,
                risks: categoryData.allData?.risks_limitations,
                benefits: categoryData.allData?.benifit_taking_test,
                whoNeeds: categoryData.allData?.who_need_test,
                diseases: categoryData.allData?.diseases_diagnosed,
                preparation: categoryData.allData?.testPreparation,
                interpretations: categoryData.allData?.interpretations,
                faqs: categoryData.allData?.faqs,
                requisites: categoryData.allData?.requisites,
                typeOfTest: categoryData.allData?.type_of_test
              }}
            />
          </section>

          {categoryData.allData?.relative_test?.tests?.length > 0 && (
            <section 
              className={styles.relatedTestsSection} 
              data-section-name="Related Tests"
            >
              <RelatedTests 
                tests={categoryData.allData.relative_test.tests}
                currentCategory={category}
                onTestSelect={(test, index) => handleTestSelect(test, 'Related Tests', index)}
              />
            </section>
          )}
        </main>
      </div>
    </Layout>
  );
}