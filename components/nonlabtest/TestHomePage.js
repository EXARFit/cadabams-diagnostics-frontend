import React from 'react';
import { ChevronRight, Clock, FileText, AlertCircle, CheckCircle, HeartPulse, Bookmark, Settings, Users } from 'lucide-react';
import styles from './TestHomePage.module.css';

const TestHomePage = ({ testData }) => {
  if (!testData?.alldata) return null;

  const {
    basic_info,
    about_test,
    risks_limitations,
    testParameters,
    who_need_test,
    benifit_taking_test,
    diseases_diagnosed,
    testPreparation,
    interpretations,
    faqs,
    relative_test
  } = testData.alldata[0];

  const renderHtmlContent = (content) => {
    return { __html: content };
  };

  const InfoCard = ({ title, children, icon: Icon }) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {Icon && <Icon size={20} />}
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Basic Info Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>{basic_info?.name}</h1>
        <div className={styles.basicInfo}>
          <div className={styles.infoItem}>
            <Clock size={20} />
            <span>Reports within: {basic_info?.reportsWithin}</span>
          </div>
          <div className={styles.infoItem}>
            <FileText size={20} />
            <span>Price: ₹{basic_info?.price}</span>
          </div>
          <div className={styles.infoItem}>
            <CheckCircle size={20} />
            <span>Discount: {basic_info?.discount}%</span>
          </div>
        </div>
      </div>

      {/* About Test Section */}
      {about_test && (
        <InfoCard title={about_test.title || "About Test"} icon={HeartPulse}>
          <div className={styles.flexContainer}>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={renderHtmlContent(about_test.desc)} />
            </div>
            {about_test.imageSrc && (
              <div className={styles.image}>
                <img src={about_test.imageSrc} alt="About Test" />
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Test Parameters Section */}
      {testParameters && (
        <InfoCard title={testParameters.title} icon={Settings}>
          <div className={styles.flexContainer}>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={renderHtmlContent(testParameters.desc)} />
            </div>
            {testParameters.imageSrc && (
              <div className={styles.image}>
                <img src={testParameters.imageSrc} alt="Test Parameters" />
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Who Needs Test Section */}
      {who_need_test && (
        <InfoCard title={who_need_test.title} icon={Users}>
          <div className={styles.flexContainer}>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={renderHtmlContent(who_need_test.desc)} />
            </div>
            {who_need_test.imageSrc && (
              <div className={styles.image}>
                <img src={who_need_test.imageSrc} alt="Who Needs Test" />
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Benefits Section */}
      {benifit_taking_test && (
        <InfoCard title={benifit_taking_test.title} icon={CheckCircle}>
          <div className={styles.flexContainer}>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={renderHtmlContent(benifit_taking_test.desc)} />
            </div>
            {benifit_taking_test.imageSrc && (
              <div className={styles.image}>
                <img src={benifit_taking_test.imageSrc} alt="Benefits" />
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Diseases Diagnosed Section */}
      {diseases_diagnosed && (
        <InfoCard title={diseases_diagnosed.title} icon={AlertCircle}>
          <div className={styles.flexContainer}>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={renderHtmlContent(diseases_diagnosed.desc)} />
            </div>
            {diseases_diagnosed.imageSrc && (
              <div className={styles.image}>
                <img src={diseases_diagnosed.imageSrc} alt="Diseases Diagnosed" />
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Test Preparation Section */}
      {testPreparation && (
        <InfoCard title={testPreparation.title} icon={Bookmark}>
          <div className={styles.flexContainer}>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={renderHtmlContent(testPreparation.desc)} />
            </div>
            {testPreparation.imageSrc && (
              <div className={styles.image}>
                <img src={testPreparation.imageSrc} alt="Test Preparation" />
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Interpretations Section */}
      {interpretations && interpretations.rows?.length > 0 && (
        <InfoCard title={interpretations.title} icon={FileText}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {interpretations.cols.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interpretations.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfoCard>
      )}

      {/* FAQs Section */}
      {faqs && faqs.length > 0 && (
        <InfoCard title="Frequently Asked Questions">
          <div>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                <div
                  className={styles.faqAnswer}
                  dangerouslySetInnerHTML={renderHtmlContent(faq.answer)}
                />
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {/* Relative Tests Section */}
      {relative_test?.tests?.length > 0 && (
        <InfoCard title="Related Tests" icon={ChevronRight}>
          <div className={styles.relatedTests}>
            {relative_test.tests.map((testId, index) => (
              <div key={index} className={styles.relatedTestCard}>
                <h3 className={styles.cardTitle}>Related Test {index + 1}</h3>
                <p>Test ID: {testId}</p>
              </div>
            ))}
          </div>
        </InfoCard>
      )}
    </div>
  );
};

export default TestHomePage;