import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked'; // Import marked for markdown parsing
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
  console.log('Test Data:', alldata);

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

  const isMarkdown = (text) => {
    if (!text || typeof text !== 'string') return false;
    // Check for common markdown patterns
    const markdownPatterns = [
      /^#\s+/m,      // Headers
      /\*\*.*?\*\*/,  // Bold
      /\*.*?\*/,      // Italic
      /\[.*?\]\(.*?\)/, // Links
      /^\s*[\*\-\+]\s+/m, // Unordered lists
      /^\s*\d+\.\s+/m, // Ordered lists
      /^\s*```/m,    // Code blocks
      /^\s*>/m,      // Blockquotes
    ];
    return markdownPatterns.some(pattern => pattern.test(text));
  };

  const isHTML = (text) => {
    if (!text || typeof text !== 'string') return false;
    return /<\/?[a-z][\s\S]*>/i.test(text);
  };

  const processContent = (content) => {
    if (!content || typeof content !== 'string') return '';
    
    // If content is already HTML, return it as is
    if (isHTML(content)) {
      return content;
    }
    
    // If content is in markdown format, convert it to HTML
    if (isMarkdown(content)) {
      return marked.parse(content);
    }
    
    // If it's plain text, return it as is
    return content;
  };

  const sanitizeHTML = (html) => {
    if (!html || typeof html !== 'string') return { __html: '' };
    try {
      const processedContent = processContent(html);
      return { __html: DOMPurify.sanitize(processedContent || '') };
    } catch (error) {
      console.error('Sanitization error:', error);
      return { __html: '' };
    }
  };

  // Helper function to process and combine content sections
  const processCombinedContent = (sections) => {
    let combinedHTML = '';
    
    sections.forEach(section => {
      if (section.title) {
        combinedHTML += `<h3>${section.title}</h3>`;
      }
      if (section.desc) {
        // Process each description separately to handle markdown properly
        const processedDesc = processContent(section.desc);
        combinedHTML += processedDesc;
      }
    });
    
    return combinedHTML;
  };

  const SectionWithImage = ({ title, content, image, imageAlt, isReversed = false }) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent} style={{ flexDirection: isReversed ? 'row-reverse' : 'row' }}>
        <div className={styles.sectionText} dangerouslySetInnerHTML={sanitizeHTML(content)} />
        {image && <img src={image} alt={imageAlt || title} className={styles.sectionImage} />}
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <TestOverview basicInfo={basicInfo} />
        <TestDetails basicInfo={basicInfo} requisite={requisite} />
        <LabStats />
        <ScrollSpyNavigation tabs={tabs}>
          <SectionWithImage
            title="About The Test"
            content={aboutTest.desc || ''}
            image={aboutTest.imageSrc}
            imageAlt="About the test"
          />
          <SectionWithImage
            title="List of Parameters"
            content={testParameter.desc || ''}
            image={testParameter.imageSrc}
            imageAlt="Test parameters"
            isReversed
          />
          <SectionWithImage
            title="Why This Test"
            content={whoNeedTest.desc || ''}
            image={whoNeedTest.imageSrc}
            imageAlt="Who needs this test"
          />
          <SectionWithImage
            title="Benefits"
            content={processCombinedContent([
              { title: benifitTest.title, desc: benifitTest.desc },
              { title: diseasesDiagnosed.title, desc: diseasesDiagnosed.desc }
            ])}
            image={benifitTest.imageSrc || diseasesDiagnosed.imageSrc}
            imageAlt="Benefits of the test"
            isReversed
          />
          <SectionWithImage
            title="Preparing for test"
            content={testPreparation.desc || ''}
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
            {Array.isArray(faq) && faq.map((item, index) => (
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
