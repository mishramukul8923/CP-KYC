import React from 'react';
import styles from './CompanyDetails.module.css';

const CompanyDetails = ({ companyData, loading, error }) => {

  if (loading) {
    return <div className={styles.container}>Loading highlights...</div>;
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
    return (
      <div className={styles.container}>
        <p>Loading company details...</p>
      </div>
    );
  }
  const info = companyData.company_information;


  const data = [
    { label: 'CIN/LLPIN', value: info.cin ?? '-' },
    { label: 'PAN', value: (!info.pan || String(info.pan).trim() === '' || String(info.pan).trim() === '-') ? <span style={{ fontStyle: 'italic', fontWeight: 300, color: "#80858fff" }}>Download MCA document</span> : info.pan },
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
    { label: 'Market Cap.', value: info.market_cap ?? 'PDF Parsing(MCA Documents)' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Company Information</h2>
      <div className={styles.card}>
        <div className={styles.grid}>
          {data.map((item, index) => (
            <div
              key={index}
              className={`${styles.infoBox} ${item.fullWidth ? styles.fullWidth : ''}`}
            >
              <div className={styles.label}>{item.label}</div>
              <div className={styles.value}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;