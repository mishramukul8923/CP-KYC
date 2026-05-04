'use client';

import { useState } from 'react';
import styles from './SubsidiaryAccordion.module.css';

const subsidiaries = [
  // { id: 1, name: "Dabur International Ltd", location: "UAE", ownership: "100%" },
  // { id: 2, name: "Dabur Egypt Ltd", location: "UAE", ownership: "100%" },
  // { id: 3, name: "Dabur Nepal Pvt Ltd", location: "Nepal", ownership: "95.04%" },
  // { id: 4, name: "Asian Consumer Care Pvt Ltd", location: "India", ownership: "100%" },
  // { id: 5, name: "H&B Stores Ltd", location: "India", ownership: "100%" },
  // { id: 6, name: "Dabur Consumer Care Pvt Ltd", location: "India", ownership: "100%" },
  // { id: 7, name: "Dabur Ayurvet Ltd", location: "India", ownership: "62.77%" },
  // { id: 8, name: "Namaste Laboratories LLC", location: "USA", ownership: "100%" },
  // { id: 9, name: "Dermoviva Skin Essentials Inc", location: "USA", ownership: "100%" },
  // { id: 10, name: "Dabur Lanka Pvt Ltd", location: "Sri Lanka", ownership: "100%" }
];

export default function SubsidiaryAccordion({ groupStructureData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const parent = groupStructureData?.parent_company;
  const rawEntities = groupStructureData?.group_entities;
  const entities = Array.isArray(rawEntities) ? rawEntities : [];

  const isEntitiesEmpty = entities.length === 1 && Object.entries(entities[0]).every(([key, value]) => {
    if (key === 'ownership_type') return true;
    return !value || value === '-';
  });

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.container}>
      <div className={styles.accordionWrapper}>
        {/* Parent Header */}
        <div className={styles.parentHeader} onClick={toggleAccordion}>
          <div className={styles.parentInfo}>
            <div className={styles.parentLogo}>
              <img
                src="/icons/Image.svg"
                alt="logo"
                className={styles.parentLogoImg}
              />
            </div>
            <div className={styles.parentText}>
              <h2 className={styles.parentTitle}>{parent?.company_name || "-"}</h2>
              <span className={styles.parentSubtitle}>{parent?.company_role || "Parent Company"}</span>
            </div>
          </div>
          <div className={styles.parentControls}>
            <span className={styles.subsidiaryCount}>
              {parent?.total_subsidiaries || entities.length} Subsidiaries
            </span>
            <img
              src="/icons/chevron-down-dark.svg"
              alt="Toggle"
              className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
            />
          </div>
        </div>

        {/* Expandable Content */}
        <div className={`${styles.contentWrapper} ${isExpanded ? styles.contentWrapperExpanded : ''}`}>
          <div className={styles.subsidiaryList}>
            {entities.map((item, index) => (
              <div key={index} className={styles.subsidiaryItem}>
                <div className={styles.itemLeft}>
                  <div className={styles.itemIcon}>
                    <img src="/icons/building-icon.svg" alt="Building" className={styles.iconImg} />
                  </div>
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.subsidiary_name || "-"}</p>
                    <p className={styles.itemLocation}>{item.country || "-"}</p>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.ownershipInfo}>
                    <span className={styles.ownershipValue}>
                      {item.ownership_percentage && item.ownership_percentage !== "-" ? `${item.ownership_percentage}` : "-"}
                    </span>
                    <span className={styles.ownershipLabel}>{item.ownership_type || "Ownership"}</span>
                  </div>
                  <div className={styles.statusBadge}>{item.status || "Active"}</div>
                </div>
              </div>
            ))}
            {entities.length === 0 && (
              <div className={styles.emptyState}>No group entities found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}