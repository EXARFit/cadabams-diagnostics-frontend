import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
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

export default function LabtestPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) {
    return (
      <AuthProvider>
        <Layout>
          <div>Loading...</div>
        </Layout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Layout title="Lab Tests - Cadabams Diagnostics">
        <LabtestHero heroData={pageData?.hero} />
        <FeatureSection features={pageData?.features} />
        <MultiTestSection testData={pageData?.test_card} />
        <DiscountBanner offer={pageData?.discountOffer} />
        <HealthCheckupSlider healthData={pageData?.healthMonitoring} />
        <MultiTestSection sections={pageData?.multiTestSection} />
        <BannerCarousel banners={pageData?.banner} />
      </Layout>
    </AuthProvider>
  );
}