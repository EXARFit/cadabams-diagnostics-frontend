import Head from 'next/head';
import Navbar from './home/Navbar';
import Footer from './Footer';
import CommonSections from './CommonSections';
import MobileCartSummary from './home/MobileCartSummary';
import MobileSearchBar from './home/MobileSearchBar';
import styles from './Layout.module.css';

export default function Layout({ children, title }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | Cadabam's Diagnostics Labs</title>
        <meta name="description" content="Cadabam's Diagnostics Labs - Fast and Reliable Health Checkups" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <MobileSearchBar />

      <main className={styles.main}>{children}</main>

      <CommonSections />
      <Footer />
      <footer className={styles.footer}>
        <p>&copy; 2023 Cadabam's Diagnostics Labs. All rights reserved.</p>
      </footer>

      <MobileCartSummary />
    </div>
  );
}