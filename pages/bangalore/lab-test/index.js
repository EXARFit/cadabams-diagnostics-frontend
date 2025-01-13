import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';
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

// Generate schemas for the page
const generateSchemas = (locationName, baseUrl, location, hasBangalore) => {
  const currentUrl = hasBangalore
    ? `${baseUrl}/bangalore/${location ? `${location}/` : ''}lab-test`
    : `${baseUrl}/${location ? `${location}/` : ''}lab-test`;
    
  const pageTitle = location 
    ? `Reliable Lab Tests in ${locationName} | Cadabams Diagnostics`
    : 'Reliable Lab Tests in Bangalore | Cadabams Diagnostics';
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
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Cadabams Diagnostics'
    },
    keywords: `lab tests, medical tests, diagnostic tests, blood tests, pathology lab, ${locationName}, healthcare`
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

  return [medicalWebpageSchema, breadcrumbSchema];
};

export async function getServerSideProps({ query, req }) {
  const { location } = query;
  const baseUrl = 'https://cadabamsdiagnostics.com';
  const locationName = capitalizeLocation(location);
  const hasBangalore = req.url.includes('/bangalore/');

  try {
    const response = await axios.get(API_BASE_URL);
    const pageData = response.data.success ? response.data.data : null;

    const pageTitle = location 
      ? `Reliable Lab Tests in ${locationName} | Cadabams Diagnostics`
      : 'Reliable Lab Tests in Bangalore | Cadabams Diagnostics';
    
    const pageDescription = location
      ? `Get accurate and reliable lab test services in ${locationName} at Cadabams Diagnostics. From routine blood tests to advanced diagnostics, we ensure precise results with state-of-the-art technology and expert care. Book your test today!`
      : 'Get accurate and reliable lab test services in Bangalore at Cadabams Diagnostics. From routine blood tests to advanced diagnostics, we ensure precise results with state-of-the-art technology and expert care. Book your test today!';

    const currentUrl = hasBangalore
      ? `${baseUrl}/bangalore/${location ? `${location}/` : ''}lab-test`
      : `${baseUrl}/${location ? `${location}/` : ''}lab-test`;

    return {
      props: {
        pageData,
        baseUrl,
        locationName,
        pageTitle,
        pageDescription,
        currentUrl,
        location: location || null,
        hasBangalore
      }
    };
  } catch (error) {
    console.error('Server-side error:', error);
    return {
      props: {
        pageData: null,
        error: 'Failed to fetch data',
        baseUrl,
        locationName,
        location: location || null,
        hasBangalore
      }
    };
  }
}

export default function LabtestPage({ 
  pageData, 
  baseUrl, 
  locationName, 
  pageTitle, 
  pageDescription, 
  currentUrl,
  location,
  error,
  hasBangalore
}) {
  const schemas = generateSchemas(locationName, baseUrl, location, hasBangalore);

  if (error) {
    return (
      <AuthProvider>
        <Layout>
          <div>Error: {error}</div>
        </Layout>
      </AuthProvider>
    );
  }

  if (!pageData) {
    return (
      <AuthProvider>
        <Layout>
          <div>No data available</div>
        </Layout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Layout title={pageTitle}>
        <Head>
          {/* Basic Meta Tags */}
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta 
            name="keywords" 
            content={`lab tests, medical tests, diagnostic tests, blood tests, pathology lab, ${locationName}, healthcare`}
          />
          <meta name="robots" content="index, follow" />
          
          {/* Canonical Tag */}
          <link rel="canonical" href={currentUrl} />
          
          {/* Open Graph Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png" />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:site_name" content="Cadabams Diagnostics" />
          <meta property="og:locale" content="en_IN" />
          <meta property="og:brand" content="Cadabams Diagnostics" />
          <meta property="og:email" content="info@cadabamsdiagnostics.com" />
          <meta property="og:phone_number" content="+918050381444" />
          <meta property="og:street-address" content="Bangalore" />
          <meta property="og:locality" content={locationName} />
          <meta property="og:region" content="Karnataka" />
          <meta property="og:postal-code" content="560001" />
          <meta property="og:country-name" content="India" />
          
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@CadabamsDX" />
          <meta name="twitter:creator" content="@CadabamsDX" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png" />
          <meta name="twitter:image:alt" content="Cadabams Diagnostics Lab Tests" />

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

        {/* Main Content */}
        <LabtestHero heroData={pageData?.hero} />
        <FeatureSection features={pageData?.features} />
        <MultiTestSection testData={pageData?.test_card} />
        {/* <DiscountBanner offer={pageData?.discountOffer} /> */}
        <HealthCheckupSlider healthData={pageData?.healthMonitoring} />
        <MultiTestSection sections={pageData?.multiTestSection} />
        <BannerCarousel banners={pageData?.banner} />
      </Layout>
    </AuthProvider>
  );
}