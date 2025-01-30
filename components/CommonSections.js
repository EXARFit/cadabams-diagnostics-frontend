import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './CommonSections.module.css';

// Simple seeded random number generator
const seededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Fisher-Yates shuffle with seed
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

// Generate consistent numeric seed from URL
const generateSeedFromUrl = (url) => {
  // Remove protocol and domain from URL
  const path = url.replace('https://cadabamsdiagnostics.com', '');
  // Convert path to numeric seed
  return path.split('').reduce((acc, char, index) => {
    return acc + (char.charCodeAt(0) * (index + 1));
  }, 0);
};

export default function CommonSections() {
  const [labTests, setLabTests] = useState([]);
  const [radiologyTests, setRadiologyTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Generate deterministic seed from current URL
        const currentUrl = `https://cadabamsdiagnostics.com${router.asPath}`;
        const seed = generateSeedFromUrl(currentUrl);

        const [labResponse, radiologyResponse] = await Promise.all([
          fetch('https://cadabamsapi.exar.ai/api/v1/cms/component/get-all/pagetemplate/labtest'),
          fetch('https://cadabamsapi.exar.ai/api/v1/cms/component/get-all/pagetemplate/non-labtest')
        ]);

        const [labData, radiologyData] = await Promise.all([
          labResponse.json(),
          radiologyResponse.json()
        ]);

        // Process lab tests data
        const processedLabTests = labData.data
          .filter(test => test.alldata?.[0]?.basic_info?.name)
          .map(test => ({
            name: test.alldata[0].basic_info.name,
            route: `/bangalore/lab-test${test.alldata[0].basic_info.route}`
          }));

        // Process radiology tests data
        const processedRadiologyTests = radiologyData.data
          .filter(test => test.alldata?.[0]?.basic_info?.name)
          .map(test => {
            const basicInfo = test.alldata[0].basic_info;
            const testType = basicInfo.testCategory?.toLowerCase().includes('ultrasound') ? 'ultrasound-scan' :
                           basicInfo.testCategory?.toLowerCase().includes('x-ray') ? 'xray-scan' :
                           basicInfo.testCategory?.toLowerCase().includes('mri') ? 'mri-scan' :
                           basicInfo.testCategory?.toLowerCase().includes('ct') ? 'ct-scan' : 'radiology';
            return {
              name: basicInfo.name,
              route: `/bangalore/${testType}${basicInfo.route}`
            };
          });

        // Use consistent seeded shuffle for each page
        setLabTests(seededShuffle(processedLabTests, seed).slice(0, 20));
        setRadiologyTests(seededShuffle(processedRadiologyTests, seed + 1).slice(0, 20));
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

      {/* Centers Section */}
      <section className={styles.section}>
        <h2>Our Diagnostic Centers</h2>
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