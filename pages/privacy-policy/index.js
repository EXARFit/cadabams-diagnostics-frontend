import React from "react";
import { AuthProvider } from "../../contexts/AuthContext";
import Layout from "@/components/Layout";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Introduction",
      content:
        "At Your Health Lab, we are committed to protecting your privacy and ensuring the confidentiality of your personal and health information. This Privacy Policy outlines our practices concerning the collection, use, and disclosure of your data when you use our services.",
    },
    {
      title: "Information We Collect",
      content:
        "We collect various types of information to provide and improve our services, including: Personal Information (e.g., name, contact details, date of birth), Health Information (e.g., medical history, test results), and Usage Data (e.g., how you interact with our website and services).",
    },
    {
      title: "How We Use Your Information",
      content:
        "We use your information to provide our health lab services, improve our offerings, communicate with you about your health and our services, process payments, and comply with legal obligations. We do not sell your personal information to third parties.",
    },
    {
      title: "Data Security",
      content:
        "We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.",
    },
    {
      title: "Sharing Your Information",
      content:
        "We may share your information with healthcare providers involved in your care, with your consent. We may also share data with service providers who assist us in operating our website, conducting our business, or servicing you. These parties are obligated to keep this information confidential.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data. To exercise these rights, please contact us using the information provided at the end of this policy.",
    },
    {
      title: "Cookies and Tracking Technologies",
      content:
        "We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
    },
    {
      title: "Changes to This Privacy Policy",
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'last updated' date at the top of this Privacy Policy.",
    },
    {
      title: "Contact Us",
      content:
        "If you have any questions about this Privacy Policy, please contact us at: privacy@yourhealthlab.com or [Your Health Lab Address].",
    },
  ];

  return (
    <AuthProvider>
      <Layout title="Privacy Policy | Your Health Lab">
        <div className={styles.container}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.intro}>
            Your privacy is important to us. This Privacy Policy explains how
            Your Health Lab collects, uses, and protects your personal
            information.
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

export default PrivacyPolicy;
