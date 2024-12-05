import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import NonLabTestPage from '@/components/NonLabTestPage';
import { fetchTestData } from '@/utils/api';

// Schema Generator Function
const generateSchemas = (data, baseUrl, test) => {
  // Medical Webpage Schema
  const medicalWebpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: data.seo?.title || `${data.testName} at Cadabams`,
    description: data.seo?.description || `Learn about ${data.testName} at Cadabams`,
    url: `${baseUrl}/diagnostic-tests/${test}`,
    image: data.imageUrl || `${baseUrl}/default-test-image.jpg`,
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
      name: 'Dr. John Doe',
      jobTitle: 'Medical Director',
      url: `${baseUrl}/doctors/john-doe`,
      sameAs: [
        'https://www.linkedin.com/company/cadabams-hospitals'
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Medical Director',
        educationRequirements: 'MD in Radiology'
      }
    },
    specialty: 'Medical Diagnostics',
    about: {
      '@type': 'MedicalCondition',
      name: data.alldata[2]?.about_test?.title || 'Diagnostic Testing'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100'
    },
    alternativeHeadline: `${data.testName} - Medical Diagnostic Test`,
    dateCreated: data.createdAt || new Date().toISOString(),
    dateModified: data.updatedAt || new Date().toISOString(),
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Cadabams Healthcare'
    },
    keywords: data.seo?.keywords || `diagnostic test, ${data.testName}, medical test`
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.alldata[12]?.faqs?.map(faq => ({
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
        name: 'Diagnostic Tests',
        item: `${baseUrl}/diagnostic-tests`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.testName,
        item: `${baseUrl}/diagnostic-tests/${test}`
      }
    ]
  };

  return [medicalWebpageSchema, faqSchema, breadcrumbSchema];
};

export default function TestDetailPage() {
  const router = useRouter();
  const { test } = router.query;
  const [testData, setTestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = 'https://cadabams-diagnostics.vercel.app';

  useEffect(() => {
    if (test) {
      setIsLoading(true);
      fetchTestData(test)
        .then((response) => {
          if (response) {
            setTestData(response);
          } else {
            throw new Error('Invalid data structure');
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setError('Failed to fetch data');
          setIsLoading(false);
        });
    }
  }, [test]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!testData) return <div>Test not found</div>;

  const currentUrl = `${baseUrl}/diagnostic-tests/${test}`;

  return (
    <Layout title={testData.testName || 'Test Page'}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{testData.seo?.title || `${testData.testName} | Cadabams Diagnostics`}</title>
        <meta name="description" content={testData.seo?.description || `Learn about ${testData.testName} at Cadabams Diagnostics`} />
        <meta 
          name="keywords" 
          content={testData.seo?.keywords || `diagnostic test, medical test, ${testData.testName}, Cadabams healthcare`} 
        />
        
        {/* Robots Meta Tags */}
        <meta name="robots" content={testData.seo?.robotsMeta || "index, follow"} />
        <meta name="googlebot" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Enhanced Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={testData.seo?.ogTitle || testData.seo?.title || `${testData.testName} | Cadabams Diagnostics`} />
        <meta property="og:description" content={testData.seo?.ogDescription || testData.seo?.description || `Learn about ${testData.testName} at Cadabams Diagnostics`} />
        <meta property="og:image" content={testData.seo?.ogImage || `${baseUrl}/default-test-image.jpg`} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Cadabams Diagnostics" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:price:currency" content="INR" />
        <meta property="og:price:amount" content={testData.alldata[0]?.basic_info?.price || ''} />
        <meta property="og:availability" content="in stock" />
        <meta property="og:brand" content="Cadabams Diagnostics" />
        <meta property="og:email" content="info@cadabams.com" />
        <meta property="og:phone_number" content="+91-XXX-XXX-XXXX" />
        <meta property="og:street-address" content="Bangalore" />
        <meta property="og:locality" content="Bangalore" />
        <meta property="og:region" content="Karnataka" />
        <meta property="og:postal-code" content="560001" />
        <meta property="og:country-name" content="India" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CadabamsGroup" />
        <meta name="twitter:creator" content="@CadabamsGroup" />
        <meta name="twitter:title" content={testData.seo?.title || `${testData.testName} | Cadabams Diagnostics`} />
        <meta name="twitter:description" content={testData.seo?.description || `Learn about ${testData.testName} at Cadabams Diagnostics`} />
        <meta name="twitter:image" content={testData.seo?.ogImage || `${baseUrl}/default-test-image.jpg`} />
        <meta name="twitter:image:alt" content={`${testData.testName} at Cadabams Diagnostics`} />
        <meta name="twitter:label1" content="Price" />
        <meta name="twitter:data1" content={`₹${testData.alldata[0]?.basic_info?.price || ''}`} />
        <meta name="twitter:label2" content="Location" />
        <meta name="twitter:data2" content="Bangalore" />

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
            __html: JSON.stringify(generateSchemas(testData, baseUrl, test))
          }}
        />
      </Head>

      <NonLabTestPage testData={testData} />
    </Layout>
  );
}