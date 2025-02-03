import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './CommonSections.module.css';

// Seeded random number generator for consistent shuffling
const seededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Fisher-Yates shuffle with seed for consistent randomization
const seededShuffle = (array, seed) => {
  const newArray = [...array];
  let currentSeed = seed;
  
  for (let i = newArray.length - 1; i > 0; i--) {
    currentSeed++;
    const j = Math.floor(seededRandom(currentSeed) * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
};

// Category ID mapping for test types
const CATEGORY_ID_MAP = {
  '671b5102ad9bf8d210384d1e': 'pregnancy-scan',
  '671b5102ad9bf8d210384d1d': 'preventive-health', 
  '671b5102ad9bf8d210384d1f': 'msk-scan',
  '671b5102ad9bf8d210384d1b': 'ct-scan',
  '671b5102ad9bf8d210384d1a': 'mri-scan',
  '671b5102ad9bf8d210384d19': 'xray-scan',
  '671b5102ad9bf8d210384d1c': 'ultrasound-scan'
};

// Determine test type based on category ID only
const determineTestType = (test, basicInfo) => {
  if (!basicInfo?.categoryId) return null;
  return CATEGORY_ID_MAP[basicInfo.categoryId] || null;
};

// Generate seed from URL
const generateSeedFromUrl = (url) => {
  const path = url.replace('https://cadabamsdiagnostics.com', '');
  return path.split('').reduce((acc, char, index) => {
    return acc + (char.charCodeAt(0) * (index + 1));
  }, 0);
};

export default function CommonSections() {
  const [labTests, setLabTests] = useState([]);
  const [radiologyTests, setRadiologyTests] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUrl = `https://cadabamsdiagnostics.com${router.asPath}`;
        const seed = generateSeedFromUrl(currentUrl);

        // Fetch all data in parallel
        const [labResponse, radiologyResponse, blogsResponse] = await Promise.all([
          fetch('https://cadabamsapi.exar.ai/api/v1/cms/component/get-all/pagetemplate/labtest'),
          fetch('https://cadabamsapi.exar.ai/api/v1/cms/component/get-all/pagetemplate/non-labtest'),
          fetch('https://cadabamsapi.exar.ai/api/v1/cms/blog/')
        ]);

        if (!labResponse.ok || !radiologyResponse.ok || !blogsResponse.ok) {
          throw new Error('One or more network responses were not ok');
        }

        const [labData, radiologyData, blogsData] = await Promise.all([
          labResponse.json(),
          radiologyResponse.json(),
          blogsResponse.json()
        ]);

        // Process lab tests
        const processedLabTests = labData?.data
          ?.filter(test => test?.alldata?.[0]?.basic_info?.name)
          ?.map(test => ({
            name: test.alldata[0].basic_info.name,
            route: `/bangalore/lab-test${test.alldata[0].basic_info.route}`
          })) || [];

        // Process radiology tests
        const processedRadiologyTests = radiologyData?.data
          ?.filter(test => test?.alldata?.[0]?.basic_info?.name)
          ?.map(test => {
            const basicInfo = test.alldata[0].basic_info;
            const testType = determineTestType(basicInfo.name, basicInfo);
            return testType ? {
              name: basicInfo.name,
              route: `/bangalore/${testType}${basicInfo.route}`
            } : null;
          })
          ?.filter(Boolean) || [];

        // Process blogs
        const processedBlogs = blogsData
          ?.filter(blog => blog.title && blog.route)
          ?.map(blog => ({
            title: blog.title,
            route: `/blogs${blog.route}`
          })) || [];

        // Set state with shuffled and limited data
        setLabTests(seededShuffle(processedLabTests, seed).slice(0, 20));
        setRadiologyTests(seededShuffle(processedRadiologyTests, seed + 1).slice(0, 20));
        setBlogs(seededShuffle(processedBlogs, seed + 2).slice(0, 25));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router.asPath]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.commonSections}>
      {/* Related Lab Tests Section */}
      <section className={styles.section}>
        <h2>Related Lab Tests</h2>
        <div className={styles.testLinks}>
          {labTests.map((test, index) => (
            <a 
              key={`lab-${index}`} 
              href={test.route} 
              className={styles.testLink}
            >
              {test.name}
            </a>
          ))}
        </div>
      </section>

      {/* Popular Radiology Scans Section */}
      <section className={styles.section}>
        <h2>Popular Radiology Scans</h2>
        <div className={styles.testLinks}>
          {radiologyTests.map((test, index) => (
            <a 
              key={`rad-${index}`} 
              href={test.route} 
              className={styles.testLink}
            >
              {test.name}
            </a>
          ))}
        </div>
      </section>

      {/* Health Insights Blog Section */}
      {blogs.length > 0 && (
        <section className={styles.section}>
          <h2>Blogs</h2>
          <div className={styles.testLinks}>
            {blogs.map((blog, index) => (
              <a 
                key={`blog-${index}`} 
                href={blog.route} 
                className={styles.testLink}
              >
                {blog.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Centers Section */}
      <section className={styles.section}>
        <h2>Our Top Diagnostic Centres</h2>
        <div className={styles.centerLinks}>
          {[
            { name: 'Indiranagar', route: '/bangalore/center/indiranagar' },
            { name: 'Banashankari', route: '/bangalore/center/banashankari' },
            { name: 'Jayanagar', route: '/bangalore/center/jayanagar' }
          ].map((center) => (
            <a key={center.route} href={center.route} className={styles.centerLink}>
              {center.name}
            </a>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className={styles.section}>
        <h2>Cadabam's Diagnostics: What Defines Us</h2>
        <p>
          Welcome to Cadabam's Diagnostics, where diagnostic care meets modern convenience. 
          We believe that accessing vital health insights shouldn't mean sacrificing comfort. 
          That's why we bring advanced, high-quality testing services delivered straight to your doorstep. 
          Our commitment to accuracy, fast, and compassion ensures that every test is handled with the utmost care, 
          giving you reliable results without leaving home. Trusted by healthcare providers and patients alike, 
          we're here to support your wellness journey with expertise you can count on.
        </p>
      </section>
    </div>
  );
}