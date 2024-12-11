import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import styles from './ThankYouModal.module.css';

const ThankYouModal = ({ isOpen, onClose, bookingDetails }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={24} color="#6b7280" />
        </button>
        
        <div className={styles.modalHeader}>
          <CheckCircle className={styles.checkIcon} />
          <h2 className={styles.title}>Booking Confirmed!</h2>
        </div>
        
        <p className={styles.message}>
          Thank you for booking with us. Your appointment has been confirmed.
        </p>
        
        {bookingDetails && (
          <div className={styles.detailsBox}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Patient ID:</span>{' '}
              {bookingDetails.patientId}
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Bill ID:</span>{' '}
              {bookingDetails.billId}
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Appointment ID:</span>{' '}
              {bookingDetails.appointmentId}
            </div>
          </div>
        )}
        
        <button
          onClick={onClose}
          className={styles.continueButton}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;