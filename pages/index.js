import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Hero from '@/components/home/Hero';
import CheckupsSection from '@/components/home/CheckupsSection';
import MostBooked from '@/components/home/MostBooked';
import HealthCheckupSlider from '@/components/home/HeathcheckupSlider';
import VitalBodyOrgans from '@/components/home/VitalBodyOrgans';
import LocationPopup from '@/components/home/LocationPopup';
import BannerCarousel from '@/components/home/BannerCarousel';
import CustomContactForm from '@/components/home/CustomContactForm';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

// Head Component with proper schema structure
const PageHead = ({ pageTitle, pageDescription, currentUrl, faqData }) => {
  // Structured JSON-LD data
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Cadabam's Diagnostics",
      "alternateName": "Cadabams Diagnostic Center",
      "url": currentUrl,
      "email": "info@cadabamsdiagnostics.com",
      "foundingDate": "2020",
      "description": pageDescription,
      "logo": "https://www.cadabamsdiagnostics.com/images/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-80-2545-7777",
        "contactType": "Sales",
        "contactOption": "Customer Service",
        "areaServed": "IN",
        "availableLanguage": "en"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250"
      },
      "sameAs": [
        "https://www.instagram.com/cadabamsdiagnostics",
        "https://www.facebook.com/CadabamsDiagnostics",
        "https://www.youtube.com/c/CadabamsDiagnostics",
        "https://www.linkedin.com/company/cadabams-diagnostics",
        "https://www.cadabamsdiagnostics.com"
      ]
    }
  ];

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content="https://www.cadabamsdiagnostics.com/images/og-image.jpg" />
      <meta property="og:site_name" content="Cadabam's Diagnostics" />

      {/* Schema.org structured data */}
      {schemas.map((schema, index) => (
        <script 
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </Head>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      border: '1px solid rgba(0, 71, 171, 0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff',
      marginBottom: '1rem'
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '1.2rem',
          background: 'transparent',
          border: 'none',
          fontSize: '1.1rem',
          color: '#333',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <span style={{ flex: 1, paddingRight: '1rem' }}>{question}</span>
        <span style={{
          fontSize: '1.5rem',
          color: '#e93b52',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
          display: 'inline-block'
        }}>
          +
        </span>
      </button>
      <div style={{
        padding: isOpen ? '0 1.2rem 1.2rem' : '0 1.2rem',
        color: '#666',
        lineHeight: 1.6,
        maxHeight: isOpen ? '500px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: isOpen ? 1 : 0
      }}>
        <div>{answer}</div>
      </div>
    </div>
  );
};

// Main Component
export default function BangalorePage() {
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { params = [] } = router.query;

  const faqData = [
    {
      question: "What types of tests and scans are available at Cadabam's Diagnostics?",
      answer: "We offer a comprehensive range of diagnostic services, including lab tests like Complete Blood Count, Liver Function Test, Glucose Fasting, and specialized tests such as Thyroid Profile. Additionally, we provide advanced imaging services like X-rays, MRIs, CT scans, Ultrasounds, and Pregnancy Scans, ensuring a one-stop solution for all your diagnostic needs."
    },
    {
      question: "Do I need to visit the centre for sample collection, or do you offer home collection services?",
      answer: "For lab tests, we provide the convenience of home sample collection. Our certified professionals will visit your home at the scheduled time, ensuring a safe and hygienic process. Additionally, we have over 70 sample collection points across Bangalore, making it even easier for you to find a location nearby if you prefer to visit one of our centres."
    },
    {
      question: "How quickly can I expect my test or scan results?",
      answer: "At Cadabam's Diagnostics, we prioritise accuracy and speed. Most lab test results are available within a few hours and are sent directly to you via WhatsApp, email, or through other digital form. For scans, results and reports are generally available within 24 to 48 hours, depending on the type of imaging."
    }
  ];

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        if (response.data.success) {
          setPageData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  useEffect(() => {
    const locationSelected = localStorage.getItem('locationSelected');
    if (!locationSelected && params.length === 0) {
      setShowLocationPopup(true);
    }
  }, [params]);

  const handleLocationSelect = (selectedArea) => {
    localStorage.setItem('locationSelected', 'true');
    setShowLocationPopup(false);
    
    if (selectedArea) {
      router.push(`/${selectedArea}`, undefined, { shallow: true });
    }
  };

  const MainContent = () => (
    <>
      <Hero heroData={pageData?.hero} />
      <CheckupsSection test_card={pageData?.test_card} />
      <MostBooked mostBookedData={pageData?.mostBookedCheckups} />
      <BannerCarousel banners={pageData?.banner} />
      <HealthCheckupSlider healthData={pageData?.healthMonitoring} />
      <VitalBodyOrgans organsData={pageData} />
      
      {/* FAQ Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '3rem auto',
        padding: '0 2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#0047ab',
            marginBottom: '1.5rem',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const pageTitle = `Cadabam's Diagnostics${params.length > 0 ? ` - ${params.join(' / ')}` : ''} | Best Diagnostic Center in Bangalore`;
  const pageDescription = "Cadabam's Diagnostics offers comprehensive diagnostic services including blood tests, scans, and health checkups. Book your diagnostic tests online or get home sample collection in Bangalore.";
  const currentUrl = `https://www.cadabamsdiagnostics.com${router.asPath}`;

  const pageContent = (
    <AuthProvider>
      <Layout>
        <PageHead
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          currentUrl={currentUrl}
          faqData={faqData}
        />
        {showLocationPopup && <LocationPopup onSelect={handleLocationSelect} />}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {params.length === 0 ? (
              <MainContent />
            ) : (
              <div>
                <MainContent />
              </div>
            )}
          </>
        )}
        <CustomContactForm/>
      </Layout>
    </AuthProvider>
  );

  return pageContent;
}