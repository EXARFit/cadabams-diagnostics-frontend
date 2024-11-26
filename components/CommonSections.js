import React from 'react';
import styles from './CommonSections.module.css';

export default function CommonSections() {
  return (
    <div className={styles.commonSections}>
      <section className={styles.section}>
        <h2>Cadabam's Diagnostics: What Defines Us</h2>
        <p>Welcome to Cadabam's Diagnostics, where diagnostic care meets modern convenience. We believe that accessing vital health insights shouldn't mean sacrificing comfort. That's why we bring advanced, high-quality testing services delivered straight to your doorstep. Our commitment to accuracy, fast, and compassion ensures that every test is handled with the utmost care, giving you reliable results without leaving home. Trusted by healthcare providers and patients alike, we're here to support your wellness journey with expertise you can count on.</p>
      </section>

      <section className={styles.section}>
        <h2>Why Choose Cadabam's Diagnostics</h2>
        <p>At Cadabam's Diagnostics, we prioritise your health with cutting-edge technology and a compassionate approach. Our expertise spans comprehensive lab tests, imaging, and specialised diagnostics, preventive health packages, all designed to provide clear answers when you need them most. With a team committed to accuracy and care, we make diagnostics easy, accessible, and precise. Choose Cadabam's Diagnostics for trusted insights that empower you on your health journey.</p>
      </section>

      <section className={styles.section}>
        <h2>Simple Steps to Book Your Test</h2>
        <p>1. Visit our website https://cadabamsdiagnostics.com/ to browse available tests and health packages.</p>
        <p>2. Schedule your preferred time for sample collection or scan appointment. Our platform makes it easy to pick the time that suits you best.</p>
        <p>3. In-Home Sample Collection: Our trained and certified health professionals will arrive on time, ensuring safe and professional collection procedures.</p>
        <p>4. Rapid Processing: Your samples are carefully transported to our state-of-the-art lab for fast, reliable analysis.</p>
        <p>5. Visit Our Advanced Scanning Facility: For scans, you can easily check in at our advanced facility where our technicians ensure a smooth and comfortable experience.</p>
        <p>6. Fast & Accurate Results: Samples and scans are processed in our advanced lab, with results delivered digitally for easy access.</p>
      </section>

      
    </div>
  );
}
