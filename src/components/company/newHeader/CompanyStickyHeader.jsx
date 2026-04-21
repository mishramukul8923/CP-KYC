"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./CompanyStickyHeader.module.css";
import { useRouter } from "next/navigation";
import { useCompanySection } from "../context/CompanySectionContext";
import DownloadModal from "../modals/DownloadModal";


export default function CompanyStickyHeader({ visible, companyData }) {
  const { isVersionHistoryOpen, setVersionHistoryOpen, alertsData, isGeneratingPdf, setPdfDownloadTrigger } = useCompanySection() || {};
  const actionsRef = useRef(null);
  const router = useRouter();

  const [actionsOpen, setActionsOpen] = useState(false);
  const [actionsDirection, setActionsDirection] = useState("down");

  const slug = companyData?.company_information?.legal_name
    ?.toLowerCase()
    .replaceAll(" ", "-");

  const toggleActions = () => {
    if (!actionsRef.current) return;

    const rect = actionsRef.current.getBoundingClientRect();
    const dropdownHeight = 160;
    const spaceBelow = window.innerHeight - rect.bottom;

    setActionsDirection(spaceBelow > dropdownHeight ? "down" : "up");
    setActionsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!actionsRef.current?.contains(e.target)) {
        setActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getTruncatedText = (text, limit = 30) => {
    if (!text) return { display: "-", full: "-" };

    return {
      display: text.length > limit ? text.slice(0, limit) + ".." : text,
      full: text
    };
  };

  const companyName = getTruncatedText(companyData?.company_information?.legal_name, 12);

  const nseSymbol = companyData?.company_information?.nse_symbol;
  const bseSymbol = companyData?.company_information?.bse_symbol;
  const hasNse = nseSymbol && nseSymbol !== "-";
  const hasBse = bseSymbol && bseSymbol !== "-";

  let listingText = "-";
  if (hasNse && hasBse) listingText = "NSE & BSE";
  else if (hasNse) listingText = "NSE";
  else if (hasBse) listingText = "BSE";


  return (
    <header
      className={`${styles.stickyHeader} ${visible ? styles.visible : styles.hidden} ${isVersionHistoryOpen ? styles.withSidebar : ""}`}
    >
      <div className={styles.inner}>
        {/* CENTER */}
        <div className={styles.contentSection}>
          <div className={styles.titleRow}>
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.logo}>
                <img src="/icons/Image.svg" alt={companyData?.company_information?.legal_name + "logo"} />
              </div>
            </div>
            <h1 className={styles.companyName} title={companyName?.full}>{companyName?.display}</h1>

            <div className={styles.statsContainer}>

              <div className={styles.statItem}>
                <span className={styles.cinBadge}>{companyData?.company_information?.industry || "-"}</span>
              </div>

              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                {listingText !== "-" ? (
                  <span className={styles.scoreBadgeGreen}>
                    <img
                      src="/icons/greencheck.svg"
                      alt="check"
                      className={styles.arrowDownGreen}
                    />
                    {listingText}
                  </span>
                ) : (
                  <span className={styles.cinBadge}>-</span>
                )}
              </div>

              <div className={styles.divider}></div>
              <div className={styles.infoMetaItem}>
                <span>Founded {companyData?.company_information?.incorporation_date ? companyData?.company_information?.incorporation_date?.split("/")[2] : "-"}</span>
              </div>

              <div className={styles.divider}></div>
              <div className={styles.infoMetaItem}>
                <span>{companyData?.company_information?.classification || "-"}</span>
              </div>


            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.actionSection}>
          <div className={styles.buttonGroup}>
            <button
              className={styles.saveButton}
              onClick={() => setVersionHistoryOpen(true)}
            >
              <img
                src="/version.svg"
                alt=""
                className={styles.buttonIcon}
                style={{ width: '18px', height: '18px' }}
              />
              Version History
            </button>

            <button className={`${styles.saveButton} ${isVersionHistoryOpen ? styles.hideOn1200 : ""}`} onClick={() => { window.location.reload(); }}>
              <img
                src="/icons/refresh.svg"
                alt=""
                className={styles.buttonIcon}
              />
              Refresh Company
            </button>

            <button className={`${styles.saveButton} ${isVersionHistoryOpen ? styles.hideOn1750 : ""}`}>
              <img
                src="/icons/bookmark.svg"
                alt=""
                className={styles.buttonIcon}
              />
              Save
            </button>

            <div ref={actionsRef} className={styles.actionsWrapper}>
              <button className={styles.actionsButton} onClick={toggleActions}>
                Actions
                <img
                  src="/icons/chevron-down.svg"
                  alt=""
                  className={`${styles.chevronDown} ${actionsOpen ? styles.rotated : ""}`}
                />
              </button>

              {actionsOpen && (
                <div
                  className={`${styles.actionsDropdown} ${actionsDirection === "up" ? styles.dropdownUp : styles.dropdownDown}`}
                >
                  {isVersionHistoryOpen && (
                    <>
                      <button className={`${styles.dropdownItem} ${styles.showOn1750}`}>
                        Save
                      </button>
                      <button className={`${styles.dropdownItem} ${styles.showOn1200}`} onClick={() => window.location.reload()}>
                        Refresh Company
                      </button>
                    </>
                  )}
                  <button className={styles.dropdownItem}>View Company</button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => setPdfDownloadTrigger(prev => prev + 1)}
                    disabled={isGeneratingPdf}
                  >
                    {isGeneratingPdf ? "Generating PDF..." : "Download Report"}
                  </button>
                  <button className={styles.dropdownItem}>Share</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
