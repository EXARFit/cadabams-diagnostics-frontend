/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com'
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Blog category redirects
      {
        source: '/blogs/category/blood-test/blood-sugar',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/blood-test/quadruple-marker-test-blood-test',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/blood-test/thyroid',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/services/comparison',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/ultrasound-scan/anomaly-scan',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/ultrasound-scan/fetal-doppler-scan',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/ultrasound-scan/nt-scan',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/ultrasound-scan/tiffa-scan',
        destination: '/blogs',
        permanent: true,
      },

      // Location redirects
      {
        source: '/locations/blood-test-centre-in-banashankari',
        destination: '/bangalore/banashankari/lab-test',
        permanent: true,
      },
      {
        source: '/locations/diagnostic-centre-in-banashankari',
        destination: '/bangalore/center/banashankari',
        permanent: true,
      },
      {
        source: '/locations/diagnostic-centre-in-indiranagar',
        destination: '/bangalore/center/indiranagar',
        permanent: true,
      },
      {
        source: '/locations/ultrasound-centre-in-banashankari',
        destination: '/bangalore/banashankari/ultrasound-scan',
        permanent: true,
      },
      {
        source: '/locations/xray-centre-in-banashankari',
        destination: '/bangalore/banashankari/xray-scan',
        permanent: true,
      },

      // About and Management redirects
      {
        source: '/about-us/management-team',
        destination: '/management-team',
        permanent: true,
      },
      {
        source: '/about-us/clinical-team',
        destination: '/clinical-team',
        permanent: true,
      },
      {
        source: '/about-us/mission-vision',
        destination: '/about-us',
        permanent: true,
      },

      // Contact and Thank You pages
      {
        source: '/contact-us',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/thank-you',
        destination: '/thank-you',
        permanent: true,
      },
      {
        source: '/thank-you-for-book-now',
        destination: '/',
        permanent: true,
      },

      // Services and Treatments
      {
        source: '/treatments',
        destination: '/',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/',
        permanent: true,
      },

      // Test and Scan redirects
      {
        source: '/ultrasound-scan-banashankari',
        destination: '/bangalore/banashankari/ultrasound-scan',
        permanent: true,
      },
      {
        source: '/cbc-test-bangalore',
        destination: '/bangalore/lab-test/complete-blood-count-cbc',
        permanent: true,
      },
      {
        source: '/abdomen-pelvis-scan-bangalore',
        destination: '/bangalore/ultrasound-scan/abdomen-and-pelvis-ultrasound-scans',
        permanent: true,
      },
      {
        source: '/testis-scan-bangalore',
        destination: '/bangalore/ultrasound-scan/testis-ultrasound-scan',
        permanent: true,
      },
      {
        source: '/transvaginal-scan-bangalore',
        destination: '/bangalore/ultrasound-scan/ultrasound-of-transvaginal-scan-tvs',
        permanent: true,
      },
      {
        source: '/breast-biopsy-scan-bangalore',
        destination: '/bangalore/ultrasound-scan/breast-biopsy-scan',
        permanent: true,
      },
      {
        source: '/diabetes-test-bangalore',
        destination: '/bangalore/lab-test/diabetes-test-dt',
        permanent: true,
      },
      {
        source: '/fetal-imaging-in-bangalore',
        destination: '/bangalore/pregnancy-scan/fetal-imaging',
        permanent: true,
      },
      {
        source: '/fetal-interventional-in-bangalore',
        destination: '/bangalore/pregnancy-scan/fetal-interventional-ultrasound-echo',
        permanent: true,
      },
      {
        source: '/penile-doppler-test-in-bangalore',
        destination: '/bangalore/ultrasound-scan/penile-doppler-ultrasound-scan',
        permanent: true,
      },
      {
        source: '/sonomammography-scan-bangalore',
        destination: '/bangalore/ultrasound-scan/sonomammography-ultrasound-scan',
        permanent: true,
      },
      {
        source: '/thyroid-scan-bangalore',
        destination: '/bangalore/ultrasound-scan/thyroid-scan',
        permanent: true,
      },
      {
        source: '/echocardiography-test-in-bangalore',
        destination: '/bangalore/ultrasound-scan/echocardiogram-testing',
        permanent: true,
      },
      {
        source: '/elastography-test-in-bangalore',
        destination: '/bangalore/ultrasound-scan/elastography-test',
        permanent: true,
      },
      {
        source: '/kidney-blood-test-bangalore',
        destination: '/bangalore/lab-test/kidney-function-test-kft',
        permanent: true,
      },
      {
        source: '/liver-blood-test-bangalore',
        destination: '/bangalore/lab-test/liver-function-test-lft',
        permanent: true,
      },
      {
        source: '/perianal-imaging-center-in-bangalore',
        destination: '/bangalore/mri-scan/perianal-imaging-center',
        permanent: true,
      },
      {
        source: '/pregnancy-ultrasound-in-bangalore',
        destination: '/bangalore/pregnancy-scan/pregnancy-ultrasound-scan',
        permanent: true,
      },
      {
        source: '/msk-scans-in-bangalore',
        destination: '/bangalore/mri-scan',
        permanent: true,
      },
      {
        source: '/ultrasound-scan-bangalore',
        destination: '/bangalore/ultrasound-scan',
        permanent: true,
      },
      {
        source: '/xray-centre-in-bangalore',
        destination: '/bangalore/xray-scan',
        permanent: true,
      },

      // Blog redirects
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/echo-tmt-ecg',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/general-ultrasound',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/x-ray-x-ray-procedures',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/blood-test',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/pathology-lab',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/services',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/ultrasound-scan',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/category/uncategorized',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/hello-world',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blogs/author/test',
        destination: '/blogs',
        permanent: true,
      },

      // Blog tag redirects
      {
        source: '/blogs/tag/:tag*',
        destination: '/blogs',
        permanent: true,
      },

      // Specific blog post redirects
      {
        source: '/blogs/the-power-of-pee-5-diseases-detectable-through-urine-tests',
        destination: '/blogs/the-power-of-pee-diseases-detectable-through-urine-tests',
        permanent: true,
      },
      {
        source: '/blogs/top-10-foods-to-include-in-your-diet-to-manage-diabetes-and-lower-blood-sugar',
        destination: '/blogs/top-foods-to-include-in-your-diet-to-manage-diabetes-and-lower-blood-sugar',
        permanent: true,
      },

      // Other pages
      {
        source: '/blood-collection-at-home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/landing-form',
        destination: '/',
        permanent: true,
      },
      {
        source: '/locations',
        destination: '/',
        permanent: true,
      },
      {
        source: '/create-your-website-with-blocks',
        destination: '/',
        permanent: true,
      },
      {
        source: '/gallery',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sample-page',
        destination: '/',
        permanent: true,
      },

      // Policy pages
      {
        source: '/cancellation-refund-policy',
        destination: '/refund-policy',
        permanent: true,
      },
      {
        source: '/privacy-policies',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/privacy-policy-2',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms-of-use',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Default route
      {
        source: '/',
        destination: '/bangalore',
      },
      // Base routes without bangalore prefix
      {
        source: '/xray-scan',
        destination: '/bangalore/xray-scan',
      },
      {
        source: '/mri-scan',
        destination: '/bangalore/mri-scan',
      },
      {
        source: '/ct-scan',
        destination: '/bangalore/ct-scan',
      },
      {
        source: '/ultrasound-scan',
        destination: '/bangalore/ultrasound-scan',
      },
      {
        source: '/msk-scan',
        destination: '/bangalore/msk-scan',
      },
      {
        source: '/pregnancy-scan',
        destination: '/bangalore/pregnancy-scan',
      },
      {
        source: '/lab-test',
        destination: '/bangalore/lab-test',
      },
      // Individual lab test routes (must be before the general lab-test routes)
      {
        source: '/bangalore/lab-test/:testSlug',
        destination: '/bangalore/lab-test/:testSlug',
      },
      {
        source: '/bangalore/:location/lab-test/:testSlug',
        destination: '/bangalore/lab-test/:testSlug',
      },
      // Direct radiology pages
      {
        source: '/bangalore/xray-scan',
        destination: '/bangalore/xray-scan',
      },
      {
        source: '/bangalore/mri-scan',
        destination: '/bangalore/mri-scan',
      },
      {
        source: '/bangalore/ct-scan',
        destination: '/bangalore/ct-scan',
      },
      {
        source: '/bangalore/ultrasound-scan',
        destination: '/bangalore/ultrasound-scan',
      },
      {
        source: '/bangalore/msk-scan',
        destination: '/bangalore/msk-scan',
      },
      {
        source: '/bangalore/pregnancy-scan',
        destination: '/bangalore/pregnancy-scan',
      },
      // Location-specific radiology pages
      {
        source: '/bangalore/:location/xray-scan',
        destination: '/bangalore/xray-scan',
      },
      {
        source: '/bangalore/:location/mri-scan',
        destination: '/bangalore/mri-scan',
      },
      {
        source: '/bangalore/:location/ct-scan',
        destination: '/bangalore/ct-scan',
      },
      {
        source: '/bangalore/:location/ultrasound-scan',
        destination: '/bangalore/ultrasound-scan',
      },
      {
        source: '/bangalore/:location/msk-scan',
        destination: '/bangalore/msk-scan',
      },
      {
        source: '/bangalore/:location/pregnancy-scan',
        destination: '/bangalore/pregnancy-scan',
      },
      // Lab test pages
      {
        source: '/bangalore/lab-test',
        destination: '/bangalore/lab-test',
      },
      {
        source: '/bangalore/:location/lab-test',
        destination: '/bangalore/lab-test',
      },
      // Center pages
      {
        source: '/bangalore/:location/center/',
        destination: '/bangalore/center',
      },
      // Location routes - should show home page (must be last)
      {
        source: '/bangalore/:location',
        destination: '/bangalore',
      }
    ];
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;