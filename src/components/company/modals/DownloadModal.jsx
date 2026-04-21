import React from 'react';
import Image from 'next/image';
import { X, FileText } from 'lucide-react';
import styles from './DownloadModal.module.css';

const DownloadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-download"
            >
              <path d="M12 15V3" />
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m7 10 5 5 5-5" />
            </svg>
          </div>
          <div className={styles.modalTitleArea}>
            <h2 className={styles.modalTitle}>Company Report Generation</h2>
            <p className={styles.modalSubTitle}>Processing Company data report</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.processingView}>
          <div className={styles.processingIcon}>
            <Image
              src="/icons/blueClock.svg"
              alt="Processing"
              width={40}
              height={40}
            />
          </div>
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
      </div>
    </div>
  );
};

export default DownloadModal;
