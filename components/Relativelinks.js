// RelativeLinks.js
import React from 'react';
import Link from 'next/link';
import styles from './RelativeLinks.module.css';

const RelativeLinks = ({ relativeTests }) => {
  if (!relativeTests?.tests?.length) return null;

  const getFullPath = (testRoute) => {
    // Handle undefined or null routes
    if (!testRoute) return '/bangalore/lab-test';
    
    // Remove any leading slash from the test route
    return `/bangalore/lab-test${testRoute}`;
  };

  return (
    <div className={styles.relativeLinksContainer}>
      <h2 className={styles.relativeTitle}>Related Tests</h2>
      <div className={styles.relativeLinksWrapper}>
        {relativeTests.tests.slice(0, 5).map((test) => {
          // Log the test object to see what data we're getting
          console.log('Test data:', test);
          
          // Ensure we have a valid route
          const route = test?.route || '';
          
          return (
            <Link 
              key={test._id} 
              href={getFullPath(route)}
              className={styles.relativeLink}
            >
              {test.testName || 'Unnamed Test'}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelativeLinks;