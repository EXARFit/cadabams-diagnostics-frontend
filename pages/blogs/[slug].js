import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../styles/BlogPost.module.css';
import NotFound from '../../components/NotFound';

// Schema Generator Function (Unchanged)
const generateSchemas = (data, baseUrl, slug) => {
  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.metaDescription || `Read about ${data.title}`,
    image: data.imageUrl ? [data.imageUrl] : [],
    author: {
      '@type': 'Person',
      name: data.verifiedBy || 'Cadabams Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cadabams',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    datePublished: data.publishedDate || new Date().toISOString(),
    dateModified: data.updatedDate || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blogs/${slug}`
    },
    keywords: data.keywords || [data.categoryName].filter(Boolean),
    articleSection: data.categoryName || 'Health',
    url: `${baseUrl}/blogs/${slug}`
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogs',
        item: `${baseUrl}/blogs`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title,
        item: `${baseUrl}/blogs/${slug}`
      }
    ]
  };

  // FAQ Schema (if FAQs exist)
  let faqSchema = null;
  if (data.faqs && data.faqs.length > 0) {
    try {
      const parsedFaqs = JSON.parse(data.faqs[0]);
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: parsedFaqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };
    } catch (error) {
      console.error('Error parsing FAQs for schema:', error);
    }
  }

  return [articleSchema, breadcrumbSchema, faqSchema].filter(Boolean);
};

// Breadcrumb Component (Unchanged)
const Breadcrumb = ({ title }) => (
  <div className={styles.breadcrumb}>
    <Link href="/" className={styles.breadcrumbLink}>Home</Link>
    <span className={styles.breadcrumbSeparator}>/</span>
    <Link href="/blogs" className={styles.breadcrumbLink}>Blogs</Link>
    <span className={styles.breadcrumbSeparator}>/</span>
    <span className={styles.breadcrumbCurrent}>{title}</span>
  </div>
);

// ImageWithFallback Component (Unchanged)
const ImageWithFallback = ({ src, alt, width, height }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout="responsive"
      onError={() => setImageError(true)}
      className={styles.mainImage}
    />
  );
};

// RecentBlogCard Component (Unchanged)
const RecentBlogCard = ({ title, date }) => (
  <motion.div   
    className={styles.recentBlogCard}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <h4>{title}</h4>
    <p>{date}</p>
  </motion.div>
);

// CategoryCard Component (Unchanged)
const CategoryCard = ({ categories = [] }) => (
  <div className={styles.categoryCard}>
    <h3>Categories</h3>
    <ul>
      {categories.map((category, index) => (
        <motion.li 
          key={index}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {category}
        </motion.li>
      ))}
    </ul>
  </div>
);

// Updated ContactForm Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create form data for Freshsales
      const freshsalesData = new FormData();
      freshsalesData.append('first_name', formData.firstName);
      freshsalesData.append('last_name', formData.lastName);
      freshsalesData.append('mobile', formData.mobile);
      freshsalesData.append('email', formData.email);
      freshsalesData.append('address', formData.address);

      // Submit to Freshsales
      await fetch('https://cadabamsdiagnostics.myfreshworks.com/crm/sales/web_forms/1d0cec103ec4b3cdc7fc3db110b0b4ff58dadc2629d35e6bec3117da6dc6c94e/form.html', {
        method: 'POST',
        body: freshsalesData
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        address: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactForm}>
      <h3>Get in Touch</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="E.g. John"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="E.g. Smith"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="E.g. 17145965875"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email <span className={styles.required}>*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E.g. john.smith@acmecorp.com"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="E.g. 123 Main Street, Apt. 5"
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

// FAQSection Component (Unchanged)
const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || !faqs.length) return null;

  let parsedFaqs = [];
  try {
    parsedFaqs = JSON.parse(faqs[0]);
  } catch (error) {
    console.error('Error parsing FAQs:', error);
    return null;
  }

  return (
    <motion.div 
      className={styles.faqSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Frequently Asked Questions</h2>
      <div className={styles.faqContainer}>
        {parsedFaqs.map((faq, index) => (
          <motion.div 
            key={index}
            className={styles.faqItem}
            initial={false}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className={styles.questionText}>{faq.question}</span>
              <span className={`${styles.toggleIcon} ${openIndex === index ? styles.active : ''}`}>
                +
              </span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.faqAnswer}
                >
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Main BlogPost Component (Rest remains unchanged)
export default function BlogPost() {
  const [blogData, setBlogData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (slug) => {
    try {
      setError(null);
      setNotFound(false);
      const response = await fetch(`https://cadabamsapi.exar.ai/api/v1/cms/blog/${slug}`);
      
      if (response.status === 404) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const data = await response.json();
      
      if (!data || !data.title) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      data.content = data.content?.replace(/['"]/g, '') || '';
      setBlogData(data);
      setIsLoading(false);
      
    } catch (err) {
      if (err.message === 'Not Found' || err.message.includes('404')) {
        setNotFound(true);
      } else {
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AuthProvider>
        <Layout title="Loading Blog Post...">
          <div className={styles.loadingContainer}>
            <h2>Loading blog post...</h2>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error) {
    return (
      <AuthProvider>
        <Layout title="Error">
          <div className={styles.errorContainer}>
            <h2>Error: {error}</h2>
            <button onClick={() => fetchBlogPost(slug)}>Try Again</button>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  if (!blogData) {
    return <NotFound />;
  }

  return (
    <AuthProvider>
      <Layout title={blogData.title || 'Blog Post'}>
        <Head>
          <title>{`${blogData.title} | Cadabams Healthcare`}</title>
          <meta name="description" content={blogData.metaDescription || `Read about ${blogData.title}`} />
          <meta name="keywords" content={blogData.keywords || blogData.categoryName || 'healthcare, mental health, therapy'} />
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <link rel="canonical" href={`${baseUrl}/blogs/${slug}`} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={blogData.title} />
          <meta property="og:description" content={blogData.metaDescription || `Read about ${blogData.title}`} />
          <meta property="og:image" content={blogData.imageUrl || `${baseUrl}/default-og-image.jpg`} />
          <meta property="og:url" content={`${baseUrl}/blogs/${slug}`} />
          <meta property="og:site_name" content="Cadabams Healthcare" />
          <meta property="article:published_time" content={blogData.publishedDate || new Date().toISOString()} />
          <meta property="article:modified_time" content={blogData.updatedDate || new Date().toISOString()} />
          <meta property="article:author" content={blogData.verifiedBy || 'Cadabams Team'} />
          <meta property="article:section" content={blogData.categoryName || 'Health'} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@CadabamsGroup" />
          <meta name="twitter:title" content={blogData.title} />
          <meta name="twitter:description" content={blogData.metaDescription || `Read about ${blogData.title}`} />
          <meta name="twitter:image" content={blogData.imageUrl || `${baseUrl}/default-og-image.jpg`} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateSchemas(blogData, baseUrl, slug))
            }}
          />
        </Head>

        <div className={styles.container}>
          <Breadcrumb title={blogData.title} />
          
          <div className={styles.blogPostContainer}>
            <main className={styles.mainContent}>
              {blogData.imageUrl && (
                <ImageWithFallback
                  src={blogData.imageUrl}
                  alt={blogData.title || 'Blog post image'}
                  width={800}
                  height={400}
                />
              )}
              <h1 className={styles.blogTitle}>
                {blogData.title || 'Untitled Post'}
              </h1>
              {blogData.verifiedBy && (
                <p className={styles.blogAuthor}>
                  Verified by: {blogData.verifiedBy}
                </p>
              )}
              <div 
                className={styles.blogContent}
                dangerouslySetInnerHTML={{ __html: blogData.content || '' }}
              />
              <FAQSection faqs={blogData.faqs} />
            </main>
            
            <aside className={styles.sidebar}>
              <div className={styles.recentBlogs}>
                <h3>Recent Blogs</h3>
                <RecentBlogCard title="Sample Recent Blog" date="May 15, 2023" />
              </div>
              
              <div className={styles.categories}>
                <CategoryCard categories={[blogData.categoryName].filter(Boolean)} />
              </div>
              
              <div className={styles.contact}>
                <ContactForm />
              </div>
            </aside>
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
}
