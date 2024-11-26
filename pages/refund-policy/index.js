import React from "react";
import { AuthProvider } from "../../contexts/AuthContext";
import Layout from "@/components/Layout";
import styles from "./RefundPolicy.module.css";

const RefundPolicy = () => {
  const sections = [
    {
      title: "Introduction",
      content:
        "At Your Health Lab, we strive to provide high-quality health testing services. We understand that circumstances may arise where a refund is necessary. This Refund Policy outlines our guidelines for refunds and cancellations.",
    },
    {
      title: "Eligibility for Refunds",
      content:
        "Refunds may be issued in the following circumstances:\n\n1. Cancellation of services before the test is performed\n2. Significant errors or delays on our part\n3. Defective or damaged testing kits\n4. As required by applicable law",
    },
    {
      title: "Refund Process",
      content:
        "To request a refund, please contact our customer service team at refunds@yourhealthlab.com or call us at [Your Phone Number]. Please provide your order number and the reason for your refund request. We will review each request on a case-by-case basis.",
    },
    {
      title: "Timeframe for Refunds",
      content:
        "If a refund is approved, we will process it within 5-10 business days. The time it takes for the refund to appear in your account may vary depending on your payment method and financial institution.",
    },
    {
      title: "Non-Refundable Items",
      content:
        "The following are generally not eligible for refunds:\n\n1. Completed laboratory tests\n2. Shipping fees (unless due to our error)\n3. Services cancelled after the testing process has begun",
    },
    {
      title: "Cancellations",
      content:
        "You may cancel your order for a full refund at any time before the testing kit is shipped or before the sample collection appointment, whichever comes first. Once the testing process has begun, cancellations may be subject to a processing fee.",
    },
    {
      title: "Exceptions",
      content:
        "We understand that exceptional circumstances can occur. If you believe your situation warrants special consideration, please contact our customer service team, and we will review your case individually.",
    },
    {
      title: "Changes to Refund Policy",
      content:
        "We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after any changes to this policy will constitute your acceptance of such changes.",
    },
    {
      title: "Contact Us",
      content:
        "If you have any questions about this Refund Policy, please contact us at: refunds@yourhealthlab.com or [Your Health Lab Address].",
    },
  ];

  return (
    <AuthProvider>
      <Layout title="Refund Policy | Your Health Lab">
        <div className={styles.container}>
          <h1 className={styles.title}>Refund Policy</h1>
          <p className={styles.intro}>
            Your Health Lab is committed to customer satisfaction. This Refund
            Policy explains our guidelines for refunds and cancellations.
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

export default RefundPolicy;
