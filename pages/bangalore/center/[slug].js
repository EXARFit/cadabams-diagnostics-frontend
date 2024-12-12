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
      url: `https://cadabamsdiagnostics.com/bangalore/center/${slug}`,
      imageUrl: center.image || 'https://cadabamsdiagnostics.com/images/center-default.jpg'
    };
  };

  if (!router.isReady || !slug || isLoading) {
    return (
      <Layout title="Loading...">
        <Head>
          <title>Loading... | Cadabam's Diagnostics</title>
          <meta name="robots" content="index, follow" />
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
        <link rel="canonical" href={`https://cadabamsdiagnostics.com/bangalore/center/${slug}`} />
        
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
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": "What services does Cadabam's Diagnostics offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${basic_info.center_name} offers comprehensive diagnostic services including ${centerData.services?.map(s => s.name).join(', ')}.`
              }
            }, {
              "@type": "Question",
              "name": "What are the working hours of the diagnostic center?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `Our center is open from ${basic_info.opening_time || '00:00'} to ${basic_info.closing_time || '23:59'} every day.`
              }
            }, {
              "@type": "Question",
              "name": "Where is the diagnostic center located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${basic_info.center_name} is located at ${address.street}, ${address.area}, ${address.pincode}.`
              }
            }]
          })}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": basic_info.center_name,
            "url": seoData.url,
            "sameAs": [
              "https://www.instagram.com/cadabamsdiagnostics",
              "https://www.facebook.com/CadabamsDiagnostics",
              "https://www.youtube.com/CadabamsDiagnostics",
              "https://www.linkedin.com/company/cadabams-diagnostics",
              "https://www.cadabamsdiagnostics.com",
              `https://www.google.com/maps?cid=${address.gmb_cid || ''}`
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": address.street || "",
              "addressLocality": address.area || "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": address.pincode || "",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": basic_info.phone || "",
              "contactType": "Customer Service",
              "areaServed": "IN",
              "availableLanguage": "en"
            },
            "logo": basic_info.logo || "/images/logo.png"
          })}
        </script>

        {/* Medical WebPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "name": seoData.title,
            "description": seoData.description,
            "url": seoData.url,
            "image": seoData.imageUrl,
            "citation": "https://www.cadabamsdiagnostics.com",
            "hasMap": `https://www.google.com/maps?cid=${address.gmb_cid || ''}`,
            "audience": {
              "@type": "MedicalAudience",
              "audienceType": "Patients",
              "healthCondition": {
                "@type": "MedicalCondition",
                "name": "Various Medical Conditions"
              }
            },
            "reviewedBy": {
              "@type": "Person",
              "name": basic_info.doctor_name || "Medical Professional",
              "jobTitle": basic_info.doctor_designation || "Medical Director",
              "url": `${seoData.url}/team`,
              "sameAs": [
                basic_info.doctor_linkedin || "",
                basic_info.doctor_profile || ""
              ],
              "hasOccupation": {
                "@type": "Occupation",
                "name": basic_info.doctor_designation || "Medical Director",
                "educationRequirements": basic_info.doctor_qualification || "MBBS, MD"
              }
            },
            "specialty": centerData.services?.map(s => s.name).join(', '),
            "about": {
              "@type": "MedicalCondition",
              "name": "Diagnostic Services"
            },
            "dateCreated": basic_info.created_at || new Date().toISOString(),
            "dateModified": basic_info.updated_at || new Date().toISOString(),
            "copyrightHolder": {
              "@type": "Organization",
              "name": "Cadabam's Diagnostics"
            },
            "keywords": seoData.keywords
          })}
        </script>

        {/* Video Schema (if video exists) */}
        {basic_info.video_url && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": `${basic_info.center_name} - Virtual Tour`,
              "description": `Take a virtual tour of ${basic_info.center_name} and explore our state-of-the-art diagnostic facilities`,
              "thumbnailUrl": [
                basic_info.video_thumbnail || seoData.imageUrl
              ],
              "uploadDate": basic_info.video_upload_date || new Date().toISOString(),
              "duration": basic_info.video_duration || "PT1M54S",
              "contentUrl": basic_info.video_url,
              "embedUrl": basic_info.video_embed_url
            })}
          </script>
        )}
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