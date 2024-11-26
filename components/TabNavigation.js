import React, { useState } from 'react';
import styles from './TabNavigation.module.css';

const TabNavigation = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.tabList}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${index === activeTab ? styles.active : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

export default TabNavigation;