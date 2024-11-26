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
  async rewrites() {
    return [
      // Default route
      {
        source: '/',
        destination: '/bangalore',
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