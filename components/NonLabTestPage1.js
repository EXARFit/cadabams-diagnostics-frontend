// components/NonLabTestPage1.js
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import DOMPurify from 'isomorphic-dompurify';
import TestOverview from './TestOverview';
import TestDetails from './TestDetails';
import TestMeasures from './TestMeasures';
import LabStats from './LabStats';
import ScrollSpyNavigation from './ScrollSpyNavigation';
import styles from './NonLabTestPage.module.css';

const useLocation = () => {
  const router = useRouter();
  
  const getLocationFromPath = (path) => {
    if (!path) return { name: 'near me', value: 'near-me' };
    
    const parts = path.split('/').filter(Boolean);
    
    // If path includes bangalore as the first part
    if (parts[0] === 'bangalore') {
      return { name: 'Bangalore', value: 'bangalore' };
    }
    
    return { name: 'near me', value: 'near-me' };
  };

  const currentLocation = getLocationFromPath(router.asPath);

  const getLocationAwareContent = (content) => {
    if (!content) return '';
    
    let updatedContent = content;
    updatedContent = updatedContent.replace(/\{Location\}/g, currentLocation.name);
    
    if (currentLocation.value === 'near-me') {
      updatedContent = updatedContent.replace(/Bangalore/g, 'near me');
    } else if (currentLocation.value !== 'bangalore') {
      updatedContent = updatedContent.replace(/Bangalore/g, currentLocation.name);
    }
    
    return updatedContent;
  };

  return {
    currentLocation,
    getLocationAwareContent
  };
};

const getCategoryFromPath = (path) => {
  const parts = path.split('/');
  const categoryPart = parts[parts.length - 1];
  const categoryMap = {
    'mri-scan': 'MRI',
    'ct-scan': 'CT',
    'xray-scan': 'X-ray',
    'ultrasound-scan': 'Ultrasound',
    'msk-scan': 'MSK'
  };
  return categoryMap[categoryPart] || '';
};

export default function NonLabTestPage1({ testInfo }) {
  const router = useRouter();
  const { currentLocation, getLocationAwareContent: locationContent } = useLocation();
  const category = getCategoryFromPath(router.asPath);

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
    if (!html) return { __html: '' };
    return { __html: DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
    })};
  };

  const getSectionTitle = (content, sectionType) => {
    const locationText = currentLocation.value === 'near-me' 
      ? 'near me' 
      : `in ${currentLocation.name}`;
    
    switch (sectionType) {
      case 'types':
        return `Types of ${category} Tests ${locationText}`;
      case 'parameters':
        return `List of Parameters Considered During the ${category} Scan ${locationText}`;
      case 'benefits':
        return `Benefits of Taking the ${category} Tests ${locationText}`;
      case 'preparing':
        return `Preparing for ${category} Scan ${locationText}`;
      case 'risks':
        return `Risks & Limitations of the ${category} Test ${locationText}`;
      default:
        return content;
    }
  };

  const getLocationAwareContent = (content, sectionType) => {
    if (!content) return '';
    
    let modifiedContent = content;
    const h3Match = content.match(/<h3>(.*?)<\/h3>/);
    const newTitle = getSectionTitle('', sectionType);
    
    if (h3Match) {
      modifiedContent = content.replace(h3Match[0], `<h3>${newTitle}</h3>`);
    } else {
      modifiedContent = `<h3>${newTitle}</h3>${content}`;
    }
    
    // Replace location references
    if (currentLocation.value === 'near-me') {
      modifiedContent = modifiedContent.replace(/Bangalore/g, 'near me');
    } else if (currentLocation.value !== 'bangalore') {
      modifiedContent = modifiedContent.replace(/Bangalore/g, currentLocation.name);
    }
    
    return modifiedContent;
  };

  const SectionWithImage = ({ title, content, image, imageAlt, isReversed = false, sectionType = '' }) => {
    const unchangedTitles = [
      'About The Test',
      'Types of Tests',
      'List of Parameters',
      'Why This Test',
      'Benefits',
      'Risks & Limitations',
      'Diseases Diagnosed',
      'Preparing for test',
      'Test Results'
    ];

    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionContent} style={{ flexDirection: isReversed ? 'row-reverse' : 'row' }}>
          <div 
            className={styles.sectionText} 
            dangerouslySetInnerHTML={sanitizeHTML(
              unchangedTitles.includes(title)
                ? getLocationAwareContent(content, sectionType)
                : content
            )} 
          />
          {image && <img src={image} alt={imageAlt} className={styles.sectionImage} />}
        </div>
      </div>
    );
  };

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
          
          {typeOfTest && (typeOfTest.title || typeOfTest.desc) && (
            <SectionWithImage
              title="Types of Tests"
              content={`${typeOfTest.desc || ''}`}
              image={typeOfTest.imageSrc}
              imageAlt="Types of tests"
              isReversed
              sectionType="types"
            />
          )}

          <SectionWithImage
            title="List of Parameters"
            content={`${parameters.desc || ''}`}
            image={parameters.imageSrc}
            imageAlt="Test parameters"
            isReversed
            sectionType="parameters"
          />

          <SectionWithImage
            title="Why This Test"
            content={`<h3>${whoNeeds.title || ''}</h3>${whoNeeds.desc || ''}`}
            image={whoNeeds.imageSrc}
            imageAlt="Who needs this test"
          />

          <SectionWithImage
            title="Benefits"
            content={`${benefits.desc || ''}`}
            image={benefits.imageSrc}
            imageAlt="Benefits of the test"
            isReversed
            sectionType="benefits"
          />

          <SectionWithImage
            title="Risks & Limitations"
            content={`${risks.desc || ''}`}
            image={risks.imageSrc}
            imageAlt="Risks and limitations"
            sectionType="risks"
          />

          <SectionWithImage
            title="Diseases Diagnosed"
            content={`<h3>${diseases.title || ''}</h3>${diseases.desc || ''}`}
            image={diseases.imageSrc}
            imageAlt="Diseases diagnosed"
            isReversed
          />

          <SectionWithImage
            title="Preparing for test"
            content={`${preparation.desc || ''}`}
            image={preparation.imageSrc}
            imageAlt="Test preparation"
            sectionType="preparing"
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
            <h2 className={styles.sectionTitle}>FAQ's</h2>
            {faqs.map((item, index) => {
              const questionContent = currentLocation.value === 'near-me' 
                ? item.question.replace(/Bangalore/g, 'near me')
                : item.question.replace(/Bangalore/g, currentLocation.name);
              
              const answerContent = currentLocation.value === 'near-me'
                ? item.answer.replace(/Bangalore/g, 'near me')
                : item.answer.replace(/Bangalore/g, currentLocation.name);

              return (
                <div key={`faq-${index}`} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{questionContent}</h3>
                  <div
                    className={styles.faqAnswer}
                    dangerouslySetInnerHTML={sanitizeHTML(answerContent)}
                  />
                </div>
              );
            })}
          </div>
        </ScrollSpyNavigation>
      </div>
    </div>
  );
}