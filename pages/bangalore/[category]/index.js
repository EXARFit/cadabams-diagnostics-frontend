// CategoryPage.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import CategoryOverview from '@/components/CategoryOverview';
import NonLabTestPage1 from '@/components/NonLabTestPage1';
import RelatedTests from '@/components/RelatedTests';
import styles from '../Category.module.css';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!category) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/${category}`);
        if (response.data.success && response.data.data?.[0]) {
          setCategoryData(response.data.data[0]);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to fetch category data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFound}>Category not found</div>
      </div>
    );
  }

  // Extract base category information
  const categoryInfo = {
    name: categoryData.name || '',
    description: categoryData.description || '',
    image: categoryData.image || '',
    path: categoryData.path || '',
    createdAt: categoryData.createdAt,
    updatedAt: categoryData.updatedAt
  };

  // Extract allData information
  const {
    about_test = {},
    testParameters = {},
    risks_limitations = {},
    benifit_taking_test = {},
    who_need_test = {},
    diseases_diagnosed = {},
    testPreparation = {},
    interpretations = {},
    faqs = [],
    requisites = [],
    type_of_test = {},
    relative_test = {}
  } = categoryData.allData || {};

  // Organize test information
  const testInfo = {
    about: about_test,
    parameters: testParameters,
    risks: risks_limitations,
    benefits: benifit_taking_test,
    whoNeeds: who_need_test,
    diseases: diseases_diagnosed,
    preparation: testPreparation,
    interpretations: interpretations,
    faqs: faqs,
    requisites: requisites,
    typeOfTest: type_of_test
  };

  // Get related tests data
  const relatedTests = relative_test?.tests || [];

  return (
    <Layout title={categoryInfo.name || 'Category Page'}>
      <div className={styles.pageContainer}>
        <main className={styles.content}>
          {/* Category Overview Section */}
          <section className={styles.overviewSection}>
            <CategoryOverview
              category={{
                ...categoryInfo,
                categoryType: category // Pass the category type to CategoryOverview
              }}
            />
          </section>

          {/* Test Information Section */}
          <section className={styles.testInfoSection}>
            <NonLabTestPage1
              testInfo={testInfo}
            />
          </section>

          {/* Related Tests Section */}
          {relatedTests.length > 0 && (
            <section className={styles.relatedTestsSection}>
              <RelatedTests 
                tests={relatedTests}
                currentCategory={category}
              />
            </section>
          )}
        </main>
      </div>
    </Layout>
  );
}