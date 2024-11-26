import React from 'react';
import DOMPurify from 'dompurify';
import TestOverview from './TestOverview';
import TestDetails from './TestDetails';
import TestMeasures from './TestMeasures';
import LabStats from './LabStats';
import ScrollSpyNavigation from './ScrollSpyNavigation';
import RelativeLinks from './Relativelinks';
import CommonSections from './CommonSections';
import styles from './TestPage.module.css';

// Configure DOMPurify to allow list-related tags and styles
const purifyConfig = {
  ALLOWED_TAGS: ['ul', 'ol', 'li', 'p', 'div', 'span', 'br', 'strong', 'em', 'b', 'i'],
  ALLOWED_ATTR: ['style', 'class'],
  ALLOWED_STYLES: [
    'margin-left',
    'padding-left',
    'list-style-type',
    'text-indent'
  ]
};

export default function TestPage({ testData }) {
  if (!testData || !testData.alldata || !Array.isArray(testData.alldata)) {
    return <div>Error: Invalid test data</div>;
  }

  const alldata = testData.alldata;

  const findData = (key) => {
    const item = alldata.find(item => item[key]);
    return item ? item[key] : {};
  };

  const basicInfo = findData('basic_info');
  const requisite = findData('requisites')?.requisite ?? [];
  const testParameter = findData('testParameters');
  const testPreparation = findData('testPreparation');
  const benifitTest = findData('benifit_taking_test');
  const testInterpretation = findData('interpretations');
  const faq = findData('faqs');
  const aboutTest = findData('about_test');
  const measures = findData('measures');
  const oftenTakeTest = findData('often_take_test');
  const risksLimitations = findData('risks_limitations');
  const whoNeedTest = findData('who_need_test');
  const diseasesDiagnosed = findData('diseases_diagnosed');
  const relativeTest = findData('relative_test');

  const tabs = [
    'About The Test',
    'List of Parameters',
    'Why This Test',
    'Benefits',
    'Preparing for test',
    'Test Results',
    'FAQs'
  ];

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html, purifyConfig) };
  };

  return (
    <div className={styles.pageContainer}>
      <style>
        {`
          .content ul, .content ol {
            padding-left: 2rem;
            margin: 1rem 0;
          }
          .content ul ul, .content ol ol,
          .content ul ol, .content ol ul {
            margin: 0.5rem 0;
          }
          .content li {
            margin: 0.5rem 0;
          }
          .content ul > li {
            list-style-type: disc;
          }
          .content ul > li > ul > li {
            list-style-type: circle;
          }
          .content ul > li > ul > li > ul > li {
            list-style-type: square;
          }
          .content ol > li {
            list-style-type: decimal;
          }
          .content ol > li > ol > li {
            list-style-type: lower-alpha;
          }
          .content ol > li > ol > li > ol > li {
            list-style-type: lower-roman;
          }
        `}
      </style>
      <div className={styles.navbar}>{/* Your existing navbar content */}</div>
      <div className={`${styles.content} content`}>
        <TestOverview basicInfo={basicInfo} />
        <TestDetails basicInfo={basicInfo} requisite={requisite} />
        <LabStats />
        <ScrollSpyNavigation tabs={tabs}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>About The Test</h2>
            {aboutTest.title && (
              <h3 className={styles.descriptionTitle}>{aboutTest.title}</h3>
            )}
            {aboutTest.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(aboutTest.desc)}
              />
            )}
            {measures.title && (
              <h3 className={styles.measuresTitle}>{measures.title}</h3>
            )}
            {measures.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(measures.desc)}
              />
            )}
            {oftenTakeTest.title && (
              <h3 className={styles.oftenTakeTitle}>{oftenTakeTest.title}</h3>
            )}
            {oftenTakeTest.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(oftenTakeTest.desc)}
              />
            )}
            {risksLimitations.title && (
              <h3 className={styles.risksLimitationsTitle}>{risksLimitations.title}</h3>
            )}
            {risksLimitations.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(risksLimitations.desc)}
              />
            )}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>List of Parameters</h2>
            {testParameter.title && (
              <h3 className={styles.parameterTitle}>{testParameter.title}</h3>
            )}
            {testParameter.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(testParameter.desc)}
              />
            )}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Why This Test</h2>
            {whoNeedTest.title && (
              <h3 className={styles.whoNeedTestTitle}>{whoNeedTest.title}</h3>
            )}
            {whoNeedTest.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(whoNeedTest.desc)}
              />
            )}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Benefits</h2>
            {benifitTest.title && (
              <h3 className={styles.benefitTitle}>{benifitTest.title}</h3>
            )}
            {benifitTest.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(benifitTest.desc)}
              />
            )}
            {diseasesDiagnosed.title && (
              <h3 className={styles.diseasesDiagnosedTitle}>{diseasesDiagnosed.title}</h3>
            )}
            {diseasesDiagnosed.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(diseasesDiagnosed.desc)}
              />
            )}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Test Preparation</h2>
            {testPreparation.title && (
              <h3 className={styles.preparationTitle}>{testPreparation.title}</h3>
            )}
            {testPreparation.desc && (
              <div
                className={styles.sectionText}
                dangerouslySetInnerHTML={sanitizeHTML(testPreparation.desc)}
              />
            )}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Test Results</h2>
            {testInterpretation.title && (
              <h3 className={styles.interpretationTitle}>{testInterpretation.title}</h3>
            )}
            {testInterpretation.cols && testInterpretation.rows && (
              <div className={styles.tableWrapper}>
                <table className={styles.interpretationTable}>
                  <thead>
                    <tr>
                      {testInterpretation.cols.map((column, index) => (
                        <th key={index}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {testInterpretation.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
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
            {faq.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.question}</h3>
                <div
                  className={styles.faqAnswer}
                  dangerouslySetInnerHTML={sanitizeHTML(item.answer)}
                />
              </div>
            ))}
          </div>
        </ScrollSpyNavigation>
        <RelativeLinks relativeTests={relativeTest} />
        
      </div>
    </div>
  );
}