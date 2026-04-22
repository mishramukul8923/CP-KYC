import React, { useState, useEffect } from "react";
import styles from "./newHeader.module.css";
import { useRouter } from "next/navigation";
import { formatDateToIST } from "@/utils/dateFormatter";
import { useCompanySection } from "../context/CompanySectionContext";
import ShareModal from "../modals/ShareModal";
import DownloadModal from "../modals/DownloadModal";

/* -------------------- REUSABLE RISK CARD -------------------- */
const RiskCard = ({
  icon,
  category,
  severity,
  title,
  description,
  date,
  source,
  variant,
}) => {
  const isHigh = severity === "High";
  return (
    <div className={`${styles.riskCard} ${styles[variant]}`}>
      {/* LEFT ICON */}
      <div className={styles.cardIconBox}>
        <img src={icon} alt="" />
      </div>

      {/* MIDDLE CONTENT */}
      <div className={styles.cardContent}>
        <span
          className={isHigh ? styles.categoryLabel : styles.categoryLabelYellow}
        >
          {category}
        </span>

        <h4 className={styles.cardTitle}>{title}</h4>

        <p className={styles.cardDesc}>{description}</p>

        <div className={styles.cardFooter}>
          <div className={styles.footerMeta}>
            <div className={styles.footerItem}>
              <img src="/icons/footer_calender2.svg" alt="date" />
              <span>{date}</span>
            </div>

            <span className={styles.footerDivider}></span>

            <div className={styles.footerItem}>
              <img src="/icons/footer_file.svg" alt="source" />
              <span>{source}</span>
            </div>
          </div>

          <a href="#" className={styles.viewDetails}>
            View Details
            <img src="/icons/arrow-up-right.svg" alt="" />
          </a>
        </div>
      </div>

      {/* RIGHT SEVERITY */}
      <span
        className={isHigh ? styles.severityBadgeHigh : styles.severityBadgeMed}
      >
        {severity}
      </span>
    </div>
  );
};

/* -------------------- DATA (API READY) -------------------- */
const RISK_DATA = [
  // {
  //   category: "LEGAL",
  //   severity: "High",
  //   variant: "cardHigh",
  //   icon: "/icons/scale.svg",
  //   title: "12 Pending Legal Cases Identified",
  //   description:
  //     "Active litigation across NCLT, High Courts, and civil courts involving product liability and contract disputes",
  //   date: "15 Dec 2024",
  //   source: "Court Records",
  // },
  // {
  //   category: "MEDIA",
  //   severity: "Medium",
  //   variant: "cardMedium",
  //   icon: "/icons/file-text.svg",
  //   title: "Negative Media Coverage Related to Product Quality",
  //   description:
  //     "3 adverse news articles published regarding product quality concerns and customer complaints",
  //   date: "08 Jan 2025",
  //   source: "News Media",
  // },
  // {
  //   category: "REGULATORY",
  //   severity: "High",
  //   variant: "cardHigh",
  //   icon: "/icons/reg-red.svg",
  //   title: "Pending Compliance Notices from Regulators",
  //   description:
  //     "2 outstanding notices from SEBI and MCA requiring response and corrective action",
  //   date: "22 Dec 2024",
  //   source: "Regulator",
  // },
  // {
  //   category: "FINANCIAL",
  //   severity: "Medium",
  //   variant: "cardMedium",
  //   icon: "/icons/fin-yellow.svg",
  //   title: "Declining Financial Performance",
  //   description:
  //     "Profit margins decreased by 7.02% and EBITDA declined by 7.19% in last fiscal year",
  //   date: "31 Mar 2024",
  //   source: "Financial Statements",
  // },
  // {
  //   category: "GOVERNANCE",
  //   severity: "Medium",
  //   variant: "cardMedium",
  //   icon: "/icons/gov-yellow.svg",
  //   title: "Material Director Changes",
  //   description:
  //     "4 director resignations recorded in the past 12 months, indicating potential governance concerns",
  //   date: "28 Nov 2024",
  //   source: "ROC Filings",
  // },
];

const CompanyNewHeader = ({ companyData }) => {
  const { isVersionHistoryOpen, setVersionHistoryOpen, alertsData, setPdfDownloadTrigger, isGeneratingPdf, setIsGeneratingPdf } = useCompanySection();
  const [isExpanded, setIsExpanded] = useState(false); // State to track expansion
  const router = useRouter();

  const slug = companyData?.company_information?.legal_name
    ?.toLowerCase()
    .replaceAll(" ", "-");

  const nseSymbol = companyData?.company_information?.nse_symbol;
  const bseSymbol = companyData?.company_information?.bse_symbol;
  const hasNse = nseSymbol && nseSymbol !== "-";
  const hasBse = bseSymbol && bseSymbol !== "-";

  let listingText = "-";
  if (hasNse && hasBse) listingText = "NSE & BSE";
  else if (hasNse) listingText = "NSE";
  else if (hasBse) listingText = "BSE";

  // State extraction
  const getAddressState = (address) => {
    if (!address) return "-";
    const parts = address.split(",");
    const lastPart = parts[parts.length - 1].trim();
    // Remove pincode (digits at the end) to get the state
    return lastPart.replace(/\d+$/, "").trim() || lastPart;
  };
  const companyState = getAddressState(companyData?.contact_details?.registered_address);
  const fullAddress = companyData?.contact_details?.registered_address || "-";

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [actionsDirection, setActionsDirection] = useState("down");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const actionsRef = React.useRef(null);
  const toggleActions = () => {
    if (!actionsRef.current) return;

    const rect = actionsRef.current.getBoundingClientRect();
    const dropdownHeight = 160;
    const spaceBelow = window.innerHeight - rect.bottom;

    setActionsDirection(spaceBelow > dropdownHeight ? "down" : "up");
    setActionsOpen((prev) => !prev);
  };
  React.useEffect(() => {
    const close = (e) => {
      if (!actionsRef.current?.contains(e.target)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={styles.wrapper}>
      <header className={styles.headerContainer}>
        <div className={styles.mainLayout}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoCircle}>
              <img
                src="/icons/Image.svg"
                alt={companyData?.company_information?.legal_name + "logo"}
                className={styles.logoCircle}
              />
            </div>
          </div>

          <div className={styles.contentSectionTop}>

            <div className={styles.contentSection}>
              <div className={styles.titleRow}>
                <h1 className={styles.companyName}>{companyData?.company_information?.legal_name || "-"}</h1>
              </div>
              <div className={styles.buttonGroup}>
                {!isVersionHistoryOpen && (
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
                )}
                <button
                  className={`${styles.saveButton} ${isVersionHistoryOpen ? styles.hideOn1200 : ""}`}
                  onClick={() => { window.location.reload(); }}
                >
                  <img
                    src="/icons/refresh.svg"
                    alt=""
                    className={styles.buttonIcon}
                  />
                  Refresh Company
                </button>
                {/* <button className={`${styles.saveButton} ${isVersionHistoryOpen ? styles.hideOn1750 : ""}`}>
                  <img
                    src="/icons/bookmark.svg"
                    alt=""
                    className={styles.buttonIcon}
                  />
                  Save
                </button> */}
                <div ref={actionsRef} className={styles.actionsWrapper}>
                  <button
                    className={styles.actionsButton}
                    onClick={toggleActions}
                  >
                    Actions
                    <img
                      src="/icons/chevron-down.svg"
                      alt=""
                      className={`${styles.chevronDown} ${actionsOpen ? styles.rotated : ""
                        }`}
                    />
                  </button>

                  {actionsOpen && (
                    <div
                      className={`${styles.actionsDropdown} ${actionsDirection === "up"
                        ? styles.dropdownUp
                        : styles.dropdownDown
                        }`}
                    >
                      {isVersionHistoryOpen && (
                        <>
                          {/* <button className={`${styles.dropdownItem} ${styles.showOn1750}`}>
                            Save
                          </button> */}
                          <button className={`${styles.dropdownItem} ${styles.showOn1200}`} onClick={() => window.location.reload()}>
                            Refresh Company
                          </button>
                        </>
                      )}
                      {/* <button className={styles.dropdownItem}>
                        View Company
                      </button> */}
                      <button
                        className={styles.dropdownItem}
                        onClick={() => setPdfDownloadTrigger(prev => prev + 1)}
                        disabled={isGeneratingPdf}
                      >
                        {isGeneratingPdf ? "Generating PDF..." : "Download Report"}
                      </button>
                      <button
                        className={styles.dropdownItem}
                        onClick={() => setIsShareModalOpen(true)}
                      >
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.contentSectionBottom}>

              <div className={styles.contentSectionBottomLeft}>
                <div className={styles.statsContainer}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Industry :</span>
                    <span className={styles.cinBadge}>{companyData?.company_information?.industry || "-"}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Listing Status :</span>
                    {listingText !== "-" ? (
                      <span className={styles.scoreBadgeGreen}>
                        <img
                          src="/icons/greencheck.svg"
                          alt="check"
                          className={styles.checkGreen}
                        />
                        {listingText}
                      </span>
                    ) : (
                      <span className={styles.cinBadge}>-</span>
                    )}
                  </div>
                </div>

                {/* <p className={styles.description}>
              Dabur is an India's leading FMCG Companies with Revenues of over
              Rs 7,680 Crore & Market Capitalisation of over Rs 48,800 Crore.
            </p> */}

                <div className={styles.infoMetaRow}>
                  <div className={styles.metaItem}>
                    <img src="/icons/calendar.svg" className={styles.icon} />
                    <span>Founded {companyData?.company_information?.incorporation_date ? companyData?.company_information?.incorporation_date?.split("/")[2] : "-"}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <img src="/icons/flag.svg" className={styles.icon} />
                    <span>{companyData?.company_information?.classification || "-"}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <img src="/icons/location.svg" className={styles.icon} />

                    <span
                      className={styles.addressLine}
                      title={fullAddress}
                    >
                      {companyState}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <img src="/icons/profile-2user.svg" className={styles.icon} />
                    <span>{companyData?.employees?.[0]?.employees || "-"}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <img src="/icons/global.svg" className={styles.icon} />
                    <a
                      href={companyData?.contact_details?.website ? (companyData.contact_details.website.match(/^https?:\/\//) ? companyData.contact_details.website : `https://${companyData.contact_details.website}`) : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {companyData?.contact_details?.website || "-"}
                    </a>
                  </div>
                  <div className={styles.socialIcons}>
                    {companyData?.contact_details?.social_media?.map((url, index) => {
                      let iconSrc = "/icons/link.svg";
                      let altText = "Link";

                      if (url.includes("facebook.com")) {
                        iconSrc = "/icons/fb.svg";
                        altText = "Facebook";
                      } else if (url.includes("linkedin.com")) {
                        iconSrc = "/icons/li.svg";
                        altText = "LinkedIn";
                      } else if (url.includes("twitter.com") || url.includes("x.com")) {
                        iconSrc = "/icons/twitter.svg";
                        altText = "Twitter";
                      } else if (url.includes("instagram.com")) {
                        iconSrc = "/icons/instagram.svg";
                        altText = "Instagram";
                      } else if (url.includes("youtube.com")) {
                        iconSrc = "/icons/youtube2.svg";
                        altText = "YouTube";
                      }

                      return (
                        <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
                          <img
                            src={iconSrc}
                            alt={altText}
                            title={altText}
                            className={styles.socialIcon}
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.alertsRow}>
                  {alertsData?.summary?.litigation?.total > 0 && (
                    <div className={`${styles.alertBadge} ${styles.legalAlert}`}>
                      <img src="/icons/scale.svg" alt="" /> <strong>{alertsData.summary.litigation.total}</strong> Legal Cases
                    </div>
                  )}
                  {alertsData?.summary?.adverse?.total > 0 && (
                    <div className={`${styles.alertBadge} ${styles.adverseAlert}`}>
                      <img src="/icons/file-text.svg" alt="" /> <strong>{alertsData.summary.adverse.total}</strong> Adverse Cases
                    </div>
                  )}
                  {alertsData?.summary?.regulatory?.total > 0 && (
                    <div className={`${styles.alertBadge} ${styles.regulatoryAlert}`}>
                      <img src="/icons/shield.svg" alt="" /> <strong>{alertsData.summary.regulatory.total}</strong> Regulatory Issues
                    </div>
                  )}
                  {/* Risk Alert - To be mapped later from API */}
                  {false && (
                    <div className={`${styles.alertBadge} ${styles.riskAlert}`}>
                      <img src="/icons/activity.svg" alt="" /> <strong>-</strong> Risk
                    </div>
                  )}
                  {alertsData?.summary && (alertsData.summary.litigation?.total > 0 || alertsData.summary.adverse?.total > 0 || alertsData.summary.regulatory?.total > 0) && (
                    <button
                      className={styles.viewAllBtn}
                      onClick={() =>
                        router.push(`/company/${slug}?section=alerts`)
                      }
                    >
                      View All Alert <img src="/icons/arrow-down-dark.svg" alt="" />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.contentSectionBottomRight}>
                <div className={styles.lastUpdated}>
                  <span>Last Updated:</span>{" "}
                  <strong>{formatDateToIST(companyData?.header?.last_updated)}</strong>
                </div>
              </div>



            </div>
          </div>
        </div>
      </header>

      {/* ================= OBSERVATIONS BAR ================= */}
      {/* <div className={styles.observationsBar}>
        <div className={styles.observationsContent}>
          <div className={styles.obsLeft}>
            <span className={styles.dot}></span>
            <span className={styles.obsTitle}>Observations Found</span>
          </div>

          <div className={styles.obsDivider}></div>

          <div className={styles.obsRight}>
            <div className={styles.issueItem}>
              <img src="/icons/warning-orange.svg" alt="" />
              <span className={styles.issueTextOrange}>
                - Issues Identified
              </span>
            </div>
            <span className={styles.bullet}>•</span>
            <span className={styles.issueTextRed}>- High Severity</span>
          </div>

          <img
            src="/icons/chevron-down-dark.svg"
            alt="expand"
            className={`${styles.obsChevron} ${isExpanded ? styles.rotated : ""
              }`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div> */}

      {/* ================= EXPANDED SECTION (BELOW BAR) ================= */}
      {isExpanded && (
        <div
          className={`${styles.expandedWrapper} ${isExpanded ? styles.expandedOpen : styles.expandedClosed
            }`}
        >
          <div className={styles.expandedInner}>
            <div className={styles.riskSummaryHeader}>
              <div className={styles.riskIconBox}>
                <img src="/icons/warning-white.svg" alt="" />
              </div>
              <div>
                <h3 className={styles.riskSummaryTitle}>
                  Risk & Red Flag Summary
                </h3>
                <p className={styles.riskSummarySub}>
                  Material adverse observations requiring attention during due
                  diligence
                </p>
              </div>
            </div>

            <div className={styles.riskGrid}>
              {RISK_DATA.map((item, index) => (
                <RiskCard key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Download Progress Modal */}
      <DownloadModal isOpen={isGeneratingPdf} onClose={() => setIsGeneratingPdf(false)} />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={`${process.env.NEXT_PUBLIC_SHARE_BASE_URL || 'https://cp-kyc.vercel.app'}/company/${slug}`}
        companyName={companyData?.company_information?.legal_name}
        title="Share Company"
        subtitle={`Share ${companyData?.company_information?.legal_name}'s company profile with your network`}
      />
    </div>
  );
};

export default CompanyNewHeader;
