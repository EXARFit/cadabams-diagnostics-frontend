import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/Layout';

const CenterIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/bangalore');
  }, [router]);

  return (
    <Layout title="Cadabams Diagnostics Centers">
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <h1 style={{ marginBottom: '1rem', color: '#2a3990' }}>
            Cadabams Diagnostic Centers
          </h1>
          <p style={{ color: '#666' }}>
            Loading centers information...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CenterIndex;

// Use getStaticProps instead of redirect
export async function getStaticProps() {
  return {
    props: {}, // Return empty props
    revalidate: 1 // Enable ISR
  };
}