// pages/thank-you/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from './ThankYou.module.css';

export default function ThankYou() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('submittedFormData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
    // Trigger mount animation
    setMounted(true);
  }, []);

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleBrowseTests = () => {
    router.push('/tests');
  };

  return (
    <AuthProvider>
      <Layout>
        <Head>
          <title>Thank You | Cadabam's Diagnostics</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        
        <div className={styles.pageWrapper}>
          <div className={`${styles.thankYouContainer} ${mounted ? styles.mounted : ''}`}>
            <div className={styles.card}>
              <div className={styles.successAnimation}>
                <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                  <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>

              <div className={styles.content}>
                <h1 className={styles.title}>Thank You!</h1>
                
                {userData && (
                  <p className={styles.message}>
                    Dear <span className={styles.highlight}>{userData.name}</span>,<br/>
                    Thank you for reaching out to us. We have received your information and our team will contact you shortly.
                  </p>
                )}
                
                <p className={styles.subtitle}>
                  Your health is our priority at Cadabam's Diagnostics.
                </p>

                <div className={styles.infoBox}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>📱</div>
                    <p>Our team will contact you within 24 hours</p>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>📋</div>
                    <p>A copy of your details has been sent to your email</p>
                  </div>
                </div>

                <div className={styles.buttonContainer}>
                  <button 
                    onClick={handleHomeClick}
                    className={`${styles.button} ${styles.primaryButton}`}
                  >
                    <span className={styles.buttonIcon}>🏠</span>
                    Return to Home
                  </button>
                  <button 
                    onClick={handleBrowseTests}
                    className={`${styles.button} ${styles.secondaryButton}`}
                  >
                    <span className={styles.buttonIcon}>🔍</span>
                    Browse Tests
                  </button>
                </div>

                <div className={styles.footer}>
                  <p>Need immediate assistance?</p>
                  <a href="tel:+918023232323" className={styles.contactLink}>
                    <span className={styles.phoneIcon}>📞</span>
                    +91 80 2323 2323
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.decorativeElements}>
              <div className={styles.circle1}></div>
              <div className={styles.circle2}></div>
              <div className={styles.wave}></div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
}