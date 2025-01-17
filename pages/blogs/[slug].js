import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import NotFound from '../../components/NotFound';
import styles from '../../styles/BlogPost.module.css';

// Schema Generator Function
const generateSchemas = (data, baseUrl, slug) => {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.metaDescription || `Read about ${data.title}`,
    image: data.imageUrl ? [data.imageUrl] : [],
    author: {
      '@type': 'Person',
      name: data.verifiedBy === 'Doctor A' ? 'Dr. Shreyas Cadabam' : 
            data.verifiedBy === 'Doctor B' ? 'Dr. Divya Cadabam' : 
            data.verifiedBy || 'Cadabams Team'
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

const Breadcrumb = ({ title }) => (
  <div className={styles.breadcrumb}>
    <Link href="/" className={styles.breadcrumbLink}>Home</Link>
    <span className={styles.breadcrumbSeparator}>/</span>
    <Link href="/blogs" className={styles.breadcrumbLink}>Blogs</Link>
    <span className={styles.breadcrumbSeparator}>/</span>
    <span className={styles.breadcrumbCurrent}>{title}</span>
  </div>
);

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

const RecentBlogCard = ({ title, slug }) => (
  <motion.div   
    className={styles.recentBlogCard}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <Link href={`/blogs/${slug}`}>
      <h4>{title}</h4>
    </Link>
  </motion.div>
);

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

const ContactForm = () => {
  const router = useRouter();
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
      const formDataToSend = new FormData();
      formDataToSend.append('contact[first_name]', formData.firstName);
      formDataToSend.append('contact[last_name]', formData.lastName);
      formDataToSend.append('contact[mobile_number]', formData.mobile);
      formDataToSend.append('contact[email]', formData.email);
      formDataToSend.append('contact[address]', formData.address);
      formDataToSend.append('entity_type', '2');
      formDataToSend.append('asset_key', '1d0cec103ec4b3cdc7fc3db110b0b4ff58dadc2629d35e6bec3117da6dc6c94e');
      formDataToSend.append('file_attachments_present', 'false');

      const response = await fetch('https://cadabamsdiagnostics.myfreshworks.com/crm/sales/smart_form/create_entity?file_attachments_present=false', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      setFormData({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        address: ''
      });

      router.push('/thank-you');
      
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
            placeholder="Enter your first name"
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
            placeholder="Enter your last name"
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
            placeholder="Enter your 10 digit mobile number"
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
            placeholder="Enter your email id"
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
            placeholder="Enter your address"
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

const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs?.length) return null;

  let parsedFaqs;
  try {
    parsedFaqs = JSON.parse(faqs[0]);
    if (!parsedFaqs?.length) return null;
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

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cadabamsdiagnostics.com';

  try {
    const response = await fetch(`https://cadabamsapi.exar.ai/api/v1/cms/blog/${slug}`);
    
    if (response.status === 404) {
      return { notFound: true };
    }

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    let blogData = await response.json();
    
    if (!blogData || !blogData.title) {
      return { notFound: true };
    }

    if (blogData.content) {
      try {
        if (typeof blogData.content === 'string' && 
            (blogData.content.startsWith('"') || blogData.content.startsWith("'"))) {
          blogData.content = JSON.parse(blogData.content);
        }
      } catch (e) {
        console.error('Error parsing content JSON:', e);
      }

      blogData.content = blogData.content
        .replace(/^["']+|["']+$/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t');

      blogData.content = blogData.content.replace(
        /<a\s+href=\\*"([^"]+)"([^>]*)>/g,
        (match, url, attrs) => {
          const cleanUrl = url.replace(/\\/g, '');
          const hasTarget = attrs.includes('target=');
          const hasRel = attrs.includes('rel=');
          
          let newAttrs = attrs;
          if (!hasTarget) newAttrs += ' target="_blank"';
          if (!hasRel) newAttrs += ' rel="noopener noreferrer"';
          
          return `<a href="${cleanUrl}"${newAttrs}>`;
        }
      );

      blogData.content = blogData.content
        .replace(/&quot;/g, '"')
        .replace(/&#34;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'");
    }

    if (blogData.faqs && blogData.faqs.length > 0) {
      try {
        let faqs = blogData.faqs[0];
        
        if (typeof faqs === 'string') {
          faqs = faqs.replace(/^["']+|["']+$/g, '');
          const parsedFaqs = JSON.parse(faqs);
          blogData.faqs = [JSON.stringify(parsedFaqs)];
        }
      } catch (error) {
        console.error('Error processing FAQs:', error);
        blogData.faqs = [];
      }
    }

    return {
      props: {
        blogData,
        baseUrl,
        slug
      }
    };

  } catch (error) {
    console.error('Server-side error:', error);
    return { notFound: true };
  }
}

const getDoctorName = (verifiedBy) => {
  if (verifiedBy === 'Doctor A') return 'Dr. Shreyas Cadabam';
  if (verifiedBy === 'Doctor B') return 'Dr. Divya Cadabam';
  return verifiedBy;
};

export default function BlogPost({ blogData, baseUrl, slug }) {
  const router = useRouter();

  if (!blogData) {
    return <NotFound />;
  }

  return (
    <AuthProvider>
      <Layout title={blogData.title || 'Blog Post'}>
        <Head>
          <title>{`${blogData.title} | Cadabams Diagnostics`}</title>
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
          <meta property="og:site_name" content="Cadabams Diagnostics" />
          <meta property="article:published_time" content={blogData.publishedDate || new Date().toISOString()} />
          <meta property="article:modified_time" content={blogData.updatedDate || new Date().toISOString()} />
          <meta property="article:author" content={getDoctorName(blogData.verifiedBy) || 'Cadabams Team'} />
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
                  Verified by: {getDoctorName(blogData.verifiedBy)}
                </p>
              )}
              <div 
                className={styles.blogContent}
                dangerouslySetInnerHTML={{ __html: blogData.content || '' }}
              />
              {blogData.faqs && blogData.faqs.length > 0 && (
                <FAQSection faqs={blogData.faqs} />
              )}
            </main>
            
            <aside className={styles.sidebar}>
              <div className={styles.recentBlogs}>
                <h3>Recent Blogs</h3>
                <RecentBlogCard 
                  title="Difference Between PET Scans and CT Scans"
                  slug="difference-between-pet-scans-and-ct-scans"
                />
                <RecentBlogCard 
                  title="Difference Between ECG Test and Echo Test"
                  slug="difference-between-ecg-test-and-echo-test"
                />
                <RecentBlogCard 
                  title="Difference Between Ultrasound and CT Scan"
                  slug="difference-between-ultrasound-and-ct-scan"
                />
                <RecentBlogCard 
                  title="Understanding Thyroid Stimulating Hormone (TSH) Levels"
                  slug="understanding-thyroid-stimulating-hormone-tsh-levels"
                />
                <RecentBlogCard 
                  title="Understanding Anomaly Scan During Pregnancy"
                  slug="understanding-anomaly-scan-during-pregnancy"
                />
                <RecentBlogCard 
                  title="Understanding Fetal Doppler Scans"
                  slug="understanding-fetal-doppler-scans"
                />
                <RecentBlogCard 
                  title="Understanding Nuchal Translucency Scan During Pregnancy"
                  slug="understanding-nuchal-translucency-scan-during-pregnancy"
                />
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