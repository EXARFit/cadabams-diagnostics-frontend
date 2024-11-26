import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from './TermsOfUse.module.css';

const TermsOfUse = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using our services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services."
    },
    {
      title: "Use of Services",
      content: "Our services are designed to provide fast, reliable lab tests and health checkups. You agree to use these services only for lawful purposes and in accordance with these Terms. You must not use our services in any way that causes, or may cause, damage to the service or impairment of the availability or accessibility of the service."
    },
    {
      title: "User Accounts",
      content: "Some features of our services may require you to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security."
    },
    {
      title: "Privacy",
      content: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and share your information. By using our services, you agree to our collection and use of information in accordance with our Privacy Policy."
    },
    {
      title: "Limitation of Liability",
      content: "Your Health Lab shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our services. This includes, but is not limited to, loss of data, loss of profits, or any other financial loss arising from or in any way connected with the use of this service."
    },
    {
      title: "Modifications to Service",
      content: "We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service."
    },
    {
      title: "Governing Law",
      content: "These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
    }
  ];

  return (
    <AuthProvider>
      <Layout title="Terms of Use | Your Health Lab">
        <div className={styles.container}>
          <h1 className={styles.title}>Terms of Use</h1>
          <p className={styles.intro}>
            Welcome to Cadabams Health Lab. By using our services, you agree to these terms. Please read them carefully.
          </p>
          {sections.map((section, index) => (
            <div key={index} className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
        </div>
      </Layout>
    </AuthProvider>
  );
};

export default TermsOfUse;