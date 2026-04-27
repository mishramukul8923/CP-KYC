import React from 'react';
import styles from './CompanyDetails.module.css';
import { useCompanySection } from "@/components/company/context/CompanySectionContext";

const CompanyDetails = ({ companyData, loading, error }) => {
  const { setActiveSection } = useCompanySection();

  if (loading || !companyData) {
    return (
      <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={styles.card}>
          <div className={styles.grid}>
            {[...Array(12)].map((_, index) => (
              <div key={index} className={styles.infoBox}>
                <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
                <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red", fontWeight: 500 }}>
          {error}
        </div>
      </div>
    );
  }

  if (!companyData || !companyData.company_information) {
    return null;
  }
  const info = companyData.company_information;


  const data = [
    { label: 'CIN/LLPIN', value: info.cin ?? '-' },
    { 
      label: 'PAN', 
      value: info.pan ?? '-',
      isProtected: !info.pan || String(info.pan).trim() === '' || String(info.pan).trim() === '-',
      protectedText: "Pan not available. Need MCA document"
    },
    { label: 'LEI Number', value: info.lei_number ?? '-' },
    { label: 'Company Legal Name', value: info.legal_name ?? '-' },
    { label: 'ROC Code', value: info.roc_code ?? '-' },
    { label: 'Company No', value: info.company_no ?? '-' },
    { label: 'Company Classication', value: info.classification ?? '-' },
    { label: 'Authorised Capital', value: info.authorised_capital ?? '-' },
    { label: 'Active Compliance', value: info.active_compliance ?? '-' },
    { label: 'Paid up Capital', value: info.paid_up_capital ?? '-' },
    { label: 'Incorporation Date', value: info.incorporation_date ?? '-' },
    { label: 'Date of AGM', value: info.date_of_agm ?? '-' },
    { label: 'Date of Balance Sheet', value: info.date_of_balance_sheet ?? '-' },
    { label: 'Listing Status', value: info.listing_status ?? '-' },
    { label: 'Stock Symbol', value: info.stock_symbol ?? '-' },
    { label: 'Industry', value: info.industry ?? '-' },
    { label: 'Segment', value: info.segment ?? '-' },
    { 
      label: 'Market Capitalization (Cr)', 
      value: info.market_cap ?? 'PDF Parsing(MCA Documents)',
      isProtected: !info.market_cap || info.market_cap === 'PDF Parsing(MCA Documents)',
      protectedText: "Need MCA Docs"
    },
  ];

  const handleDocClick = () => {
    setActiveSection("documents");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Company Information </h2>
      <div className={styles.card}>
        <div className={styles.grid}>
          {data.map((item, index) => (
            <div
              key={index}
              className={`${styles.infoBox} ${item.isProtected ? styles.infoBoxWithLock : ''} ${item.fullWidth ? styles.fullWidth : ''}`}
            >
              <div className={styles.label}>{item.label}</div>
              
              {item.isProtected ? (
                <div style={{ position: 'relative' }}>
                  <div className={styles.blurValue}>{item.value}</div>
                  <div className={styles.overlayText} onClick={handleDocClick} style={{ cursor: 'pointer' }}>
                    <span>{item.protectedText}</span>
                    <div className={styles.lockIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.value}>{item.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;