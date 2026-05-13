import styles from "./DirectorProfile.module.css";
import { useState, useEffect } from "react";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";

export default function DirectorProfile({ directors = [], companyName = "", hideSidebar = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [activeTab, setActiveTab] = useState("current");
  const [directorTab, setDirectorTab] = useState("current");

  const { activeSubSection, setActiveSubSection, setActiveSection } = useCompanySection() || {};
  const [expandedNewsIds, setExpandedNewsIds] = useState({});

  const parseTimelineDate = (dateStr) => {
    if (!dateStr || dateStr === "-" || dateStr === "N/A") return new Date(0);
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts;
        date = new Date(`${y}-${m}-${d}`);
        if (!isNaN(date.getTime())) return date;
      }
    }
    return new Date(0);
  };

  const calculateTenure = (appointmentDate, cessationDate, status) => {
    const start = parseTimelineDate(appointmentDate);
    if (start.getTime() === 0) return "-";

    let end;
    if (status === "Active") {
      end = new Date();
    } else {
      end = parseTimelineDate(cessationDate);
      if (end.getTime() === 0) return "-";
    }

    if (end < start) return "-";

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const yearText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : "";
    const monthText = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : "";

    if (yearText && monthText) return `${yearText} ${monthText}`;
    if (yearText) return yearText;
    if (monthText) return monthText;
    return "0 months";
  };

  const toggleNewsExpand = (id) => {
    setExpandedNewsIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const [directorNewsList, setDirectorNewsList] = useState([]);
  const [newsPage, setNewsPage] = useState(1);
  const [newsLoading, setNewsLoading] = useState(false);
  const [hasMoreNews, setHasMoreNews] = useState(false);

  useEffect(() => {
    if (activeSubSection === "Past Directors") {
      setDirectorTab("past");
    } else if (activeSubSection === "Current Directors") {
      setDirectorTab("current");
    }
  }, [activeSubSection]);

  const handleTabChange = (tab) => {
    setDirectorTab(tab);
    if (setActiveSubSection) {
      setActiveSubSection(tab === "past" ? "Past Directors" : "Current Directors");
    }
  };

  const hasData = directors && directors.length > 0;
  const directorsToUse = hasData ? directors : [];

  // Filter directors based on tab (current/past) and search
  const filteredDirectors = directorsToUse.filter((director) => {
    const isPastDirector = director.cessation_date && director.cessation_date !== "-";
    const matchesTab = directorTab === "current" ? !isPastDirector : isPastDirector;

    const matchesSearch = searchTerm === "" ||
      director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      director.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      director.din_pan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === "All" ||
      director.designation.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesTab && matchesSearch && matchesFilter;
  });

  const sidebarItems = filteredDirectors.map((director) => ({
    name: director.name,
    role: director.designation,
    din: director.din_pan,
    image: director.details?.profile_image,
    status: director.status,
    category: director.category,
    appointment_date: director.appointment_date,
    cessation_date: director.cessation_date,
    is_kmp: director.is_kmp,
    linkedin_url: director.linkedin_url,
    director_type: director.director_type,
    details: {
      ...director.details,
      qualifications: (director.qualifications?.length > 0 ? director.qualifications : (director.details?.qualifications || [])).map(q => ({
        icon: q.icon || "/images/placeholder.svg",
        title: q.certificate_in || q.title || "-",
        inst: q.institute_name || q.inst || "-",
        spec: q.specialization_in || q.spec || "-",
        yearfrom: q.year_from || q.yearfrom || "-",
        yearto: q.year_to || q.yearto || "-"
      })),
      shareholding: (director.shareholding?.length > 0 ? director.shareholding : (director.details?.shareholding || [])).map(s => ({
        company_name: s.company_name || "-",
        share_percentage: s.shareholding_percentage || s.share_percentage || "-",
        nature_of_holding: s.nature || s.nature_of_holding || "-",
        company_log: s.company_log
      })),
      career_timeline: director.career_timeline?.length > 0 ? director.career_timeline : (director.details?.career_timeline || []),
      negative_media: director.negative_media?.length > 0 ? director.negative_media : (director.details?.negative_media || []),
      banking_default: director.banking_default_declarations?.length > 0 ? director.banking_default_declarations : (director.details?.banking_default || []),
      regulatory_history: director.regulatory_compliance_history?.length > 0 ? director.regulatory_compliance_history : (director.details?.regulatory_history || []),
      pep_sanctions: director.pep_sanctions_checks?.length > 0 ? director.pep_sanctions_checks : (director.details?.pep_sanctions || []),
      risk_edd: director.risk_edd || director.details?.risk_edd || {},
      news: director.news || { news: [] }
    }
  }));

  // Get current selected director
  const selectedDirector = sidebarItems[activeIndex] || sidebarItems[0] || {};

  useEffect(() => {
    if (selectedDirector?.name) {
      const initialNews = selectedDirector.details?.news?.news || [];
      const total = selectedDirector.details?.news?.total || 0;
      setDirectorNewsList(initialNews);
      setNewsPage(1);
      setHasMoreNews(initialNews.length < total);
    } else {
      setDirectorNewsList([]);
      setHasMoreNews(false);
    }
  }, [selectedDirector?.name, selectedDirector?.din]);

  const fetchMoreNews = async () => {
    if (newsLoading || !hasMoreNews || !companyName) return;

    try {
      setNewsLoading(true);
      const nextPage = newsPage + 1;
      const token = localStorage.getItem("token");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/news?page=${nextPage}&size=5&search=${encodeURIComponent(selectedDirector.name)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.news && Array.isArray(data.news)) {
        setDirectorNewsList(prev => [...prev, ...data.news]);
        setNewsPage(nextPage);
        setHasMoreNews((directorNewsList.length + data.news.length) < data.total);
      } else {
        setHasMoreNews(false);
      }
    } catch (error) {
      console.error("Error fetching more director news:", error);
    } finally {
      setNewsLoading(false);
    }
  };

  // Helper to detect and style status/pills
  const renderCellContent = (value) => {
    if (typeof value !== "string") return value;

    const lowerVal = value.toLowerCase();

    if (lowerVal === "high") {
      return (
        <span className={`${styles.pill} ${styles.highSeverity}`}>
          <span className={styles.dotRed} /> High
        </span>
      );
    }
    if (
      ["resolved", "clear", "not a pep", "not a wilful defaulter"].includes(
        lowerVal,
      )
    ) {
      return (
        <span className={`${styles.pill} ${styles.greenPill}`}>{value}</span>
      );
    }
    if (lowerVal === "low") {
      return (
        <span className={`${styles.pill} ${styles.lowRiskPill}`}>
          <span className={styles.dotAmber} /> Low
        </span>
      );
    }

    return value;
  };

  // Example Dynamic Data Array
  const regulatoryData = [
    {
      tableKey: "negativeMedia",
      title: "Negative / Adverse Media",
      headers: ["Source", "Description", "Severity", "Date"],
      rows: (selectedDirector.details?.negative_media || []).map(item => ({
        source: item.source || "-",
        desc: item.description || "-",
        sev: item.severity || "-",
        date: item.date || "-"
      })),
    },
    {
      tableKey: "bankingDefault",
      title: "Banking / Default Declaration",
      headers: ["Default Type", "Declaration Status", "Remarks"],
      rows: (selectedDirector.details?.banking_default || []).map(item => ({
        type: item.default_type || "-",
        status: item.declaration_status || "-",
        remarks: item.remarks || "-"
      })),
    },
    {
      tableKey: "regulatoryHistory",
      title: "Regulatory / Compliance History",
      headers: ["Regulator", "Nature of Action", "Period", "Status"],
      rows: (selectedDirector.details?.regulatory_history || []).map(item => ({
        reg: item.regulator || "-",
        nature: item.nature_of_action || "-",
        period: item.period || "-",
        status: item.status || "-"
      })),
    },
    {
      tableKey: "pepSanctions",
      title: "PEP & Sanctions Check",
      headers: ["Check Type", "Status", "Remarks"],
      rows: (selectedDirector.details?.pep_sanctions || []).map(item => ({
        type: item.check_type || "-",
        status: item.status || "-",
        remarks: item.remarks || "-"
      })),
    },
    {
      tableKey: "riskEDD",
      title: "Risk & EDD (Individual)",
      headers: [
        "Risk Category",
        "EDD Required",
        "Key Risk Drivers",
        "Last Reviewed",
      ],
      rows: selectedDirector.details?.risk_edd ? [{
        cat: selectedDirector.details.risk_edd.risk_category || "-",
        edd: selectedDirector.details.risk_edd.edd_required || "-",
        drivers: selectedDirector.details.risk_edd.key_risk_drivers || "-",
        date: selectedDirector.details.risk_edd.last_reviewed || "-",
      }] : [],
    },
  ];

  const handleShare = async (title, url) => {
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Director News',
          url: url
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          window.open(url, '_blank');
        }
      }
    } else {
      window.open(url, '_blank');
    }
  };

  const filters = [
    "All",
    "Director",
    "Whole-time director",
    "CFO",
    "CEO",
    "Company Secretary",
    "Managing Director"
  ];

  return (
    <div className={styles.container}>
      <>
        {!hideSidebar && (
          <div className={styles.containerHeader}>
            <div className={styles.sidebarTabs}>
              <div
                className={`${styles.sidebarTab} ${directorTab === "current" ? styles.sidebarTabActive : ""
                  }`}
                onClick={() => handleTabChange("current")}
              >
                Current Directors & KMP
              </div>

              <div
                className={`${styles.sidebarTab} ${directorTab === "past" ? styles.sidebarTabActive : ""
                  }`}
                onClick={() => handleTabChange("past")}
              >
                Past Directors & KMP
              </div>
            </div>
          </div>
        )}

        <div className={styles.mainContainer}>
          {!hideSidebar && (
            <aside className={styles.sidebar}>
              <div className={styles.searchWrapper}>
                <img
                  src="/icons/search.svg"
                  alt="thumb"
                  className={styles.searchImg}
                />
                <input
                  type="text"
                  placeholder="Search by name, role, or DIN"
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Tags */}
              <div className={styles.filterContainer}>
                {filters.map((filter) => (
                  <div
                    key={filter}
                    className={`${styles.filterTag} ${activeFilter === filter ? styles.activeFilter : ""
                      }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>

              <div className={styles.sidebarList}>
                {sidebarItems.length > 0 ? (
                  sidebarItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`${styles.sidebarItem} ${activeIndex === idx ? styles.active : ""}`}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <img
                        src={(item.image && item.image !== "-") ? item.image : "/icons/profile-icon.svg"}
                        alt="profile"
                        className={styles.sidebarImg}
                      />
                      <div className={styles.sidebarInfo}>
                        <span className={styles.sidebarName}>{item.name}</span>
                        <span className={styles.sidebarRole}>{item.role}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noData}>
                    Data not available.
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* MAIN CONTENT */}
          <main className={`${styles.main} ${hideSidebar ? styles.fullWidth : ""}`}>
            {sidebarItems.length > 0 ? (
              <>
                {/* PROFILE HEADER */}
                <section className={styles.headerCard}>
                  <div className={styles.headerLeft}>

                    <img
                      src={
                        selectedDirector.details?.profile_image &&
                          selectedDirector.details.profile_image !== "-"
                          ? selectedDirector.details.profile_image
                          : "/icons/profile-icon.svg"
                      }
                      alt="profile"
                      className={styles.profilePic}
                    />
                    <div className={styles.profileTitle}>
                      <div className={styles.profileTitleWrapper}>
                        <h1>{selectedDirector.name || 'Select a Director'}</h1>
                        {selectedDirector.linkedin_url && selectedDirector.linkedin_url !== "-" && (
                          <a href={selectedDirector.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <img src="/images/linkedln.svg" alt="linkedln" />
                          </a>
                        )}

                        {/* PROFILE IMAGE FOR MAIN SECTIION
                  {selectedDirector.details?.profile_image && (
                    <img src={selectedDirector.details?.profile_image || "/icons/dabur-logo.svg"} alt="profile" />
                  )} */}
                      </div>
                      <div className={styles.profileSubtitle}>
                        <span>DIN: {selectedDirector.din || '-'}</span>
                        <span className={styles.grayDot}></span>
                        <span>{selectedDirector.role || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.dinStatus}>
                    DIN Status : <span className={`${styles.statusTag} ${selectedDirector.details?.din_status === "Active" ? styles.activeTag : styles.inactiveTag}`}>
                      {selectedDirector.details?.din_status || '-'}
                    </span>
                  </div>
                </section>

                {/* PERSONAL INFO GRID */}
                <div className={styles.detailsGrid}>
                  <InfoBlock label="DIN" value={selectedDirector.din || '-'} />
                  <InfoBlock label="PAN" value={selectedDirector?.details?.pan || '-'} />
                  <InfoBlock label="Nationality" value={selectedDirector.details?.nationality || '-'} />
                  <InfoBlock label="Date of Birth" value={selectedDirector.details?.dob || '-'} />
                  <InfoBlock label="Gender" value={selectedDirector.details?.gender || '-'} />
                  <InfoBlock label="Residential Status" value={selectedDirector.details?.residential_status || '-'} />
                  <InfoBlock label="Email ID" value={selectedDirector.details?.email || '-'} />
                  <InfoBlock label="Mobile Number" value={selectedDirector.details?.mobile || '-'} />
                  <InfoBlock label="Type" value={selectedDirector?.category || '-'} />

                </div>

                <div className={styles.addressGrid}>
                  <InfoBlock
                    label="Current Residential Address"
                    value={selectedDirector.details?.current_residential_address || '-'}
                  />
                  <InfoBlock
                    label="Permanent Address"
                    value={selectedDirector.details?.permanent_address || '-'}
                  />
                </div>

                {/* ROLE & APPOINTMENT */}
                {/* <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              Role & Appointment Details
            </h2>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Company/LLP name</th>
                    <th>Designation</th>
                    <th>Appointment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className={styles.companyRow}>
                        <div className={styles.companyIconWrapper}>
                          <img
                            src="/icons/dabur-logo.svg"
                            className={styles.companyIcon}
                            alt=""
                          />
                        </div>
                        Dabur India Limited
                      </div>
                    </td>
                    <td>Managing Director</td>
                    <td>01-Apr-2015</td>
                    <td>
                      <span className={styles.activeTag}>Active</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section> */}

                {/* OTHER ASSOCIATIONS */}
                <section className={styles.section}>
                  <div className={styles.headerArea}>
                    <h2 className={styles.sectionHeading}>Other Associations</h2>
                    <div className={styles.subTabs}>
                      <div
                        className={`${styles.subTab} ${activeTab === "current" ? styles.subTabActive : ""
                          }`}
                        onClick={() => setActiveTab("current")}
                      >
                        Current Companies
                      </div>

                      <div
                        className={`${styles.subTab} ${activeTab === "previous" ? styles.subTabActive : ""
                          }`}
                        onClick={() => setActiveTab("previous")}
                      >
                        Previous Companies
                      </div>

                      <div
                        className={`${styles.subTab} ${activeTab === "shareholding" ? styles.subTabActive : ""
                          }`}
                        onClick={() => setActiveTab("shareholding")}
                      >
                        Shareholding
                      </div>
                    </div>
                  </div>

                  {activeTab === "current" && (
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Company/LLP name</th>
                            <th>Designation</th>
                            <th>Type</th>
                            <th>Period</th>
                            <th>Appointment Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDirector.details?.current_positions?.map((position, idx) => (
                            <AssociationRow
                              key={idx}
                              image={position.company_log}
                              name={position.company_name || "-"}
                              role={position.designation || "-"}
                              type={position.category || "-"}
                              period={position.tenure_years || "-"}
                              date={position.appointment_date || "-"}
                            />
                          ))}
                          {(!selectedDirector.details?.current_positions || selectedDirector.details.current_positions.length === 0) && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                Data not available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === "previous" && (
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Company/LLP name</th>
                            <th>Designation</th>
                            <th>Tenure</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDirector.details?.past_positions?.map((position, idx) => (
                            <AssociationRow
                              key={idx}
                              image={position.company_log}
                              name={position.company_name || "-"}
                              role={position.designation || "-"}
                              date={position?.tenure_years || "-"}
                            />
                          ))}
                          {(!selectedDirector.details?.past_positions || selectedDirector.details.past_positions.length === 0) && (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                Data not available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === "shareholding" && (
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Company/LLP name</th>
                            <th>Shareholding %</th>
                            <th>Nature</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDirector.details?.shareholding?.map((item, idx) => (
                            <AssociationRow
                              key={idx}
                              image={item.company_log}
                              name={item.company_name || "-"}
                              role={item.share_percentage || "-"}
                              date={item?.nature_of_holding || "-"}
                            />
                          ))}
                          {(!selectedDirector.details?.shareholding || selectedDirector.details.shareholding.length === 0) && (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                Data not available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {/* <tbody>
                    <tr>
                      <td>
                        <div className={styles.companyRow}>
                          <div className={styles.companyIconWrapper}>
                            <img
                              src="/icons/company-icon.svg"
                              className={styles.companyIcon}
                              alt=""
                            />
                          </div>
                          Dabur India Limited
                        </div>
                      </td>
                      <td>-</td>
                      <td>
                        <span className={styles.promoterTag}>
                          Promoter
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className={styles.companyRow}>
                          <div className={styles.companyIconWrapper}>
                            <img
                              src="/icons/company-icon.svg"
                              className={styles.companyIcon}
                              alt=""
                            />
                          </div>
                          Dabur Nepal Pvt. Ltd.
                        </div>
                      </td>
                      <td>-</td>
                      <td>
                        <span className={styles.nonPromoterTag}>
                          Non-Promoter
                          -
                        </span>
                      </td>
                    </tr>
                  </tbody> */}
                      </table>
                    </div>
                  )}
                </section>

                {/* KMP SECTION */}
                {/* <section className={styles.section2}>
            <h2 className={styles.sectionHeading}>KMP-Specific Details</h2>
            <div className={styles.kmpContainer}>
              <div className={styles.kmpItem}>
                <label>KMP Category</label>
                <p>Managing Director</p>
              </div>
              <div className={styles.kmpItem}>
                <label>Present Occupation</label>
                <p>Managing Director</p>
              </div>
              <div className={styles.kmpItem}>
                <label>Role in Organization</label>
                <p>Strategic leadership and overall management</p>
              </div>
              <div className={styles.kmpItem}>
                <label>Reporting To</label>
                <p>Board of Directors</p>
              </div>
              <div className={`${styles.kmpItem} ${styles.kmpFull}`}>
                <label>Key Responsibility</label>
                <p>
                  Overall strategic direction, business expansion, and
                  stakeholder management
                </p>
              </div>
            </div>
          </section> */}

                {/* REGULATORY GROUP HEADER */}
                <div className={styles.regulatoryHeader}>
                  Regulatory, Banking & Reputation Check — Individual
                </div>

                {/* DYNAMIC SECTIONS */}
                {regulatoryData.map((section, index) => (
                  <section key={index} className={styles.checkContainer}>
                    <div className={styles.checkTitle}>{section.title}</div>
                    <div className={styles.cardFrame}>
                      <table
                        className={`${styles.dataTable} ${styles[section.tableKey] || ""
                          }`}
                      >
                        <thead>
                          <tr>
                            {section.headers.map((header) => (
                              <th key={header}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.length > 0 ? (
                            section.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {Object.values(row).map((cell, cellIndex) => (
                                  <td key={cellIndex}>{renderCellContent(cell)}</td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={section.headers.length} style={{ textAlign: "center", padding: "20px" }}>
                                Data not available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))}

                {/* CAREER TIMELINE */}
                <section className={styles.section}>
                  <h2 className={styles.sectionHeading}>Career Timeline</h2>
                  <div className={styles.timeline}>
                        {selectedDirector.details?.career_timeline?.length > 0 ? (
                          [...(selectedDirector.details?.career_timeline || [])]
                            .sort((a, b) => {
                              // Prioritize Active status
                              if (a.status === "Active" && b.status !== "Active") return -1;
                              if (a.status !== "Active" && b.status === "Active") return 1;

                              const dateA = parseTimelineDate(a.appointment_date);
                              const dateB = parseTimelineDate(b.appointment_date);
                              if (dateA.getTime() === dateB.getTime()) {
                                // If dates are same, sort by cessation date descending
                                return parseTimelineDate(b.cessation_date) - parseTimelineDate(a.cessation_date);
                              }
                              return dateB - dateA;
                            })
                            .map((item, idx) => {
                              let cleanTenure = (item.tenure && item.tenure !== "N/A")
                                ? item.tenure.replace(/,/g, "")
                                : calculateTenure(item.appointment_date, item.cessation_date, item.status);

                              return (
                                <TimelineItem
                                  key={idx}
                                  date={`${item.appointment_date || "-"} - ${item.status === "Active" ? "Present" : (item.cessation_date || "-")}`}
                                  name={item.company_name || "-"}
                                  role={`${item.designation || "-"} • ${cleanTenure}`}
                                  active={item.status === "Active"}
                                />
                              );
                            })
                        ) : (
                      <p style={{ textAlign: "center", width: "100%", padding: "20px", color: "#666" }}>
                        Data not available.
                      </p>
                    )}
                  </div>
                </section>

                {/* QUALIFICATIONS SECTION */}
                <section className={styles.section}>
                  <h2 className={styles.sectionHeading}>Qualifications</h2>
                  <div className={styles.qualList}>
                    {selectedDirector.details?.qualifications?.length > 0 ? (
                      selectedDirector.details.qualifications.map((item, idx) => (
                        <QualificationItem
                          key={idx}
                          icon={item.icon || "/images/placeholder.svg"}
                          title={item.title || "-"}
                          inst={item.inst || "-"}
                          spec={item.spec || "-"}
                          year={`${item.yearfrom || "-"} - ${item.yearto || "-"}`}
                        />
                      ))
                    ) : (
                      <p style={{ textAlign: "center", width: "100%", padding: "20px", color: "#666" }}>
                        Data not available.
                      </p>
                    )}

                  </div>
                </section>

                {/* DIRECTORS & LEADERSHIP NEWS SECTION */}
                <section className={styles.section}>
                  <h2 className={styles.sectionHeading}>Directors & Leadership News</h2>
                  <div className={styles.newsList}>
                    {directorNewsList.length > 0 ? (
                      <>
                        {directorNewsList.map((item, idx) => (
                          <DirectorNewsItem
                            key={idx}
                            news={item}
                            isExpanded={expandedNewsIds[idx]}
                            onToggle={() => toggleNewsExpand(idx)}
                            onShare={handleShare}
                          />
                        ))}
                        {hasMoreNews && (
                          <div className={styles.loadMoreWrapper}>
                            <button
                              className={styles.loadMoreBtn}
                              onClick={fetchMoreNews}
                              disabled={newsLoading}
                            >
                              {newsLoading ? "Loading..." : "Load More"}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p style={{ textAlign: "center", width: "100%", padding: "20px", color: "#666" }}>
                        Data not available.
                      </p>
                    )}
                  </div>
                </section>
              </>
            ) : (
              <div className={styles.mainNoData}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="17" y1="8" x2="23" y2="14" />
                  <line x1="23" y1="8" x2="17" y2="14" />
                </svg>
                <h2>Data not available.</h2>
                <p>There are no {directorTab} Directors or KMPs found for this company.</p>
              </div>
            )}
          </main>
        </div>
      </>

    </div>
  );
}

/* Helper Components to keep JSX clean */
function QualificationItem({ icon, title, inst, spec, year }) {
  return (
    <div className={styles.qualItem}>
      <div className={styles.qualIconWrapper}>
        <img src={icon} alt="" />
      </div>
      <div className={styles.qualContent}>
        <h3 className={styles.qualTitle}>{title}</h3>
        <p className={styles.qualInst}>{inst}</p>
        {(spec || year) && (
          <div className={styles.qualMeta}>
            {spec && (
              <>
                <span className={styles.qualSpecLabel}>Specialization:</span>
                <span className={styles.specTag}>{spec}</span>
              </>
            )}

          </div>
        )}
        {year && <span className={styles.qualYear}>{year}</span>}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className={styles.infoBlock}>
      <label>{label}</label>
      <p>{value}</p>
    </div>
  );
}

function AssociationRow({ name, role, type, period, date, image }) {
  return (
    <tr>
      <td>
        <div className={styles.companyRow}>
          <div className={styles.companyIconWrapper}>
            <img
              src={image || "/icons/company-icon.svg"}
              className={styles.companyIcon}
              alt=""
            />
          </div>

          {name}
        </div>
      </td>
      <td>{role}</td>
      {type && (
        <td>
          <span className={styles.typeTag}>{type}</span>
        </td>
      )}
      {period && <td>{period}</td>}
      <td>{date}</td>
    </tr>
  );
}

function TimelineItem({ date, name, role, active }) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineDate}>{date}</div>
      <div className={styles.timelineMarker}>
        <div className={styles.timelineDotWrapper}>
          <div
            className={active ? styles.timelineDot : styles.timelineDotInactive}
          ></div>
        </div>

        <div className={styles.timelineLine}></div>
      </div>
      <div className={styles.timelineContent}>
        <div className={styles.timelineName}>{name}</div>
        <div className={styles.timelineRole}>
          <span>{role.split("•")[0].trim()}</span>
          <span className={styles.roleDot}></span>
          <span>{role.split("•")[1]?.trim()}</span>
        </div>
      </div>
      {active && (
        <div className={`${styles.activeTag} ${styles.statusBadge}`}>
          Active
        </div>

      )}

    </div>
  );
}

function DirectorNewsItem({ news, isExpanded, onToggle, onShare }) {
  return (
    <div className={styles.newsCard}>
      <div className={styles.newsImageContainer}>
        <img
          src={(news.image_url && news.image_url !== "-") ? news.image_url : '/icons/Image.svg'}
          alt={news.title || "-"}
          className={styles.newsImage}
        />
      </div>
      <div className={styles.newsContent}>
        <div className={styles.newsHeader}>
          <div className={styles.newsTitleRow}>
            {/* <div className={`${styles.newsStatusDot} ${styles[news.status]}`}></div> */}
            <h3 className={styles.newsTitle}>{news.title || "-"}</h3>
          </div>
        </div>

        <div className={styles.newsDescriptionContainer}>
          <p className={`${styles.newsDescription} ${!isExpanded ? styles.newsClamped : ""}`}>
            {news.description || "-"}
          </p>
          {!isExpanded && news.description?.length > 100 && (
            <span className={styles.newsShowMoreInline} onClick={onToggle}>
              ... Show More
            </span>
          )}
          {isExpanded && (
            <span className={styles.newsShowLess} onClick={onToggle}>
              Show Less
            </span>
          )}
        </div>

        <div className={styles.newsFooter}>
          <div className={styles.newsFooterItem}>
            <img src="/icons/footer_calender.svg" alt="date" className={styles.newsFooterIcon} />
            <span>{news.date || "-"}</span>
          </div>
          <div className={styles.newsFooterItem}>
            <img src="/globe.svg" alt="source" className={styles.newsFooterIcon} />
            <span>{news.source || "-"}</span>
          </div>
          {news.category && (
            <div className={styles.newsTag}>
              {news.category || "-"}
            </div>
          )}
        </div>
      </div>
      <div className={styles.newsCardActions}>
        {news.external_url && (
          <a href={news.external_url} target="_blank" rel="noopener noreferrer">
            <img src="/viewsourceIcon.svg" alt="view-source" className={styles.newsActionIcon} />
          </a>
        )}
        {news.share_url && (
          <div onClick={() => onShare(news.title, news.share_url)} style={{ cursor: 'pointer' }}>
            <img src="/iconShare.svg" alt="share" className={styles.newsActionIcon} />
          </div>
        )}
      </div>
    </div>
  );
}
