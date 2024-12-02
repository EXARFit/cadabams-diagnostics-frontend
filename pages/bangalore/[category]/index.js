// CategoryPage.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CategoryOverview from '@/components/CategoryOverview';
import NonLabTestPage1 from '@/components/NonLabTestPage1';
import RelatedTests from '@/components/RelatedTests';
import styles from '../Category.module.css';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!category) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/${category}`);
        if (response.data.success && response.data.data?.[0]) {
          setCategoryData(response.data.data[0]);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to fetch category data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  // SEO data preparation
  const getSEOData = () => {
    if (!categoryData) return null;

    const name = categoryData.name || '';
    const description = categoryData.description || '';
    const { about_test = {}, diseases_diagnosed = {}, who_need_test = {} } = categoryData.allData || {};

    return {
      title: `${name} | Medical Tests and Diagnostics | Cadabam's Diagnostics Bangalore`,
      description: `${description.slice(0, 150)}... Get comprehensive ${name} at Cadabam's Diagnostics. Book your test online or call for home sample collection.`,
      keywords: `${name}, medical tests, diagnostic tests, health checkup, bangalore diagnostics, ${diseases_diagnosed.title || ''}, medical testing`,
      url: `https://diagnostics.cadabams.com/category/${category}`,
      imageUrl: categoryData.image || 'https://diagnostics.cadabams.com/images/default-test.jpg'
    };
  };

  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Loading... | Cadabam's Diagnostics</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className={styles.loadingContainer}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Head>
          <title>Error | Cadabam's Diagnostics</title>
          <meta name="robots" content="noindex, nofollow" />
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
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className={styles.notFoundContainer}>
          <div className={styles.notFound}>Category not found</div>
        </div>
      </Layout>
    );
  }

  const seoData = getSEOData();
  const {
    about_test = {},
    testParameters = {},
    risks_limitations = {},
    benifit_taking_test = {},
    who_need_test = {},
    diseases_diagnosed = {},
    testPreparation = {},
    interpretations = {},
    faqs = [],
    requisites = [],
    type_of_test = {},
    relative_test = {}
  } = categoryData.allData || {};

  const testInfo = {
    about: about_test,
    parameters: testParameters,
    risks: risks_limitations,
    benefits: benifit_taking_test,
    whoNeeds: who_need_test,
    diseases: diseases_diagnosed,
    preparation: testPreparation,
    interpretations: interpretations,
    faqs: faqs,
    requisites: requisites,
    typeOfTest: type_of_test
  };

  const relatedTests = relative_test?.tests || [];
  const categoryInfo = {
    name: categoryData.name || '',
    description: categoryData.description || '',
    image: categoryData.image || '',
    path: categoryData.path || '',
    createdAt: categoryData.createdAt,
    updatedAt: categoryData.updatedAt
  };

  return (
    <Layout title={categoryInfo.name}>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href={seoData.url} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:image" content={seoData.imageUrl} />
        <meta property="og:site_name" content="Cadabam's Diagnostics" />
        
        {/* Additional Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.imageUrl} />

        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalTest",
            "name": categoryInfo.name,
            "description": categoryInfo.description,
            "image": seoData.imageUrl,
            "url": seoData.url,
            "performedBy": {
              "@type": "MedicalOrganization",
              "name": "Cadabam's Diagnostics",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "addressCountry": "IN"
              }
            },
            "preparation": testInfo.preparation?.description || "",
            "usedToDiagnose": diseases_diagnosed.diseases?.map(disease => ({
              "@type": "MedicalCondition",
              "name": disease
            })) || [],
            "normalRange": testInfo.parameters?.description || "",
            "signDetected": testInfo.parameters?.parameters?.map(param => param.name) || [],
            "contraindication": testInfo.risks?.risks?.map(risk => risk) || [],
            "howPerformed": about_test.description || "",
            "recommendedFor": who_need_test.candidates?.map(candidate => ({
              "@type": "MedicalIndication",
              "name": candidate
            })) || [],
            "interpretation": interpretations?.description || "",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "price": "Contact for Price",
              "priceCurrency": "INR"
            },
            "relatedTests": relatedTests.map(test => ({
              "@type": "MedicalTest",
              "name": test.name || test
            })),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": seoData.url
            }
          })}
        </script>
      </Head>

      <div className={styles.pageContainer}>
        <main className={styles.content}>
          <section className={styles.overviewSection}>
            <CategoryOverview
              category={{
                ...categoryInfo,
                categoryType: category
              }}
            />
          </section>

          <section className={styles.testInfoSection}>
            <NonLabTestPage1
              testInfo={testInfo}
            />
          </section>

          {relatedTests.length > 0 && (
            <section className={styles.relatedTestsSection}>
              <RelatedTests 
                tests={relatedTests}
                currentCategory={category}
              />
            </section>
          )}
        </main>
      </div>
    </Layout>
  );
}