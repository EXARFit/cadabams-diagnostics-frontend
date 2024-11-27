// components/labtest/LabtestHero.js
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import styles from './LabtestHero.module.css';

const getLocationFromPath = (path) => {
  if (!path) return { name: 'Bangalore', value: 'bangalore' };
  
  // Split path into segments
  const parts = path.split('/').filter(Boolean);
  
  // Check if it's a location-specific path
  if (parts[0] === 'bangalore' && parts.length > 2) {
    // If it's a route like /bangalore/banashankari/lab-test
    if (parts[1] && parts[1] !== 'lab-test') {
      const locationName = parts[1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { name: locationName, value: parts[1] };
    }
  }
  
  // Default to Bangalore for /bangalore/lab-test
  return { name: 'Bangalore', value: 'bangalore' };
};

export default function LabtestHero({ heroData = {} }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const currentLocation = getLocationFromPath(router.asPath);

  const locationAwareContent = useMemo(() => {
    const title = `Lab Test Services in ${currentLocation.name}`;
    const subtitle = `ACCURATE LAB RESULTS YOU CAN RELY ON. CERTIFIED CENTRES IN ${currentLocation.name.toUpperCase()}`;

    return { title, subtitle };
  }, [currentLocation]);

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
    // Maintain the current location in the URL if it exists
    const locationPath = currentLocation.value !== 'bangalore' 
      ? `/${currentLocation.value}` 
      : '';
    const routePrefix = result.isLabTest ? 'lab-test' : 'xray-scan';
    const fullRoute = `/bangalore${locationPath}/${routePrefix}${result.route}`;
    router.push(fullRoute);
    setSearchTerm('');
    setShowResults(false);
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
                <span className={styles.primaryTitle}>{locationAwareContent.title}</span>
              </h1>
              <h2 className={styles.subtitle}>
                {locationAwareContent.subtitle}
              </h2>
              <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    placeholder="Search for lab tests"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
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
                                {result.name}
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
            </motion.div>
            <motion.div 
              className={styles.imageContainer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Image
                src={heroData?.imageSrc || "/images/doctor.png"}
                alt="Lab Test"
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
        </motion.div>
      </div>
    </header>
  );
}