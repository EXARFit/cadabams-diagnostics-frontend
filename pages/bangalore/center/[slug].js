import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CenterPage from './CenterPage';
import styles from './DynamicCenterPage.module.css';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

const CenterDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [centerData, setCenterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/center/${slug}`);

        if (response.data?.data) {
          const transformedData = {
            ...response.data.data,
            services: response.data.data.services?.map(service => ({
              ...service,
              image: service.image || '/placeholder.jpg',
              tests: service.tests?.map(test =>
                typeof test === 'object' ? test.testName : test
              )
            }))
          };
          setCenterData(transformedData);
        } else {
          router.push('/bangalore');
        }
      } catch (err) {
        console.error('Error fetching center data:', err);
        router.push('/bangalore');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, router, router.isReady]);

  // SEO data preparation
  const getSEOData = () => {
    if (!centerData) return null;

    const center = centerData.basic_info || {};
    const address = centerData.address || {};

    return {
      title: `${center.center_name || 'Diagnostic Center'} | Cadabam's Diagnostics Bangalore`,
      description: `Visit Cadabam's Diagnostics ${center.center_name} for comprehensive medical testing and diagnostic services. ${center.description || 'We offer advanced diagnostic solutions with state-of-the-art equipment and experienced professionals.'}`,
      keywords: `diagnostic center bangalore, medical tests, health checkup, ${center.center_name}, ${address.area || 'bangalore'}, diagnostic services`,
      url: `https://diagnostics.cadabams.com/center/${slug}`,
      imageUrl: center.image || 'https://diagnostics.cadabams.com/images/center-default.jpg'
    };
  };

  if (!router.isReady || !slug || isLoading) {
    return (
      <Layout title="Loading...">
        <Head>
          <title>Loading... | Cadabam's Diagnostics</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </Layout>
    );
  }

  if (!centerData) {
    router.push('/bangalore');
    return null;
  }

  const seoData = getSEOData();
  const { address = {}, basic_info = {} } = centerData;

  return (
    <Layout title={basic_info.center_name || 'Diagnostic Center'}>
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
        <meta property="og:type" content="medical.business" />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:image" content={seoData.imageUrl} />
        <meta property="og:site_name" content="Cadabam's Diagnostics" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.imageUrl} />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": basic_info.center_name,
            "image": seoData.imageUrl,
            "description": seoData.description,
            "@id": seoData.url,
            "url": seoData.url,
            "telephone": basic_info.phone || "+91-80-2323-2323",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": address.street || "",
              "addressLocality": address.area || "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": address.pincode || "560102",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": address.latitude || 12.9141,
              "longitude": address.longitude || 77.6332
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": basic_info.opening_time || "00:00",
              "closes": basic_info.closing_time || "23:59"
            },
            "medicalSpecialty": centerData.services?.map(service => service.name) || [],
            "availableTest": centerData.services?.flatMap(service => service.tests || []) || [],
            "department": centerData.services?.map(service => ({
              "@type": "MedicalSpecialty",
              "name": service.name,
              "availableTest": service.tests || []
            })) || [],
            "sameAs": [
              "https://www.facebook.com/CadabamsDiagnostics",
              "https://twitter.com/CadabamsDiag",
              "https://www.instagram.com/cadabamsdiagnostics"
            ]
          })}
        </script>
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