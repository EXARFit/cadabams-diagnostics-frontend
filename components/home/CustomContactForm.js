import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './CustomContactForm.module.css';

const CustomContactForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const freshsalesData = new FormData();
      freshsalesData.append('file_attachments_present', false);
      freshsalesData.append('contact[first_name]', formData.firstName);
      freshsalesData.append('contact[last_name]', formData.lastName);
      freshsalesData.append('contact[mobile_number]', formData.mobile);
      freshsalesData.append('contact[email]', formData.email);
      freshsalesData.append('contact[address]', formData.address);
      freshsalesData.append('entity_type', 2);
      freshsalesData.append('asset_key', 'bb88c16791f1cb14ef2689824060cde9861d5bfdd5e32975167f8cdb57f7b0b6');

      const response = await fetch('https://cadabamsdiagnostics.myfreshworks.com/crm/sales/smart_form/create_entity?file_attachments_present=false', {
        method: 'POST',
        body: freshsalesData
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      setFormData({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        address: ''
      });

      // Redirect to thank-you page after successful submission
      router.push('/thank-you');
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.formSection}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <Image 
            src="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1728018316689-966136917.png" 
            alt="Cadabams Diagnostics" 
            width={120} 
            height={100} 
          />
        </div>
        
        <h2 className={styles.title}>Contact Us</h2>
        <p className={styles.subtitle}>Please share your details.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="E.g. John"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="E.g. Smith"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mobile">Mobile</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="E.g. 17145965875"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E.g. john.smith@acmecorp.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="E.g. 123 Main Street, Apt. 5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CustomContactForm;