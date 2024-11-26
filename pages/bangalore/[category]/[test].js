import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import NonLabTestPage from '@/components/NonLabTestPage';
import { fetchTestData } from '@/utils/api';

export default function TestDetailPage() {
  const router = useRouter();
  const { test } = router.query;
  const [testData, setTestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <Layout title={testData.testName || 'Test Page'}>
      <NonLabTestPage testData={testData} />
    </Layout>
  );
}