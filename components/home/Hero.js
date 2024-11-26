import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import styles from './Hero.module.css';

export default function Hero({ heroData = {} }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://cadabamsapi.exar.ai/api/v1/user/search/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testName: searchTerm })
      });

      if (response.ok) {
        const data = await response.json();
        const transformedResults = data.map(test => ({
          name: test.testName || test.name,
          route: test.route,
          isLabTest: test.templateName === 'labtest'
        }));
        setSearchResults(transformedResults);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result) => {
    const baseUrl = '/bangalore';
    const routePrefix = result.isLabTest ? 'lab-test' : 'xray-scan';
    const fullRoute = `${baseUrl}/${routePrefix}${result.route}`;
    router.push(fullRoute);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleButtonClick = (href) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <header className={styles.hero}>
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.content}>
            <motion.div 
              className={styles.textContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className={styles.title}>
                <span className={styles.highlight}>{heroData?.title || "Need a Dengue test?"}</span>
              </h1>
              <h2 className={styles.subtitle}>
                {heroData?.subtitle || "CHOOSE THE FASTEST LAB"}
              </h2>
              <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    placeholder="Search for tests or checkups"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className={styles.searchIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  
                  {showResults && (
                    <div className={styles.searchDropdownContainer}>
                      <div className={styles.searchDropdown}>
                        {isLoading ? (
                          <div className={styles.loadingText}>Searching...</div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((result, index) => (
                            <div 
                              key={index}
                              className={styles.searchResult}
                              onClick={() => handleResultClick(result)}
                            >
                              <div className={styles.resultName}>
                                {result.name || 'Untitled Test'}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.loadingText}>No results found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.buttonContainer}>
                {heroData?.buttons?.map((button) => (
                  <motion.button
                    key={button._id}
                    className={`${styles.button} ${styles.labTests}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleButtonClick(button.href)}
                  >
                    {button.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className={styles.imageContainer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Image
                src={heroData?.imageSrc || "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png-ezgif.com-webp-to-png-converter.webp"}
                alt="Cadabams Lab Test"
                width={500}
                height={500}
                className={styles.image}
              />
              <div className={styles.badge}>
                <p>
                  Reports in <span className={styles.badgeHighlight}>6 HOURS</span>
                </p>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className={styles.features}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {heroData?.features?.map((feature, index) => (
              <div key={feature._id} className={styles.featureItem}>
                <img 
                  src={feature.icon} 
                  alt={feature.title} 
                  className={styles.featureIcon}
                />
                <div>
                  <p className={styles.featureTitle}>{feature.title}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      <div className={styles.floatingBalls}>
        <motion.div
          className={`${styles.ball} ${styles.ball1}`}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`${styles.ball} ${styles.ball2}`}
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            rotate: [0, -15, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`${styles.ball} ${styles.ball3}`}
          animate={{
            y: [0, -20, 0],
            x: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </header>
  );
}