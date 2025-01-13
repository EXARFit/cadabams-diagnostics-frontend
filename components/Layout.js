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
        <Head>
  <title>{title} | Cadabam's Diagnostics Labs</title>
  <meta name="description" content="Cadabam's Diagnostics Labs - Fast and Reliable Health Checkups" />
  <link rel="icon" href="/favicon.ico" />
  
  {/* Heap Analytics */}
  <script type="text/javascript" dangerouslySetInnerHTML={{
    __html: `
      window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
      heap.load("1306967079");
    `
  }} />
</Head>
        
      </Head>

      <Navbar />
      <MobileSearchBar />

      <main className={styles.main}>{children}</main>

      <CommonSections />
      <Footer />
      <footer className={styles.footer}>
        <p>&copy; 2023 Cadabam's Diagnostics Labs. All rights reserved.</p>
      </footer>

      {/* Enhanced Floating Call Button */}
      <a href="tel:9900126611" className={styles.floatingCall}>
        <div className={styles.callIcon}>
          <div className={styles.rippleEffect}></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>
        <span className={styles.callTooltip}>+91 99001 26611</span>
      </a>

      <MobileCartSummary />
    </div>
  );
}
