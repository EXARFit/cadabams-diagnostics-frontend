import React from "react";
import { AuthProvider } from "../../contexts/AuthContext";
import Layout from "@/components/Layout";
import styles from "./Legal.module.css";

const Legal = () => {
  const sections = [
    {
      title: "Introduction",
      content:
        "This Legal Policy outlines the legal guidelines and practices of Your Health Lab. By using our services, you agree to comply with and be bound by this policy. Please read it carefully.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content, trademarks, logos, and other intellectual property displayed on our website and services are the property of Your Health Lab or its licensors. You may not use, reproduce, or distribute any of our intellectual property without our explicit written consent.",
    },
    {
      title: "Disclaimer of Warranties",
      content:
        "Your Health Lab provides its services 'as is' and 'as available' without any warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, timely, secure, or error-free.",
    },
    {
      title: "Limitation of Liability",
      content:
        "To the fullest extent permitted by applicable law, Your Health Lab shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.",
    },
    {
      title: "Indemnification",
      content:
        "You agree to indemnify and hold Your Health Lab and its affiliates, officers, agents, and employees harmless from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your use of our services, your violation of these legal terms, or your violation of any rights of another.",
    },
    {
      title: "Compliance with Laws",
      content:
        "You agree to comply with all applicable laws, statutes, ordinances, and regulations regarding your use of our services. Your Health Lab reserves the right to investigate complaints or reported violations of our legal terms and to take any action we deem appropriate, including reporting any suspected unlawful activity to law enforcement officials.",
    },
    {
      title: "Changes to Legal Policy",
      content:
        "We reserve the right to modify this legal policy at any time. We will notify users of any significant changes by posting a notice on our website. Your continued use of our services after any changes to this policy will constitute your acceptance of such changes.",
    },
    {
      title: "Governing Law",
      content:
        "This Legal Policy and your use of Your Health Lab services shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without giving effect to any principles of conflicts of law.",
    },
  ];

  return (
    <AuthProvider>
      <Layout title="Legal | Your Health Lab">
        <div className={styles.container}>
          <h1 className={styles.title}>Legal Policy</h1>
          <p className={styles.intro}>
            Welcome to Your Health Lab's Legal Policy. This document outlines
            our legal practices and your rights and responsibilities when using
            our services.
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

export default Legal;
