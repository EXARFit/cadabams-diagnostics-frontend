import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
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
      <Layout title={`Cadabams - Bangalore ${params.length > 0 ? `- ${params.join(' / ')}` : ''}`}>
        {showLocationPopup && <LocationPopup onSelect={handleLocationSelect} />}
        {params.length === 0 ? (
          <>
            <Hero heroData={pageData?.hero} />
            <CheckupsSection test_card={pageData?.test_card} />            <MostBooked mostBookedData={pageData?.mostBookedCheckups} />
            <BannerCarousel banners={pageData?.banner} />
            <HealthCheckupSlider healthData={pageData?.healthMonitoring} />
<VitalBodyOrgans organsData={pageData} />
          </>
        ) : (
          <div>
            <Hero heroData={pageData?.hero} />
            <CheckupsSection test_card={pageData?.test_card} />            <MostBooked mostBookedData={pageData?.mostBookedCheckups} />
            <BannerCarousel banners={pageData?.banner} />
            <HealthCheckupSlider healthData={pageData?.healthMonitoring} />
             <VitalBodyOrgans organsData={pageData} />
            
          </div>
        )}
         <CustomContactForm />
      </Layout>
    </AuthProvider>
  );
}