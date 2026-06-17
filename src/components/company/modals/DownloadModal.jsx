import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './DownloadModal.module.css';

const SECTIONS = [
  { key: 'companyDetails', label: 'Company Details' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'directorsKmp', label: 'Directors & KMP Details' },
  { key: 'controlOwnership', label: 'Control & Ownership' },
  { key: 'financials', label: 'Financials' },
  { key: 'charges', label: 'Charges' },
  { key: 'peerComparison', label: 'Peer Comparison' },
  { key: 'relatedCorporates', label: 'Related Companies' },
  { key: 'complianceDetails', label: 'Compliance Details' },
  { key: 'litigation', label: 'Litigation' },
];

const DownloadModal = ({ isOpen, onClose, isGenerating, onExport }) => {
  const [selectedSections, setSelectedSections] = useState({
    companyDetails: true,
    alerts: false,
    directorsKmp: false,
    controlOwnership: false,
    financials: false,
    charges: false,
    peerComparison: false,
    relatedCorporates: false,
    complianceDetails: false,
    litigation: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset selected sections when opening selection modal
      if (!isGenerating) {
        setSelectedSections({
          companyDetails: true,
          alerts: false,
          directorsKmp: false,
          controlOwnership: false,
          financials: false,
          charges: false,
          peerComparison: false,
          relatedCorporates: false,
          complianceDetails: false,
          litigation: false,
        });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isGenerating]);

  if (!isOpen) return null;

  const handleToggle = (key) => {
    if (key === 'companyDetails') return; // Company Details is always true and cannot be toggled
    setSelectedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAll = () => {
    const updated = {};
    SECTIONS.forEach((s) => {
      updated[s.key] = true;
    });
    setSelectedSections(updated);
  };

  const handleClearAll = () => {
    const updated = {};
    SECTIONS.forEach((s) => {
      updated[s.key] = s.key === 'companyDetails'; // Keep companyDetails true, others false
    });
    setSelectedSections(updated);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(selectedSections);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleArea}>
            <h2 className={styles.modalTitle}>
              {isGenerating ? "Company Report Generation" : "Download Report"}
            </h2>
            {isGenerating && (
              <p className={styles.modalSubTitle}>
                Processing Company data report
              </p>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        {isGenerating ? (
          <div className={styles.processingView}>
            <h3 className={styles.processingTitle}>
              Generating Report...
            </h3>
            <p className={styles.processingSubtitle}>
              Company profile report is being generated.
              This might take a few minutes. Please do not close this page.
            </p>
            <div className={styles.loadingDots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
          </div>
        ) : (
          <div className={styles.selectionView}>
            {/* SUBTITLE */}
            <p className={styles.selectionSubtitle}>
              Select sections to include in your report
            </p>
            <div className={styles.subtitleDivider}></div>

            {/* ACTION LINKS */}
            <div className={styles.actionLinks}>
              <button className={styles.linkBtn} onClick={handleSelectAll}>
                Select All
              </button>
              <span className={styles.linkDivider}></span>
              <button className={styles.linkBtn} onClick={handleClearAll}>
                Clear All
              </button>
            </div>

            {/* SECTIONS GRID */}
            <div className={styles.sectionsGrid}>
              {SECTIONS.map((section) => {
                const isChecked = selectedSections[section.key];
                const isLocked = section.key === 'companyDetails';
                return (
                  <label key={section.key} className={`${styles.checkboxContainer} ${isLocked ? styles.lockedCheckbox : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isLocked}
                      onChange={() => handleToggle(section.key)}
                      className={styles.hiddenCheckbox}
                    />
                    <span className={`${styles.customCheckbox} ${isChecked ? styles.checked : ''} ${isLocked ? styles.lockedCheckboxBox : ''}`}>
                      {isChecked && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.checkmarkIcon}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className={styles.checkboxLabel}>{section.label}</span>
                  </label>
                );
              })}
            </div>

            {/* EXPORT BUTTON */}
            <div className={styles.footer}>
              <button className={styles.exportBtn} onClick={handleExport}>
                Export Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;
