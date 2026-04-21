import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Phone, Mail, Clock, X, PhoneCall, MapPin, ChevronRight } from 'lucide-react';
import styles from './ContactDetailsModal.module.css';

const MAIN_PHONE = '+91 80503 81444';
const MAIN_TEL = '+918050381444';

const centers = [
  { name: 'Banashankari', slug: 'banashankari', area: 'South Bangalore' },
  { name: 'Jayanagar', slug: 'jayanagar', area: 'South Bangalore' },
  { name: 'Kanakapura Road', slug: 'kanakapura', area: 'South Bangalore' },
  { name: 'Kalyan Nagar', slug: 'kalyannagar', area: 'North-East Bangalore' },
];

const ContactDetailsModal = ({ isOpen, onClose, testName }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modal = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <button onClick={onClose} className={styles.closeButton} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <PhoneCall size={28} strokeWidth={2.2} />
          </div>
          <h2 className={styles.title}>Book Your Test</h2>
          {testName && (
            <p className={styles.subtitle}>
              Enquiring about <strong>{testName}</strong>
            </p>
          )}
          <p className={styles.message}>
            Call us directly, or visit any of our centers below.
          </p>
        </div>

        <a href={`tel:${MAIN_TEL}`} className={styles.primaryCallCta}>
          <Phone size={18} strokeWidth={2.4} />
          <span>Call Now: {MAIN_PHONE}</span>
        </a>

        <div className={styles.centersHeading}>
          <span>Our Centers</span>
        </div>

        <div className={styles.centersList}>
          {centers.map((c) => (
            <Link
              key={c.slug}
              href={`/bangalore/center/${c.slug}`}
              className={styles.centerCard}
              onClick={onClose}
            >
              <div className={styles.centerInfo}>
                <div className={styles.centerName}>
                  <MapPin size={15} className={styles.pinIcon} />
                  {c.name}
                </div>
                <div className={styles.centerArea}>{c.area}</div>
              </div>
              <div className={styles.viewBadge}>
                <span>View</span>
                <ChevronRight size={14} strokeWidth={2.4} />
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.extraInfo}>
          <div className={styles.infoRow}>
            <Mail size={15} className={styles.infoIcon} />
            <a href="mailto:info@cadabamsdiagnostics.com">info@cadabamsdiagnostics.com</a>
          </div>
          <div className={styles.infoRow}>
            <Clock size={15} className={styles.infoIcon} />
            <span>Mon - Sun: 24/7 &nbsp;&middot;&nbsp; Home Collection: 6 AM - 4 PM</span>
          </div>
        </div>

        <button onClick={onClose} className={styles.closeCtaButton}>
          Close
        </button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ContactDetailsModal;
