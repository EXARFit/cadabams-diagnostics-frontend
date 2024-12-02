import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Hero from '../../components/home/Hero';
import CheckupsSection from '../../components/home/CheckupsSection';
import MostBooked from '../../components/home/MostBooked';
import HealthCheckupSlider from '../../components/home/HeathcheckupSlider';
import VitalBodyOrgans from '../../components/home/VitalBodyOrgans';
import LocationPopup from '../../components/home/LocationPopup';
import BannerCarousel from '@/components/home/BannerCarousel';
import CustomContactForm from '@/components/home/CustomContactForm';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

export default function BangalorePage() {
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { params = [] } = router.query;

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
      router.push(`/bangalore/${selectedArea}`, undefined, { shallow: true });
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
    </>
  );

  const pageTitle = `Cadabam's Diagnostics - Bangalore${params.length > 0 ? ` - ${params.join(' / ')}` : ''} | Best Diagnostic Center in Bangalore`;
  const pageDescription = "Cadabam's Diagnostics Bangalore offers comprehensive diagnostic services including blood tests, scans, and health checkups. Book your diagnostic tests online or get home sample collection in Bangalore. Trusted by thousands for accurate and timely results.";
  const currentUrl = `https://diagnostics.cadabams.com${router.asPath}`;

  if (loading) {
    return (
      <AuthProvider>
        <Layout>
          <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={currentUrl} />
            
            {/* Open Graph Tags */}
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content="https://diagnostics.cadabams.com/images/og-image.jpg" />
            <meta property="og:site_name" content="Cadabam's Diagnostics" />

            {/* Schema.org markup */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "MedicalBusiness",
                "name": "Cadabam's Diagnostics",
                "image": "https://diagnostics.cadabams.com/images/logo.png",
                "description": pageDescription,
                "@id": currentUrl,
                "url": currentUrl,
                "telephone": "+91-80-2323-2323",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "19th Main Road, HSR Layout",
                  "addressLocality": "Bangalore",
                  "postalCode": "560102",
                  "addressRegion": "Karnataka",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 12.9141,
                  "longitude": 77.6332
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
                  "opens": "00:00",
                  "closes": "23:59"
                },
                "sameAs": [
                  "https://www.facebook.com/CadabamsDiagnostics",
                  "https://twitter.com/CadabamsDiag",
                  "https://www.instagram.com/cadabamsdiagnostics"
                ]
              })}
            </script>
          </Head>
          <div>Loading...</div>
        </Layout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Layout>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={currentUrl} />
          
          {/* Open Graph Tags */}
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:image" content="https://diagnostics.cadabams.com/images/og-image.jpg" />
          <meta property="og:site_name" content="Cadabam's Diagnostics" />
          
          {/* Additional Meta Tags */}
          <meta name="keywords" content="diagnostic center bangalore, medical tests bangalore, blood tests, health checkup packages, home sample collection, medical scans, pathology lab, radiology center" />
          <meta name="author" content="Cadabam's Diagnostics" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          {/* Schema.org markup */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "Cadabam's Diagnostics",
              "image": "https://diagnostics.cadabams.com/images/logo.png",
              "description": pageDescription,
              "@id": currentUrl,
              "url": currentUrl,
              "telephone": "+91-80-2323-2323",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "19th Main Road, HSR Layout",
                "addressLocality": "Bangalore",
                "postalCode": "560102",
                "addressRegion": "Karnataka",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 12.9141,
                "longitude": 77.6332
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
                "opens": "00:00",
                "closes": "23:59"
              },
              "sameAs": [
                "https://www.facebook.com/CadabamsDiagnostics",
                "https://twitter.com/CadabamsDiag",
                "https://www.instagram.com/cadabamsdiagnostics"
              ]
            })}
          </script>
        </Head>
        {showLocationPopup && <LocationPopup onSelect={handleLocationSelect} />}
        {params.length === 0 ? (
          <MainContent />
        ) : (
          <div>
            <MainContent />
          </div>
        )}
        <CustomContactForm />
      </Layout>
    </AuthProvider>
  );
}