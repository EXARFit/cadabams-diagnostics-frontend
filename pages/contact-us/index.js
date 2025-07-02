import { useState } from 'react';
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import CustomContactForm1 from '@/components/home/CustomContactForm1';
import styles from './Contact.module.css';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleFormSuccess = () => {
    setSubmitted(true);
  };

  return (
    <AuthProvider>
      <Layout>
        <Head>
          <title>Contact Us | Cadabam's Diagnostics - Leading Diagnostic Center in Bangalore</title>
          <meta name="description" content="Contact Cadabam's Diagnostics for all your medical testing and diagnostic needs. Book appointments, request home sample collection, or get information about our services." />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://cadabamsdiagnostics.com/contact-us" />
          
          {/* Open Graph Tags */}
          <meta property="og:title" content="Contact Cadabam's Diagnostics - Leading Diagnostic Center in Bangalore" />
          <meta property="og:description" content="Get in touch with Cadabam's Diagnostics for all your medical testing and diagnostic needs. Easy appointment booking and home sample collection available." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://cadabamsdiagnostics.com/contact" />
          <meta property="og:image" content="https://cadabamsdiagnostics.com/images/og-image.jpg" />
          <meta property="og:site_name" content="Cadabam's Diagnostics" />
          
          {/* Schema.org markup */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "url": "https://cadabamsdiagnostics.com/contact-us",
              "mainEntity": {
                "@type": "MedicalOrganization",
                "name": "Cadabams Diagnostics",
                "url": "https://cadabamsdiagnostics.com",
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "telephone": "+91-8050381444",
                    "contactType": "customer service",
                    "contactDescription": "Cadabam's Megsan Indiranagar",
                    "areaServed": "IN",
                    "availableLanguage": ["English"]
                  },
                  {
                    "@type": "ContactPoint",
                    "telephone": "+91-99006-64696",
                    "contactType": "customer service",
                    "contactDescription": "Cadabam's Diagnostic Centre Banshankari",
                    "areaServed": "IN",
                    "availableLanguage": ["English"]
                  },
                  {
                    "@type": "ContactPoint",
                    "telephone": "+91-8861821122",
                    "contactType": "customer service",
                    "contactDescription": "Cadabam's Diagnostic Centre Jayanagar",
                    "areaServed": "IN",
                    "availableLanguage": ["English"]
                  }
                ],
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "17th Mile, Kanakapura Road, Gulakamale Post",
                  "addressLocality": "Bangalore",
                  "addressRegion": "Karnataka",
                  "postalCode": "560082",
                  "addressCountry": "IN"
                }
              }
            })}
          </script>
        </Head>

        <div className={styles.contactContainer}>
          <div className={styles.contactHeader}>
            <h1>Contact Us</h1>
            <p>We're here to help with all your diagnostic needs</p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.infoCard}>
                <h2>Our Centers</h2>
                <div className={styles.centerDetails}>
                  <h3>Cadabam's Megsan Indiranagar</h3>
                  <p>Call: +91 8050381444</p>
                  
                  <h3>Cadabam's Diagnostic Centre Banshankari</h3>
                  <p>Call: +91 99006 64696</p>
                  
                  <h3>Cadabam's Diagnostic Centre Jayanagar</h3>
                  <p>Call: +91 8861821122</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h2>Location</h2>
                <p>19th Main Road, HSR Layout</p>
                <p>Bangalore, Karnataka 560102</p>
              </div>

              <div className={styles.infoCard}>
                <h2>Business Hours</h2>
                <p>Monday - Sunday: 24/7</p>
                <p>Home Collection: 6:00 AM - 4:00 PM</p>
              </div>

              <div className={styles.infoCard}>
                <h2>Email Us</h2>
                <p>General Enquiries: info@cadabamsdiagnostics.com</p>
                <p>Support: support@cadabamsdiagnostics.com</p>
              </div>
            </div>

            <div className={styles.contactForm}>
              <CustomContactForm1 onSuccess={handleFormSuccess} />
            </div>
          </div>

          <div className={styles.mapSection}>
            <h2>Find Our Centers</h2>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m46!1m12!1m3!1d248849.886539092!2d77.49085452343747!3d12.953945600000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m31!3e6!4m5!1s0x3bae17d570e15637%3A0x7e7b8c6d2e8f1a5b!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!3m2!1d12.9715987!2d77.6412164!4m5!1s0x3bae11c7ab6be5e7%3A0x24b7c2c5a8d7f9e3!2sBanashankari%2C%20Bengaluru%2C%20Karnataka!3m2!1d12.9352!2d77.5431!4m5!1s0x3bae14c9c7d8e5f1%3A0x8e2f5d7a9b1c3e4f!2sJayanagar%2C%20Bengaluru%2C%20Karnataka!3m2!1d12.9279!2d77.5831!4m5!1s0x3bae1670c9b44e6d%3A0x2b83bcc2dadccc47!2sBengaluru%2C%20Karnataka!3m2!1d12.9715987!2d77.5945627!5e0!3m2!1sen!2sin!4v1672847891234!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cadabam's Diagnostics Centers - Indiranagar, Banshankari & Jayanagar"
              />
            </div>
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
}
