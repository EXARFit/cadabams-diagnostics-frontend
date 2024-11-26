import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import styles from './Breadcrumb.module.css';

const Breadcrumb = ({ location, city }) => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: city, href: `/${city.toLowerCase()}` },
    { label: location, href: `/${city.toLowerCase()}/${location.toLowerCase()}` }
  ];

  return (
    <nav 
      className={styles.breadcrumb} 
      aria-label="breadcrumb"
    >
      <ol className={styles.breadcrumbList}>
        {breadcrumbItems.map((item, index) => (
          <li 
            key={index} 
            className={styles.breadcrumbItem}
            itemScope
            itemType="http://schema.org/ListItem"
          >
            {index < breadcrumbItems.length - 1 ? (
              <>
                <Link 
                  href={item.href} 
                  className={styles.breadcrumbLink}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
                <meta itemProp="position" content={String(index + 1)} />
                <FaChevronRight className={styles.separator} aria-hidden="true" />
              </>
            ) : (
              <>
                <span 
                  className={styles.currentPage}
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
                <meta itemProp="position" content={String(index + 1)} />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  location: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired
};

export default React.memo(Breadcrumb);