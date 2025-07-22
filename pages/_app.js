import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import Script from 'next/script'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  // Add error boundary for unhandled errors
  useEffect(() => {
    const handleError = (error) => {
      console.error('Unhandled error:', error);
      // You can add error reporting service here
    };

    const handleRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Prevent the default browser behavior
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <>
      {/* Heap Analytics Script */}
      <Script
        id="heap-analytics"
        strategy="afterInteractive"
        onError={(error) => {
          console.error('Heap Analytics failed to load:', error);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            try {
              window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
              heap.load("2887065044");
            } catch (error) {
              console.error('Error loading Heap Analytics:', error);
            }
          `
        }}
      />
      
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        onError={(error) => {
          console.error('GTM failed to load:', error);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            try {
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TMTNG6X');
            } catch (error) {
              console.error('Error loading GTM:', error);
            }
          `
        }}
      />
      
      <AuthProvider>
        <CartProvider>
          {/* Google Tag Manager NoScript */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-TMTNG6X"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          <Component {...pageProps} />
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
