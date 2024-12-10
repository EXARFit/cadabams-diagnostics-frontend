import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CategoryOverview from '@/components/CategoryOverview';
import NonLabTestPage1 from '@/components/NonLabTestPage1';
import RelatedTests from '@/components/RelatedTests';
import styles from '../Category.module.css';
import axios from 'axios';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

// Helper function to format category titles
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

// Helper function to format category descriptions
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

// Helper function to capitalize location
const capitalizeLocation = (loc) => {
  if (!loc) return 'Bangalore';
  return loc.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Add getServerSideProps for SSR
export async function getServerSideProps({ params, res }) {
  const { category, location } = params;
  const baseUrl = 'https://www.cadabamsdiagnostics.com';

  try {
    const response = await axios.get(`${API_BASE_URL}/${category}`);
    
    if (!response.data.success || !response.data.data?.[0]) {
      return {
        notFound: true
      };
    }

    const categoryData = response.data.data[0];
    
    // SEO data preparation
    const locationName = capitalizeLocation(location);
    const categoryTitle = formatCategoryTitle(category);
    const categoryDesc = formatCategoryDescription(category);
    const currentUrl = `${baseUrl}/bangalore/${location ? `${location}/` : ''}${category}`;

    const seoData = {
      title: `${categoryTitle} in ${locationName} | Cadabam's Diagnostics`,
      description: `${categoryDesc} in ${locationName}. Trusted diagnostic centers with quick results.`,
      keywords: `${categoryTitle}, diagnostic center, ${locationName}, medical testing, health checkup, diagnostic scan`,
      url: currentUrl,
      imageUrl: `https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png`
    };

    // Set cache headers
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );

    return {
      props: {
        categoryData,
        seoData,
        category,
        location
      }
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      props: {
        error: 'Failed to fetch category data'
      }
    };
  }
}

export default function CategoryPage({ categoryData, seoData, category, location, error }) {
  const router = useRouter();
  const baseUrl = 'https://www.cadabamsdiagnostics.com';

  // Generate schemas for the page
  const generateSchemas = (seoData, categoryData, location) => {
    const locationName = capitalizeLocation(location);

    // Medical Webpage Schema
    const medicalWebpageSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: seoData.title,
      description: seoData.description,
      url: seoData.url,
      image: seoData.imageUrl,
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
        name: categoryData.name
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '100'
      },
      alternativeHeadline: `${categoryData.name} in ${locationName}`,
      dateCreated: categoryData.createdAt || new Date().toISOString(),
      dateModified: categoryData.updatedAt || new Date().toISOString(),
      copyrightHolder: {
        '@type': 'Organization',
        name: 'Cadabams Diagnostics'
      },
      keywords: seoData.keywords
    };

    // FAQ Schema
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: categoryData.allData?.faqs?.map(faq => ({
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
          name: locationName,
          item: `${baseUrl}/bangalore/${location || ''}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryData.name,
          item: seoData.url
        }
      ]
    };

    return [medicalWebpageSchema, faqSchema, breadcrumbSchema];
  };

  if (error) {
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

  const schemas = generateSchemas(seoData, categoryData, location);

  return (
    <Layout title={categoryData.name}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href={seoData.url} />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.imageUrl} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:site_name" content="Cadabams Diagnostics" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:brand" content="Cadabams Diagnostics" />
        <meta property="og:email" content="info@cadabamsdiagnostics.com" />
        <meta property="og:phone_number" content="+918050381444" />
        <meta property="og:street-address" content="Bangalore" />
        <meta property="og:locality" content={capitalizeLocation(location)} />
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
            __html: JSON.stringify(schemas)
          }}
        />
      </Head>

      <div className={styles.pageContainer}>
        <main className={styles.content}>
          <section className={styles.overviewSection}>
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
            <section className={styles.relatedTestsSection}>
              <RelatedTests 
                tests={categoryData.allData.relative_test.tests}
                currentCategory={category}
              />
            </section>
          )}
        </main>
      </div>
    </Layout>
  );
}