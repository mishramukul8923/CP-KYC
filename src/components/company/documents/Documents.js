import { Check, ChevronRight, FileText, Paperclip, X, AlertCircle } from "lucide-react";
import styles from "./Documents.module.css";
import { useState, useEffect } from "react";
import { formatDateToIST } from "@/utils/dateFormatter";
import Image from "next/image";

const dummyDocs = [
  // {
  //   id: 1,
  //   title: "Annual Return",
  //   formType: "Form MGT-7",
  //   date: "30 Sep 2024",
  //   files: [
  //     "MGT-7_Annual_Return_FY2023-24.pdf",
  //     "MGT-7_Annual_Return_FY2022-23.pdf",
  //     "MGT-7_Annual_Return_FY2021-22.pdf",
  //   ],
  // },
  // {
  //   id: 2,
  //   title: "Financial Statement",
  //   formType: "Form AOC-4 (XBRL)",
  //   date: "30 Sep 2024",
  //   files: [
  //     "MGT-7_Annual_Return_FY2023-24.pdf",
  //     "MGT-7_Annual_Return_FY2022-23.pdf",
  //     "MGT-7_Annual_Return_FY2021-22.pdf",
  //   ],
  // },
  // {
  //   id: 3,
  //   title: "CSR Report",
  //   formType: "Form CSR-2",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
  // {
  //   id: 4,
  //   title: "Director Appointment - Rajesh Kumar",
  //   formType: "Form DIR-12",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
  // {
  //   id: 5,
  //   title: "Charge Modification",
  //   formType: "Form CHG-4",
  //   date: "30 Sep 2024",
  //   files: [
  //     "MGT-7_Annual_Return_FY2023-24.pdf",
  //     "MGT-7_Annual_Return_FY2022-23.pdf",
  //     "MGT-7_Annual_Return_FY2021-22.pdf",
  //   ],
  // },
  // {
  //   id: 6,
  //   title: "Annual Return",
  //   formType: "Form MTG-7",
  //   date: "30 Sep 2024",
  //   files: [
  //     "MGT-7_Annual_Return_FY2023-24.pdf",
  //     "MGT-7_Annual_Return_FY2022-23.pdf",
  //     "MGT-7_Annual_Return_FY2021-22.pdf",
  //   ],
  // },
  // {
  //   id: 6,
  //   title: "Financial Statement",
  //   formType: "Form AOC-4 (XBRL)",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
  // {
  //   id: 7,
  //   title: "Certificate of Incorporation",
  //   formType: "Incorporation Certificate",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
  // {
  //   id: 8,
  //   title: "Memorandum of Association",
  //   formType: "Incorporation Certificate",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
  // {
  //   id: 9,
  //   title: "Director Appointment - Rajesh Kumar",
  //   formType: "Form DIR-12",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
  // {
  //   id: 10,
  //   title: "Director Appointment - Rajesh Kumar",
  //   formType: "Form DIR-12",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
  // {
  //   id: 11,
  //   title: "Director Appointment - Rajesh Kumar",
  //   formType: "Form DIR-12",
  //   date: "30 Sep 2024",
  //   files: [],
  // },
];
const DocumentsTable = ({ documents, isLoading, onDownload, sortConfig, onSort }) => {
  const [openRow, setOpenRow] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  if (isLoading && (!documents || documents.length === 0)) {
    return (
      <div className={styles.docsTable}>
        <div className={styles.docsHeader}>
          <span>Document Name</span>
          <span>Form Type</span>
          <span>Filing Date</span>
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
          </div>
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className={styles.docsTable}>
        <div className={styles.noDataPlaceholder}>No documents found for the selected filters.</div>
      </div>
    );
  }

  return (
    <div className={styles.docsTable}>
      {/* Header */}
      <div className={styles.docsHeader}>
        <span>Document Name</span>
        <span>Form Type</span>
        <div
          className={styles.sortableHeader}
          onClick={() => onSort("filing_date")}
        >
          <div className={styles.headerContent}>
            Filing Date
            <img
              src={sortConfig.key === "filing_date"
                ? (sortConfig.direction === "asc" ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg")
                : "/icons/chevrons-up-down.svg"}
              alt=""
              className={styles.sortIcon}
            />
          </div>
        </div>
      </div>

      {/* Rows */}
      {documents.map((doc) => {
        const isOpen = openRow === doc.id;
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mca-document-agent/download/${doc.id}?source=CompanyDocument`;

        return (
          <div key={doc.id} className={styles.docsGroup}>
            {/* Parent Row */}
            <div
              className={`${styles.docsRow} `}
              onClick={() => setOpenRow(isOpen ? null : doc.id)}
            >
              <div className={styles.docName}>
                <ChevronRight
                  size={16}
                  className={`${styles.chevronRow} ${isOpen ? styles.rotate : ""
                    }`}
                />
                <FileText size={20} color="#3B82F6" />
                <span>{doc.document_name}</span>
              </div>

              <span className={styles.muted}>{doc.document_type}</span>
              <span className={styles.muted}>{doc.filing_date}</span>
            </div>

            {/* Expandable Section */}
            <div
              className={`${styles.expandWrapper} ${isOpen ? styles.expandOpen : ""
                }`}
            >
              <div className={styles.subRow}>
                <Paperclip size={20} color="#2563EB" />
                <span
                  className={`${styles.fileLink} ${downloadingId === doc.id ? styles.downloading : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (downloadingId === doc.id) return;
                    setDownloadingId(doc.id);
                    onDownload(doc.id, doc.document_name).finally(() => setDownloadingId(null));
                  }}
                >
                  {downloadingId === doc.id ? "Downloading..." : `Download ${doc.document_name}`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Documents = ({ companyName }) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openYear, setOpenYear] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [docCategories, setDocCategories] = useState([]);
  const [docYears, setDocYears] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["MCA Documents"]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isDocsLoading, setIsDocsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mcaHeaderInfo, setMcaHeaderInfo] = useState({
    source: "-",
    lastUpdated: "-",
    totalDocuments: null
  });
  const [sortConfig, setSortConfig] = useState({ key: "filing_date", direction: "desc" });

  // --- TIMER CONFIGURATION ---
  const INITIAL_COUNTDOWN = 15; // Minutes for initial modal view
  const PAYMENT_CHECK_DELAY = 25; // Minutes to wait before checking payment status
  const RETRY_DELAY = 3; // Minutes to wait and check again if status is RUNNING
  // ---------------------------

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mca-document-agent/categories?identifier=${encodeURIComponent(companyName)}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      // The API returns categories as [{name, count}, ...] and years as [2026, 2025, ...]
      setDocCategories(data.categories || []);
      setDocYears(data.years || []);
      setMcaHeaderInfo({
        source: data.source || "-",
        lastUpdated: data.last_updated || "-",
        totalDocuments: data.total_documents || 0
      });
    } catch (error) {
      console.error("Categories API Error:", error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (companyName) {
      fetchCategories();
    }
  }, [companyName]);

  const fetchDocuments = async (pageNum = 1, shouldAppend = false) => {
    try {
      setIsDocsLoading(true);
      const token = localStorage.getItem("token");
      const filteredCategories = selectedCategories.filter(cat => cat !== "MCA Documents");
      const categoryParams = filteredCategories.length > 0
        ? filteredCategories.map(cat => `category=${encodeURIComponent(cat)}`).join("&")
        : "";

      const yearParams = selectedYears.length > 0
        ? selectedYears.map(y => `year=${encodeURIComponent(y)}`).join("&")
        : "";

      const sortParams = sortConfig.key && sortConfig.direction
        ? `&sort_by=${sortConfig.key}&sort_order=${sortConfig.direction}`
        : "";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mca-document-agent/documents?identifier=${encodeURIComponent(companyName)}&${categoryParams}&${yearParams}&q=${encodeURIComponent(searchQuery)}&page=${pageNum}&per_page=20${sortParams}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();

      if (shouldAppend) {
        setDocumentsList(prev => [...prev, ...(data.documents || [])]);
      } else {
        setDocumentsList(data.documents || []);
      }
      setTotalDocs(data.total || 0);
    } catch (error) {
      console.error("Documents API Error:", error);
    } finally {
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    if (companyName) {
      const timeoutId = setTimeout(() => {
        setPage(1);
        fetchDocuments(1, false);
      }, searchQuery ? 500 : 0); // Debounce search if q is present

      return () => clearTimeout(timeoutId);
    }
  }, [companyName, selectedCategories, selectedYears, searchQuery, sortConfig]);

  useEffect(() => {
    if (page > 1) {
      fetchDocuments(page, true);
    }
  }, [page]);
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      } else {
        direction = "asc";
      }
    }
    setSortConfig({ key: direction ? key : null, direction });
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories(["MCA Documents"]);
    setSelectedYears([]);
    setSearchQuery("");
    setSortConfig({ key: "filing_date", direction: "desc" });
    setPage(1);
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mca-document-agent/download/${docId}?source=CompanyDocument`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      // Clean filename: remove "Optional attachments if any"
      let cleanName = fileName.replace(/Optional attachments if any/gi, "").trim();

      // Extract filename from header if possible, or use the provided one
      a.download = cleanName.endsWith(".pdf") ? cleanName : `${cleanName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download Error:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  useEffect(() => {
    let timer;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";

      // Initial countdown for Step 1
      if (modalStep === 1) {
        setTimeLeft(jobData?.countdown_minutes * 60 || INITIAL_COUNTDOWN * 60);
      }

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1 && modalStep === 2) {
            clearInterval(timer);
            // Guard against multiple calls if already checking
            if (!isCheckingStatus) {
              fetchPaymentStatus();
            }
            return 0;
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    } else {
      document.body.style.overflow = "unset";
      clearInterval(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
      clearInterval(timer);
    };
  }, [isModalOpen, modalStep]); // Removed isCheckingStatus to fix loop

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setModalStep(1);
    }, 300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUnlockSubmit = async () => {
    try {
      setApiLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mca-document-agent/start?company_name=${encodeURIComponent(companyName)}&countdown_minutes=${INITIAL_COUNTDOWN}`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to trigger MCA Document Agent");
      }

      const data = await response.json();
      setJobData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to initiate document unlock. Please try again.");
    } finally {
      setApiLoading(false);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const token = localStorage.getItem("token");
      // Using jobData?.job_id or a fallback if testing
      const jobId = jobData?.job_id || "794dfac6-2a00-4d49-bd4f-417d21d969e4";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mca-document-agent/status/${jobId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment status");
      }

      const data = await response.json();
      setStatusData(data);

      if (data.status === "SUCCESS") {
        setIsUnlocked(true);
        setModalStep(3);
        // Trigger data refresh after successful unlock
        fetchCategories();
        fetchDocuments(1, false);
      } else if (data.status === "RUNNING") {
        // If still running, add 3 more minutes to the timer and check again
        const retryDuration = RETRY_DELAY * 60;
        setTimeLeft(retryDuration);
      } else {
        // FAILED or other status
        setModalStep(3);
      }
    } catch (error) {
      console.error("Status API Error:", error);
      // Fallback to failed view if API fails
      setStatusData({ status: "FAILED", error_message: "Network error. Please try again later." });
      setModalStep(3);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleProceedToPayment = () => {
    const durationInSeconds = PAYMENT_CHECK_DELAY * 60;
    setTimeLeft(durationInSeconds);
    setModalStep(2);

    window.open("https://www.mca.gov.in/content/mca/global/en/foportal/fologin.html", "_blank");
  };

  // Removed temporary auto-transition logic in favor of persistent timer check
  /*
  useEffect(() => {
    if (modalStep === 2) {
      const transitionTimer = setTimeout(() => {
        setModalStep(3);
        setIsUnlocked(true);
      }, 10000);
      return () => clearTimeout(transitionTimer);
    }
  }, [modalStep]);
  */

  // Default category "MCA Documents" that should always be present
  const defaultCategory = {
    name: "MCA Documents",
    count: mcaHeaderInfo.totalDocuments > 0 ? mcaHeaderInfo.totalDocuments : "100+"
  };

  // Combine default with API categories, filtered to avoid duplicates
  const allCategories = [
    defaultCategory,
    ...docCategories.filter(cat => cat.name !== "MCA Documents")
  ];

  // Map API years (strings) to numbers if needed, or just use as is
  const yearsToDisplay = docYears.length > 0 ? docYears : [
    2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  ];

  return (
    <div className={styles.mainWrapper} id="documents">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Documents</h2>
          <div className={styles.sourceRow}>
            <span className={styles.sourceLabel}>Source:</span>
            {mcaHeaderInfo.source === "-" ? (
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80px', height: '14px' }} />
            ) : (
              <span className={styles.sourceValue}>{mcaHeaderInfo.source}</span>
            )}
            <span className={styles.divider}></span>
            <span className={styles.updatedText}>
              <span> Last Updated:</span>
              {mcaHeaderInfo.lastUpdated === "-" ? (
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ display: 'inline-block', width: '100px', height: '14px', verticalAlign: 'middle' }} />
              ) : (
                mcaHeaderInfo.lastUpdated
              )}
            </span>
          </div>
        </div>

        {mcaHeaderInfo.totalDocuments !== null && mcaHeaderInfo.totalDocuments === 0 && (
          <div className={styles.premiumBanner}>
            <div className={styles.premiumLeft}>
              <div className={styles.premiumIcon}>
                <Image src="/icons/docLock.svg" alt="Lock" width={24} height={24} />
              </div>
              <div className={styles.premiumInfo}>
                <div className={styles.premiumTitleWrapper}>
                  <h3 className={styles.premiumTitle}>MCA Premium Documents</h3>
                  <span className={styles.premiumTag}>Premium</span>
                </div>
                <p className={styles.premiumDesc}>
                  Access exclusive documents directly from the Ministry of Corporate Affairs including detailed financial statements, complete board minutes, auditor reports with annexures, and more.
                </p>
                <div className={styles.premiumStats}>
                  <div className={styles.statItem}>
                    <Image src="/icons/docTick.svg" alt="Tick" width={16} height={16} />
                    <span>8 Premium Categories</span>
                  </div>
                  <div className={styles.statItem}>
                    <Image src="/icons/docTick.svg" alt="Tick" width={16} height={16} />
                    <span>1 Year Access</span>
                  </div>
                  <div className={styles.statItem}>
                    <Image src="/icons/docTick.svg" alt="Tick" width={16} height={16} />
                    <span>Verified MCA Source</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              className={styles.unlockBtn}
              onClick={handleUnlockSubmit}
              disabled={apiLoading}
            >
              {apiLoading ? (
                <div className={styles.loader}></div>
              ) : (
                <>
                  <Image src="/icons/lock.svg" alt="Unlock" width={16} height={16} />
                  Unlock Documents
                </>
              )}
            </button>
          </div>
        )}

        <div className={styles.contentContainer}>

          {/* FILTER SIDEBAR */}
          <aside className={styles.sideBar}>
            <div className={styles.filterHeader}>
              <span className={styles.filterTitle}>Filters</span>
              <button className={styles.clearBtn} onClick={handleClearFilters}>Clear</button>
            </div>
            <div className={styles.seperator} />
            {/* CATEGORY */}

            <div className={styles.filterBlock}>
              <div
                className={styles.filterBlockHeader}
                onClick={() => setOpenCategory(!openCategory)}
              >
                <span>Category</span>
                <span
                  className={`${styles.chevron} ${openCategory ? styles.open : ""}`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 12.5L10 7.5L5 12.5"
                      stroke="#041E42"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {isCategoriesLoading ? (
                <div className={styles.filterOptions}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.skeletonSidebarItem}`} />
                  ))}
                </div>
              ) : openCategory && (
                <div className={styles.filterOptions}>
                  {allCategories.map((cat) => (
                    <label key={cat.name} className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => {
                          setSelectedCategories(prev =>
                            prev.includes(cat.name)
                              ? prev.filter(c => c !== cat.name)
                              : [...prev, cat.name]
                          );
                        }}
                      />
                      <span className={styles.customCheckbox}>
                        <Check className={styles.checkIcon} />
                      </span>

                      <div className={styles.labelWrapper}>
                        <span className={styles.checkboxLabel}>{cat.name}</span>
                        {cat.name === "MCA Documents" && mcaHeaderInfo.totalDocuments !== null && mcaHeaderInfo.totalDocuments === 0 && (
                          <Image
                            src="/icons/goldenlock.svg"
                            alt="Lock"
                            width={20}
                            height={20}
                            className={styles.categoryLock}
                          />
                        )}
                      </div>
                      <span className={styles.countBadge}>
                        {cat.count || "-"}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.seperator} />
            {/* YEAR */}
            <div className={styles.filterBlock}>
              <div
                className={styles.filterBlockHeader}
                onClick={() => setOpenYear(!openYear)}
              >
                <span>Year</span>

                <span
                  className={`${styles.chevron} ${openYear ? styles.open : ""}`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 12.5L10 7.5L5 12.5"
                      stroke="#041E42"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {isCategoriesLoading ? (
                <div className={styles.filterOptions}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.skeletonSidebarItem}`} />
                  ))}
                </div>
              ) : openYear && (
                <div className={styles.filterOptions}>
                  {yearsToDisplay.map((yearItem) => {
                    const yearValue = typeof yearItem === 'object' ? yearItem.year : yearItem;
                    const yearCount = typeof yearItem === 'object' ? yearItem.count : null;
                    const yearStr = String(yearValue);

                    return (
                      <label
                        key={yearStr}
                        className={`${styles.checkboxRow} ${styles.checkboxRowCenter}`}
                      >
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={selectedYears.includes(yearStr)}
                          onChange={() => {
                            setSelectedYears(prev =>
                              prev.includes(yearStr)
                                ? prev.filter(y => y !== yearStr)
                                : [...prev, yearStr]
                            );
                          }}
                        />
                        <span className={styles.customCheckbox}>
                          <Check className={styles.checkIcon} />
                        </span>

                        <div className={styles.labelWrapper}>
                          <span className={styles.checkboxLabel}>{yearValue}</span>
                        </div>
                        {yearCount !== null && (
                          <span className={styles.countBadge}>{yearCount}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className={styles.seperator} />
          </aside>

          {/* DOCUMENT LIST */}
          <div className={styles.documentsSectionContainer}>
            <div className={styles.docTitle}>
              <h4>Documents</h4>
              <p>
                Given below are a list of documents related to the company
                obtained from the MCA portal.
              </p>
            </div>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg
                  className={styles.searchIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Search documents"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <DocumentsTable
                documents={documentsList}
                isLoading={isDocsLoading}
                onDownload={handleDownload}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>

            {documentsList.length < totalDocs && (
              <div className={styles.loadMoreWrapper}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={isDocsLoading}
                >
                  {isDocsLoading ? "Loading..." : "Load More"}
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className={`${styles.modalOverlay} ${isClosing ? styles.closing : ""}`}
          onClick={handleCloseModal}
        >
          <div
            className={`${styles.modalContainer} ${isClosing ? styles.closing : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <Image src="/icons/lockAccess.svg" alt="Access" width={24} height={24} />
              </div>
              <div className={styles.modalTitleArea}>
                <h2 className={styles.modalTitle}>MCA Document Access</h2>
                <p className={styles.modalSubTitle}>Complete payment to view documents</p>
              </div>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {modalStep === 1 ? (
                <>
                  <div className={styles.timerSection}>
                    <div className={styles.timerLeft}>
                      <Image src="/icons/orangeClock.svg" alt="Clock" width={24} height={24} />
                      <div className={styles.timerLabel}>
                        <span>Complete payment within</span>
                        <span>Session will expire after this time</span>
                      </div>
                    </div>
                    <div className={styles.timerValue}>
                      <span>{formatTime(timeLeft)}</span>
                      <span>minutes</span>
                    </div>
                  </div>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Document Category</span>
                      <span className={styles.detailValue}>MCA Official Documents</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Total Sub-Categories</span>
                      <span className={styles.detailValue}>{jobData?.total_category_count || 8}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Access Period</span>
                      <span className={styles.detailValue}>1 Year</span>
                    </div>
                  </div>

                  <div className={styles.instructionsBox}>
                    <div className={styles.instructionIcon}>
                      <Image src="/icons/bluealert.svg" alt="Info" width={20} height={20} />
                    </div>
                    <div className={styles.instructionContent}>
                      <h4 className={styles.instructionTitle}>Payment Instructions</h4>
                      <ul className={styles.instructionList}>
                        <li>You will be redirected to the MCA official payment portal</li>
                        <li>Complete the payment using your preferred payment method</li>
                        <li>Return to this page after successful payment</li>
                        <li>Your documents will be unlocked automatically</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : modalStep === 2 ? (
                <div className={styles.processingView}>
                  <div className={styles.processingIcon}>
                    <Image src="/icons/blueClock.svg" alt="Processing" width={40} height={40} />
                  </div>
                  <h3 className={styles.processingTitle}>
                    {isCheckingStatus ? "Checking Status..." : "Processing Payment..."}
                  </h3>
                  <p className={styles.processingSubtitle}>
                    {isCheckingStatus
                      ? "Verifying your payment with MCA records. Please wait."
                      : `Please complete your payment on the MCA Portal and return to this page. `
                    }
                  </p>
                  <div className={styles.loadingDots}>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                  </div>
                </div>
              ) : (
                <div className={styles.successView}>
                  {statusData?.status === "SUCCESS" || (!statusData && isUnlocked) ? (
                    <>
                      <div className={styles.successIcon}>
                        <Image src="/icons/greenTick.svg" alt="Success" width={32} height={32} />
                      </div>
                      <h3 className={styles.successTitle}>Payment Successful!</h3>
                      <p className={styles.successSubtitle}>
                        Your MCA documents have been unlocked successfully
                      </p>
                      <div className={styles.accessAlert}>
                        <div className={styles.accessAlertHeader}>
                          <Image src="/icons/greenAlert.svg" alt="Alert" width={24} height={24} />
                          <h4 className={styles.accessAlertTitle}>Access Granted</h4>
                        </div>
                        <p className={styles.accessAlertDesc}>
                          You can now view and download all MCA documents
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.errorIcon} style={{ backgroundColor: '#FEE2E2', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <X size={32} color="#EF4444" />
                      </div>
                      <h3 className={styles.successTitle} style={{ color: '#EF4444' }}>Payment Failed</h3>
                      <p className={styles.successSubtitle}>
                        {statusData?.error_message || "Please complete the payment first to view the documents"}
                      </p>
                      <button
                        className={styles.proceedBtn}
                        style={{ marginTop: 20 }}
                        onClick={() => setModalStep(1)}
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {modalStep === 1 && (
              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  className={styles.proceedBtn}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                  <Image src="/icons/paymentgo.svg" alt="Go" width={16} height={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
