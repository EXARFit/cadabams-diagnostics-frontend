import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api-prod.cadabamsdiagnostics.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com https://cadabamsdiagnostics.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api-prod.cadabamsdiagnostics.com; frame-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none';"
        />
        <meta
          httpEquiv="X-XSS-Protection"
          content="1; mode=block"
        />
        <meta
          httpEquiv="X-Frame-Options"
          content="SAMEORIGIN"
        />
        <meta
          httpEquiv="X-Content-Type-Options"
          content="nosniff"
        />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=()"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
