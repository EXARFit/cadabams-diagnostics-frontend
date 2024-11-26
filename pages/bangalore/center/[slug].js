import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
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
          // Transform and sanitize image URLs in the data
          const transformedData = {
            ...response.data.data,
            services: response.data.data.services?.map(service => ({
              ...service,
              // Ensure image URLs are properly formatted
              image: service.image || '/placeholder.jpg', // Add a default placeholder
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

  if (!router.isReady || !slug || isLoading) {
    return (
      <Layout title="Loading...">
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

  return (
    <Layout 
      title={centerData.basic_info?.center_name || 'Diagnostic Center'}
    >
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <CenterPage centerData={centerData} />
        </div>
      </div>
    </Layout>
  );
};

export default CenterDetailPage;