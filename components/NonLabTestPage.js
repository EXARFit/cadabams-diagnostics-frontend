import React from 'react';
import DOMPurify from 'dompurify';
import TestOverview from './TestOverview1';
import TestDetails from './TestDetails';
import TestMeasures from './TestMeasures';
import LabStats from './LabStats';
import ScrollSpyNavigation from './ScrollSpyNavigation';
import styles from './NonLabTestPage.module.css';

export default function NonLabTestPage({ testData }) {
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
  const aboutTest = findData('about_test');
  const testParameter = findData('testParameters');
  const whoNeedTest = findData('who_need_test');
  const benifitTest = findData('benifit_taking_test');
  const diseasesDiagnosed = findData('diseases_diagnosed');
  const testPreparation = findData('testPreparation');
  const testInterpretation = findData('interpretations');
  const faq = findData('faqs');
  const risksLimitations = findData('risks_limitations');

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
        <TestOverview basicInfo={basicInfo} />
        <TestDetails basicInfo={basicInfo} requisite={requisite} />
        {/* <TestMeasures basicInfo={basicInfo} /> */}
        <LabStats />
        <ScrollSpyNavigation tabs={tabs}>
          <SectionWithImage
            title="About The Test"
            content={`<h3>${aboutTest.title}</h3>${aboutTest.desc}`}
            image={aboutTest.imageSrc}
            imageAlt="About the test"
          />
          <SectionWithImage
            title="List of Parameters"
            content={`<h3>${testParameter.title}</h3>${testParameter.desc}`}
            image={testParameter.imageSrc}
            imageAlt="Test parameters"
            isReversed
          />
          <SectionWithImage
            title="Why This Test"
            content={`<h3>${whoNeedTest.title}</h3>${whoNeedTest.desc}`}
            image={whoNeedTest.imageSrc}
            imageAlt="Who needs this test"
          />
          <SectionWithImage
            title="Benefits"
            content={`
              <h3>${benifitTest.title}</h3>${benifitTest.desc}
              <h3>${diseasesDiagnosed.title}</h3>${diseasesDiagnosed.desc}
            `}
            image={benifitTest.imageSrc || diseasesDiagnosed.imageSrc}
            imageAlt="Benefits of the test"
            isReversed
          />
          <SectionWithImage
            title="Preparing for test"
            content={`<h3>${testPreparation.title}</h3>${testPreparation.desc}`}
            image={testPreparation.imageSrc}
            imageAlt="Test preparation"
          />
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
      </div>
    </div>
  );
}