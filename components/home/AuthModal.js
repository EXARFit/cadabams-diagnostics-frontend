import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const { login } = useAuth();

  const handleGetOTP = async () => {
    try {
      const response = await fetch('https://cadabamsapi.exar.ai/api/v1/user/auth/get-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setMessage({ type: 'success', content: data.message || 'OTP sent successfully. Please check your phone.' });
      } else {
        setMessage({ type: 'error', content: data.message || 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Error getting OTP:', error);
      setMessage({ type: 'error', content: 'Failed to send OTP. Please try again.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      setMessage({ type: 'error', content: 'Please get OTP first.' });
      return;
    }
    try {
      const url = isSignUp
        ? 'https://cadabamsapi.exar.ai/api/v1/user/auth/signup'
        : 'https://cadabamsapi.exar.ai/api/v1/user/auth/signin';
      const body = isSignUp ? { name, phone, otp } : { phone, otp };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        login(data.user || data.updatedUser, data.accessToken);
        onClose();
        setMessage({ type: 'success', content: data.message || (isSignUp ? 'Account created successfully' : 'User logged in successfully') });
      } else {
        setMessage({ type: 'error', content: data.message || 'Authentication failed. Please try again.' });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setMessage({ type: 'error', content: 'Authentication failed. Please try again.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerItem}>
              <CheckCircle className={styles.bannerIcon} />
              <div>
                <p>In-house labs</p>
                <p className={styles.highlight}>NABL certified</p>
              </div>
            </div>
            <div className={styles.bannerItem}>
              <Clock className={styles.bannerIcon} />
              <div>
                <p>60 mins collection</p>
                <p className={styles.highlight}>6 AM - 10 PM</p>
              </div>
            </div>
          </div>
          <div className={styles.bannerImagePlaceholder}>
            👍
          </div>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          <X />
        </button>
        <h2 className={styles.modalTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <p className={styles.modalSubtitle}>This is to verify your mobile number.</p>
        {message.content && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <p>{message.content}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className={styles.input}
            />
          )}
          <div className={styles.phoneInput}>
            <span className={styles.countryCode}>+91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter mobile number"
              required
              className={styles.input}
            />
          </div>
          {!otpSent ? (
            <button type="button" onClick={handleGetOTP} className={styles.button}>
              Get OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </>
          )}
        </form>
        <p className={styles.infoText}>
          We will send order updates on this number via WhatsApp.
        </p>
        <p className={styles.termsText}>
          By continuing you accept our <a href="#" className={styles.link}>T&C</a> and <a href="#" className={styles.link}>Privacy Policy</a>
        </p>
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setOtpSent(false);
            setOtp('');
            setMessage({ type: '', content: '' });
          }}
          className={styles.switchButton}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </button>
      </div>
    </div>
  );
}