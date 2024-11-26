import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import styles from './BlogSection.module.css';

const staticInsights = [
  {
    _id: '1',
    title: 'Complete Blood Count Test: What Is It and Why Do You Need It',
    description: 'Learn about the complete blood count (CBC) test, one of the most common blood tests that evaluates your overall health and screens for various disorders affecting your blood.'
  },
  {
    _id: '2',
    title: 'Difference Between MRI and X-Ray',
    description: 'Understand the key differences between MRI and X-ray imaging techniques, their uses, benefits, and when doctors might recommend one over the other.'
  },
  {
    _id: '3',
    title: 'The Risk Factors That Mean You Need a Test for Liver Disease',
    description: 'Discover the important risk factors and warning signs that might indicate the need for liver function testing and early detection of liver disease.'
  },
  {
    _id: '4',
    title: 'Understanding Thyroid Stimulating Hormone (TSH) Levels',
    description: 'Everything you need to know about TSH levels, what they mean for your thyroid health, and when you should consider getting tested.'
  }
];

const BlogSection = () => {
  const generateSlug = (title) => {
    if (!title) return '';
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  return (
    <div className={styles.blogSection}>
      <h2 className={styles.sectionTitle}>Health Insights</h2>
      <p className={styles.sectionDescription}>
        Stay informed with our latest health articles and medical insights
      </p>

      <div className={styles.blogGrid}>
        {staticInsights.map((blog) => (
          <div
            key={blog._id}
            className={styles.blogCard}
          >
            <div className={styles.blogContent}>
              <h3 className={styles.blogTitle}>
                <a href={`/blogs/${generateSlug(blog.title)}`}>
                  {blog.title}
                </a>
              </h3>
              <p className={styles.excerpt}>
                {blog.description}
              </p>
              <a
                href={`/blogs/${generateSlug(blog.title)}`}
                className={styles.readMore}
              >
                Read More <FaArrowRight className={styles.arrowIcon} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.viewAllWrapper}>
        <a href="/blogs" className={styles.viewAllButton}>
          View All Articles
        </a>
      </div>
    </div>
  );
};

export default React.memo(BlogSection);