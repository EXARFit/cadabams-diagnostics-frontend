import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked'; // Import marked for markdown parsing
import TestOverview from './TestOverview';
import TestDetails from './TestDetails';
import TestMeasures from './TestMeasures';
import LabStats from './LabStats';
import ScrollSpyNavigation from './ScrollSpyNavigation';
import RelativeLinks from './Relativelinks';
import CommonSections from './CommonSections';
import styles from './TestPage.module.css';

// Configure DOMPurify to allow all the necessary tags for both markdown and HTML content
const purifyConfig = {
  ALLOWED_TAGS: [
    // Basic formatting
    'p', 'div', 'span', 'br', 'hr',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Lists
    'ul', 'ol', 'li',
    // Text formatting
    'strong', 'em', 'b', 'i', 'u', 'strike', 'del', 'code', 'pre',
    // Links and images
    'a', 'img',
    // Tables
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    // Blockquotes
    'blockquote'
  ],
  ALLOWED_ATTR: ['style', 'class', 'href', 'src', 'alt', 'title', 'target'],
  ALLOWED_STYLES: [
    'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
    'padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
    'list-style-type', 'text-indent', 'text-align', 'font-weight'
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

  // Function to check if content is in markdown format
  const isMarkdown = (text) => {
    if (!text || typeof text !== 'string') return false;
    // Check for common markdown patterns
    const markdownPatterns = [
      /^#+\s+/m,      // Headers
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

  // Function to check if content is in HTML format
  const isHTML = (text) => {
    if (!text || typeof text !== 'string') return false;
    return /<\/?[a-z][\s\S]*>/i.test(text);
  };

  // Process content based on its format
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

  // Sanitize HTML after processing content
  const sanitizeHTML = (content) => {
    if (!content) return { __html: '' };
    try {
      // Process content based on its format
      const processedContent = processContent(content);
      // Sanitize the processed content
      return { __html: DOMPurify.sanitize(processedContent, purifyConfig) };
    } catch (error) {
      console.error('Content processing error:', error);
      return { __html: '' };
    }
  };

  return (
    <div className={styles.pageContainer}>
      <style jsx global>{`
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
        
        /* Add styles for markdown rendered content */
        .content h1, .content h2, .content h3, 
        .content h4, .content h5, .content h6 {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .content h3 {
          font-size: 1.25rem;
        }
        .content h4 {
          font-size: 1.125rem;
        }
        .content p {
          margin-bottom: 1rem;
        }
        .content strong, .content b {
          font-weight: 600;
        }
        .content em, .content i {
          font-style: italic;
        }
        .content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #4b5563;
        }
        .content pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.25rem;
          overflow-x: auto;
        }
        .content code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .content a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
      <div className={styles.navbar}></div>
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
        {/* <RelativeLinks relativeTests={relativeTest} /> */}
      </div>
    </div>
  );
}