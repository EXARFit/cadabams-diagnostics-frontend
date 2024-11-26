import React from 'react';
import DOMPurify from 'dompurify';
import TestOverview from './TestOverview';
import TestDetails from './TestDetails';
import TestMeasures from './TestMeasures';
import LabStats from './LabStats';
import ScrollSpyNavigation from './ScrollSpyNavigation';
import styles from './NonLabTestPage.module.css';

export default function NonLabTestPage1({ testInfo }) {
  if (!testInfo) {
    return <div>Error: Invalid test data</div>;
  }

  const {
    about = {},
    parameters = {},
    risks = {},
    benefits = {},
    whoNeeds = {},
    diseases = {},
    preparation = {},
    interpretations = {},
    faqs = [],
    typeOfTest = {}
  } = testInfo;

  const tabs = [
    'About The Test',
    'Types of Tests',
    'List of Parameters',
    'Why This Test',
    'Benefits',
    'Risks & Limitations',
    'Diseases Diagnosed',
    'Preparing for test',
    'Test Results',
    'FAQs'
  ];

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  const SectionWithImage = ({ title, content, image, imageAlt, isReversed = false }) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent} style={{ flexDirection: isReversed ? 'row-reverse' : 'row' }}>
        <div className={styles.sectionText} dangerouslySetInnerHTML={sanitizeHTML(content)} />
        {image && <img src={image} alt={imageAlt} className={styles.sectionImage} />}
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <TestDetails basicInfo={about} />
        <LabStats />
        <ScrollSpyNavigation tabs={tabs}>
          <SectionWithImage
            title="About The Test"
            content={`<h3>${about.title || ''}</h3>${about.desc || ''}`}
            image={about.imageSrc}
            imageAlt="About the test"
          />
          
          {/* Types of Tests Section */}
          {typeOfTest && (typeOfTest.title || typeOfTest.desc) && (
            <SectionWithImage
              title="Types of Tests"
              content={`<h3>${typeOfTest.title || ''}</h3>${typeOfTest.desc || ''}`}
              image={typeOfTest.imageSrc}
              imageAlt="Types of tests"
              isReversed
            />
          )}

          <SectionWithImage
            title="List of Parameters"
            content={`<h3>${parameters.title || ''}</h3>${parameters.desc || ''}`}
            image={parameters.imageSrc}
            imageAlt="Test parameters"
            isReversed
          />

          <SectionWithImage
            title="Why This Test"
            content={`<h3>${whoNeeds.title || ''}</h3>${whoNeeds.desc || ''}`}
            image={whoNeeds.imageSrc}
            imageAlt="Who needs this test"
          />

          <SectionWithImage
            title="Benefits"
            content={`<h3>${benefits.title || ''}</h3>${benefits.desc || ''}`}
            image={benefits.imageSrc}
            imageAlt="Benefits of the test"
            isReversed
          />

          {/* Risks & Limitations Section */}
          <SectionWithImage
            title="Risks & Limitations"
            content={`<h3>${risks.title || ''}</h3>${risks.desc || ''}`}
            image={risks.imageSrc}
            imageAlt="Risks and limitations"
          />

          {/* Diseases Diagnosed Section */}
          <SectionWithImage
            title="Diseases Diagnosed"
            content={`<h3>${diseases.title || ''}</h3>${diseases.desc || ''}`}
            image={diseases.imageSrc}
            imageAlt="Diseases diagnosed"
            isReversed
          />

          <SectionWithImage
            title="Preparing for test"
            content={`<h3>${preparation.title || ''}</h3>${preparation.desc || ''}`}
            image={preparation.imageSrc}
            imageAlt="Test preparation"
          />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Test Results</h2>
            {interpretations.title && (
              <h3 className={styles.interpretationTitle}>{interpretations.title}</h3>
            )}
            {interpretations.cols?.length > 0 && interpretations.rows?.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.interpretationTable}>
                  <thead>
                    <tr>
                      {interpretations.cols.map((column, index) => (
                        <th key={`col-${index}`}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {interpretations.rows.map((row, rowIndex) => (
                      <tr key={`row-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>FAQs</h2>
            {faqs.map((item, index) => (
              <div key={`faq-${index}`} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.question}</h3>
                <div
                  className={styles.faqAnswer}
                  dangerouslySetInnerHTML={sanitizeHTML(item.answer)}
                />
              </div>
            ))}
          </div>
        </ScrollSpyNavigation>
      </div>
    </div>
  );
}