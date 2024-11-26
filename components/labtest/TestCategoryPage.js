import React from 'react';
import Link from 'next/link';
import styles from './TestCategoryPage.module.css';

const TestCategoryPage = ({ data }) => {
  // Function definitions must come before they're used
  const createMarkup = (html) => ({ __html: html });

  const renderSection = (title, content, imageSrc) => {
    if (!content) return null;
    
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionContent}>
          <div className={imageSrc ? styles.sectionText : undefined}>
            <div 
              dangerouslySetInnerHTML={createMarkup(content)} 
              className={styles.prose} 
            />
          </div>
          {imageSrc && (
            <div className={styles.sectionImage}>
              <img src={imageSrc} alt={title} className={styles.image} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInterpretationsTable = () => {
    if (!interpretations?.rows?.length) return null;

    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{interpretations.title}</h2>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                {interpretations.cols?.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interpretations.rows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFAQs = () => {
    if (!faqs?.length) return null;

    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <div 
                dangerouslySetInnerHTML={createMarkup(faq.answer)} 
                className={styles.prose}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRelatedTests = () => {
    if (!relative_test?.tests?.length) return null;

    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Related Tests</h2>
        <div className={styles.relatedTests}>
          {relative_test.tests.map((test, index) => (
            <Link href={test.route} key={index}>
              <div className={styles.relatedTestCard}>
                <h3>{test.testName}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const {
    name,
    description,
    tests = [],
    image,
    path
  } = data;

  // Get the first test's data
  const firstTest = tests[0];
  
  // Get alldata array from the first test
  const testData = firstTest?.alldata || [];

  // Destructure the test information
  const {
    basic_info = {},
    requisites = [],
    about_test = {},
    risks_limitations = {},
    testParameters = {},
    who_need_test = {},
    benifit_taking_test = {},
    diseases_diagnosed = {},
    testPreparation = {},
    interpretations = {},
    faqs = [],
    relative_test = {},
  } = testData[0] || {};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.mainContent}>
            <h1 className={styles.title}>{name}</h1>
            <p className={styles.description}>{description}</p>
            {basic_info?.price && (
              <div className={styles.price}>
                Price: ₹{basic_info.price}
                {basic_info.discount && (
                  <span className={styles.discount}>
                    ({basic_info.discount}% off - ₹{basic_info.discountedPrice})
                  </span>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className={styles.imageContainer}>
              <img src={image} alt={name || 'Test image'} className={styles.image} />
            </div>
          )}
        </div>
      </div>

      {requisites?.[0]?.value && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Prerequisites</h2>
          <p>{requisites[0].value}</p>
        </div>
      )}

      {renderSection("About the Test", about_test?.desc, about_test?.imageSrc)}
      {renderSection("Risks & Limitations", risks_limitations?.desc, risks_limitations?.imageSrc)}
      {renderSection("Test Parameters", testParameters?.desc, testParameters?.imageSrc)}
      {renderSection("Who Needs This Test", who_need_test?.desc, who_need_test?.imageSrc)}
      {renderSection("Benefits", benifit_taking_test?.desc, benifit_taking_test?.imageSrc)}
      {renderSection("Diseases Diagnosed", diseases_diagnosed?.desc, diseases_diagnosed?.imageSrc)}
      {renderSection("Test Preparation", testPreparation?.desc, testPreparation?.imageSrc)}
      {renderInterpretationsTable()}
      {renderFAQs()}
      {renderRelatedTests()}
    </div>
  );
};

export default TestCategoryPage;