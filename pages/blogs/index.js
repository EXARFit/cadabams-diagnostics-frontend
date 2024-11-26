import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import styles from '../../styles/BlogsHomePage.module.css';

export default function BlogsHomePage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('https://cadabamsapi.exar.ai/api/v1/cms/blog/');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setBlogPosts(data);
      
      const uniqueCategories = ['All', ...new Set(data.map(post => post.categoryName))];
      setCategories(uniqueCategories);
      
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const filteredPosts = blogPosts.filter(post => 
    (activeCategory === 'All' || post.categoryName === activeCategory) &&
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const BlogImage = ({ src, alt }) => {
    if (!src) {
      return (
        <div className={styles.fallbackImage}>
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      );
    }

    return (
      <div className={styles.imageWrapper}>
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className={styles.blogImage}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <AuthProvider>
        <Layout title="Loading Blog Posts...">
          <div className={styles.loadingContainer}>
            <h2>Loading blog posts...</h2>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  if (error) {
    return (
      <AuthProvider>
        <Layout title="Error">
          <div className={styles.errorContainer}>
            <h2>Error: {error}</h2>
            <button onClick={fetchBlogPosts}>Try Again</button>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Layout title="Cadabam's Health Blog">
        <div className={styles.container}>
          <motion.div 
            className={styles.headerCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.headerContent}>
              <motion.h1 
                className={styles.title}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Cadabam's Health Blog
              </motion.h1>
              <motion.p 
                className={styles.subtitle}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Discover insights for a healthier you
              </motion.p>
            </div>
            <motion.div 
              className={styles.imageContainer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Image
                src="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png-ezgif.com-webp-to-png-converter.webp"
                alt="Cadabams Doctor"
                width={200}
                height={200}
                className={styles.doctorImage}
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className={styles.searchContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <input
              type="text"
              placeholder="Search blog posts"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>

          <motion.div 
            className={styles.categoryFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {categories.map((category, index) => (
              <motion.button 
                key={category}
                className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            className={styles.blogGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {filteredPosts.map((post, index) => (
              <Link href={`/blogs${post.route}`} key={post._id}>
                <motion.div 
                  className={styles.blogCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <BlogImage src={post.imageUrl} alt={post.title} />
                  <div className={styles.blogContent}>
                    <h3 className={styles.blogTitle}>{post.title}</h3>
                    <p className={styles.blogCategory}>{post.categoryName}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          <div className={styles.floatingBalls}>
            <motion.div
              className={`${styles.ball} ${styles.ball1}`}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={`${styles.ball} ${styles.ball2}`}
              animate={{
                y: [10, 40, 0],
                x: [0, -50, 0],
                rotate: [0, -15, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={`${styles.ball} ${styles.ball3}`}
              animate={{
                y: [0, -20, 0],
                x: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
}