// pages/contact/index.js
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
          <link rel="canonical" href="https://diagnostics.cadabams.com/contact" />
          
          {/* Open Graph Tags */}
          <meta property="og:title" content="Contact Cadabam's Diagnostics - Leading Diagnostic Center in Bangalore" />
          <meta property="og:description" content="Get in touch with Cadabam's Diagnostics for all your medical testing and diagnostic needs. Easy appointment booking and home sample collection available." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://diagnostics.cadabams.com/contact" />
          <meta property="og:image" content="https://diagnostics.cadabams.com/images/og-image.jpg" />
          <meta property="og:site_name" content="Cadabam's Diagnostics" />
          
          {/* Schema.org markup */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact Cadabam's Diagnostics",
              "description": "Contact page for Cadabam's Diagnostics - Leading diagnostic center in Bangalore",
              "url": "https://diagnostics.cadabams.com/contact",
              "mainEntity": {
                "@type": "Organization",
                "name": "Cadabam's Diagnostics",
                "telephone": "+91-80-2323-2323",
                "email": "info@cadabamsdiagnostics.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "19th Main Road, HSR Layout",
                  "addressLocality": "Bangalore",
                  "postalCode": "560102",
                  "addressRegion": "Karnataka",
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
                <h2>Emergency Contact</h2>
                <p>24/7 Helpline: +91-80-2323-2323</p>
                <p>Emergency: +91-9876543210</p>
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
            <h2>Find Us</h2>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=YOUR_GOOGLE_MAPS_EMBED_URL"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cadabam's Diagnostics Location"
              />
            </div>
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
}