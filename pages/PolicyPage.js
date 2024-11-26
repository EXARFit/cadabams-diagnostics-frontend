import React from 'react';
import Head from 'next/head';
import styles from '../styles/PolicyPage.module.css';

const PolicyPage = ({ title, content }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | Your Company Name</title>
        <meta name="description" content={`${title} for Your Company Name`} />
      </Head>
      <main className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.text}>
          {content}
        </div>
      </main>
    </div>
  );
};

export default PolicyPage;