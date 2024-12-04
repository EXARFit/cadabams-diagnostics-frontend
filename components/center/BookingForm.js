import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './BookingForm.module.css';

const BookingForm = ({ centerInfo }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: centerInfo.address || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Create FormData for Freshsales
        const freshsalesData = new FormData();
        freshsalesData.append('file_attachments_present', false);
        freshsalesData.append('contact[first_name]', formData.firstName);
        freshsalesData.append('contact[last_name]', formData.lastName);
        // Add zero prefix to mobile number
        const mobileNumber = formData.mobile.startsWith('0') ? formData.mobile : `0${formData.mobile}`;
        freshsalesData.append('contact[mobile_number]', mobileNumber);
        freshsalesData.append('contact[email]', formData.email);
        freshsalesData.append('contact[address]', formData.address);
        freshsalesData.append('entity_type', 2);
        freshsalesData.append('asset_key', '6a14c4677d7b5a7b65a1efa0931c9e51512881d05d5977ec34419e50d8c0fe05');

        // Submit to Freshsales
        await fetch('https://cadabamsdiagnostics.myfreshworks.com/crm/sales/smart_form/create_entity?file_attachments_present=false', {
          method: 'POST',
          body: freshsalesData
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          mobile: '',
          email: '',
          address: centerInfo.address || ''
        });
        
        alert('Thank you for your booking request!');
      } catch (error) {
        console.error('Submission error:', error);
        alert('There was an error submitting your request. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>Book Home Collection</h3>
        <p className={styles.formSubtitle}>Free home sample collection</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.nameGroup}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={`${styles.input} ${errors.firstName ? styles.errorInput : ''}`}
              disabled={isSubmitting}
            />
            {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={`${styles.input} ${errors.lastName ? styles.errorInput : ''}`}
              disabled={isSubmitting}
            />
            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <FaPhone className={styles.inputIcon} />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className={`${styles.input} ${errors.mobile ? styles.errorInput : ''}`}
            disabled={isSubmitting}
          />
          {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
        </div>

        <div className={styles.inputGroup}>
          <FaEnvelope className={styles.inputIcon} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
            disabled={isSubmitting}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <FaMapMarkerAlt className={styles.inputIcon} />
          <input
            type="text"
            name="address"
            placeholder="Collection Address"
            value={formData.address}
            onChange={handleChange}
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Book Now'}
        </button>

        <div className={styles.info}>
          <p className={styles.infoText}>✓ NABL Accredited Labs</p>
          <p className={styles.infoText}>✓ Get reports within 24 hours</p>
        </div>
      </form>
    </div>
  );
};

BookingForm.propTypes = {
  centerInfo: PropTypes.shape({
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    whatsapp: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    map_location: PropTypes.string.isRequired
  }).isRequired
};

export default React.memo(BookingForm);