/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
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
    // Helper function to create redirect pairs (with and without trailing slash)
    const createRedirectPair = (source, destination) => [
      {
        source,
        destination,
        permanent: true,
        statusCode: 301
      },
      {
        source: source + '/',
        destination,
        permanent: true,
        statusCode: 301
      }
    ];

    // Flatten array of redirect pairs
    return [
      // New redirects from the spreadsheet
      ...createRedirectPair('/bangalore/lab-test/complete-blood-count-test-cbc', '/bangalore/lab-test/complete-blood-count-cbc'),
      ...createRedirectPair('/bangalore/lab-test/diabetes-test-dt', '/bangalore/lab-test/diabetes-sugar-test-dst'),
      ...createRedirectPair('/blog/page/2', '/'),
      ...createRedirectPair('/blogs/difference-between-mri-and-x-ray', '/blogs/difference-between-mri-and-xray'),
      ...createRedirectPair('/blogs/understanding-ecg-readings', '/blogs'),
      ...createRedirectPair('/pelvic-scan-bangalore', '/bangalore/ultrasound-scan/ultrasound-of-transvaginal-scan-tvs'),
      ...createRedirectPair('/x-ray-ultrasound', '/xray-scan'),

      // Existing redirects
      ...createRedirectPair('/pathology-lab-bangalore', '/'),
      ...createRedirectPair('/health-test-packages-bangalore', '/'),
      ...createRedirectPair('/laboratory', '/'),

      // Blog category redirects
      ...createRedirectPair('/blogs/category/blood-test/blood-sugar', '/blogs'),
      ...createRedirectPair('/blogs/category/blood-test/quadruple-marker-test-blood-test', '/blogs'),
      ...createRedirectPair('/blogs/category/blood-test/thyroid', '/blogs'),
      ...createRedirectPair('/blogs/category/services/comparison', '/blogs'),
      ...createRedirectPair('/blogs/category/ultrasound-scan/anomaly-scan', '/blogs'),
      ...createRedirectPair('/blogs/category/ultrasound-scan/fetal-doppler-scan', '/blogs'),
      ...createRedirectPair('/blogs/category/ultrasound-scan/nt-scan', '/blogs'),
      ...createRedirectPair('/blogs/category/ultrasound-scan/tiffa-scan', '/blogs'),

      // Location redirects
      ...createRedirectPair('/locations/blood-test-centre-in-banashankari', '/bangalore/banashankari/lab-test'),
      ...createRedirectPair('/locations/diagnostic-centre-in-banashankari', '/bangalore/center/banashankari'),
      ...createRedirectPair('/locations/diagnostic-centre-in-indiranagar', '/bangalore/center/indiranagar'),
      ...createRedirectPair('/locations/ultrasound-centre-in-banashankari', '/bangalore/banashankari/ultrasound-scan'),
      ...createRedirectPair('/locations/xray-centre-in-banashankari', '/bangalore/banashankari/xray-scan'),

      // About and Management redirects
      ...createRedirectPair('/about-us/management-team', '/management-team'),
      ...createRedirectPair('/about-us/clinical-team', '/clinical-team'),
      ...createRedirectPair('/about-us/mission-vision', '/about-us'),

      // Contact and Thank You pages
      ...createRedirectPair('/thank-you-for-book-now', '/thank-you'),

      // Services and Treatments
      ...createRedirectPair('/treatments', '/'),
      ...createRedirectPair('/services', '/'),

      // Test and Scan redirects
      ...createRedirectPair('/ultrasound-scan-banashankari', '/bangalore/banashankari/ultrasound-scan'),
      ...createRedirectPair('/cbc-test-bangalore', '/bangalore/lab-test/complete-blood-count-cbc'),
      ...createRedirectPair('/abdomen-pelvis-scan-bangalore', '/bangalore/ultrasound-scan/abdomen-and-pelvis-ultrasound-scans'),
      ...createRedirectPair('/testis-scan-bangalore', '/bangalore/ultrasound-scan/testis-ultrasound-scan'),
      ...createRedirectPair('/transvaginal-scan-bangalore', '/bangalore/ultrasound-scan/ultrasound-of-transvaginal-scan-tvs'),
      ...createRedirectPair('/breast-biopsy-scan-bangalore', '/bangalore/ultrasound-scan/breast-biopsy-scan'),
      ...createRedirectPair('/diabetes-test-bangalore', '/bangalore/lab-test/diabetes-test-dt'),
      ...createRedirectPair('/fetal-imaging-in-bangalore', '/bangalore/pregnancy-scan/fetal-imaging'),
      ...createRedirectPair('/fetal-interventional-in-bangalore', '/bangalore/pregnancy-scan/fetal-interventional-ultrasound-echo'),
      ...createRedirectPair('/penile-doppler-test-in-bangalore', '/bangalore/ultrasound-scan/penile-doppler-ultrasound-scan'),
      ...createRedirectPair('/sonomammography-scan-bangalore', '/bangalore/ultrasound-scan/sonomammography-ultrasound-scan'),
      ...createRedirectPair('/thyroid-scan-bangalore', '/bangalore/ultrasound-scan/thyroid-scan'),
      ...createRedirectPair('/echocardiography-test-in-bangalore', '/bangalore/ultrasound-scan/echocardiogram-testing'),
      ...createRedirectPair('/elastography-test-in-bangalore', '/bangalore/ultrasound-scan/elastography-test'),
      ...createRedirectPair('/kidney-blood-test-bangalore', '/bangalore/lab-test/kidney-function-test-kft'),
      ...createRedirectPair('/liver-blood-test-bangalore', '/bangalore/lab-test/liver-function-test-lft'),
      ...createRedirectPair('/perianal-imaging-center-in-bangalore', '/bangalore/mri-scan/perianal-imaging-center'),
      ...createRedirectPair('/pregnancy-ultrasound-in-bangalore', '/bangalore/pregnancy-scan/pregnancy-ultrasound-scan'),
      ...createRedirectPair('/msk-scans-in-bangalore', '/bangalore/msk-scan'),
      ...createRedirectPair('/ultrasound-scan-bangalore', '/bangalore/ultrasound-scan'),
      ...createRedirectPair('/xray-centre-in-bangalore', '/bangalore/xray-scan'),

      // Blog redirects
      ...createRedirectPair('/blog', '/blogs'),
      ...createRedirectPair('/blogs/echo-tmt-ecg', '/blogs'),
      ...createRedirectPair('/blogs/general-ultrasound', '/blogs'),
      ...createRedirectPair('/blogs/x-ray-x-ray-procedures', '/blogs'),
      ...createRedirectPair('/blogs/category/blood-test', '/blogs'),
      ...createRedirectPair('/blogs/category/pathology-lab', '/blogs'),
      ...createRedirectPair('/blogs/category/services', '/blogs'),
      ...createRedirectPair('/blogs/category/ultrasound-scan', '/blogs'),
      ...createRedirectPair('/blogs/category/uncategorized', '/blogs'),
      ...createRedirectPair('/blogs/hello-world', '/blogs'),
      ...createRedirectPair('/blogs/author/test', '/blogs'),

      // Blog tag redirects
      ...createRedirectPair('/blogs/tag/:tag*', '/blogs'),

      // Specific blog post redirects
      ...createRedirectPair(
        '/blogs/the-power-of-pee-5-diseases-detectable-through-urine-tests',
        '/blogs/the-power-of-pee-diseases-detectable-through-urine-tests'
      ),
      ...createRedirectPair(
        '/blogs/top-10-foods-to-include-in-your-diet-to-manage-diabetes-and-lower-blood-sugar',
        '/blogs/top-foods-to-include-in-your-diet-to-manage-diabetes-and-lower-blood-sugar'
      ),

      // Other pages
      ...createRedirectPair('/blood-collection-at-home', '/'),
      ...createRedirectPair('/landing-form', '/'),
      ...createRedirectPair('/locations', '/'),
      ...createRedirectPair('/create-your-website-with-blocks', '/'),
      ...createRedirectPair('/gallery', '/'),
      ...createRedirectPair('/sample-page', '/'),

      // Policy pages
      ...createRedirectPair('/cancellation-refund-policy', '/refund-policy'),
      ...createRedirectPair('/privacy-policies', '/privacy-policy'),
      ...createRedirectPair('/privacy-policy-2', '/privacy-policy'),
      ...createRedirectPair('/terms-and-conditions', '/terms-of-use'),
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