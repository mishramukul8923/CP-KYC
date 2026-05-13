"use client";
import styles from "./CompanyDatabase.module.css";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import RowsPerPage from "@/components/common/RowsPerPage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomCalendar from "@/components/common/CustomCalendar";
import tailwind from "tailwindcss";

export default function CompanyDatabase() {
  const bulkRef = useRef(null);
  const headerCheckboxRef = useRef(null);
  const dateInputRef = useRef(null);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkDirection, setBulkDirection] = useState("down");

  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRows, setSelectedRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("Public");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const calendarRef = useRef(null);
  const classRef = useRef(null);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "market_cap", direction: "desc" });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };





  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params = new URLSearchParams({
          page: currentPage,
          per_page: rowsPerPage,
          company_name: searchQuery,
          company_status: statusFilter,
        });

        if (classFilter) {
          params.append("company_class", classFilter);
        }

        if (sortConfig.key && sortConfig.direction) {
          params.append("sort_by", sortConfig.key);
          params.append("sort_order", sortConfig.direction);
        }

        if (formattedStartDate) {
          params.append("inc_from_date", formattedStartDate);
          params.append("inc_to_date", formattedEndDate || formattedStartDate); // Assuming single date acts as start/end for now
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies?${params.toString()}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const result = await res.json();

        if (result && Array.isArray(result.items)) {
          setCompanies(result.items);
          setTotalCompanies(result.total || result.items.length);
          setTotalPages(result.pages || Math.ceil((result.total || result.items.length) / rowsPerPage));
        } else if (Array.isArray(result)) {
          setCompanies(result);
          setTotalCompanies(result.length);
          setTotalPages(Math.ceil(result.length / rowsPerPage));
        } else {
          setCompanies([]);
          setTotalCompanies(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.log("Error fetching companies:", error);
        setCompanies([]);
        setTotalCompanies(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [rowsPerPage, currentPage, searchQuery, sortConfig, statusFilter, classFilter, startDate, endDate]);

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
    setCurrentPage(1); // Reset to first page on sort
  };

  const statusRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!bulkRef.current?.contains(e.target)) {
        setBulkOpen(false);
      }
      if (!statusRef.current?.contains(e.target)) {
        setIsStatusOpen(false);
      }
      if (!classRef.current?.contains(e.target)) {
        setIsClassOpen(false);
      }
      if (!calendarRef.current?.contains(e.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Search filter (keep for client-side search if needed, but primary is server-side)
  const filteredData = companies; // Now server-side filtered

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage, statusFilter, classFilter, startDate, endDate]);

  // Basic client-side filtering and slicing as a fallback/secondary filter
  const visibleData = filteredData;

  const allChecked = selectedRows.length === visibleData.length;
  const someChecked = selectedRows.length > 0 && !allChecked;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

  const handleSelectAll = () => {
    if (allChecked) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleData.map((_, i) => i));
    }
  };

  const handleRowSelect = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const toggleBulk = () => {
    if (!bulkRef.current) return;

    const rect = bulkRef.current.getBoundingClientRect();
    const dropdownHeight = 140;
    const spaceBelow = window.innerHeight - rect.bottom;

    setBulkDirection(spaceBelow > dropdownHeight ? "down" : "up");
    setBulkOpen((prev) => !prev);
  };

  const toggleStatus = () => {
    setIsStatusOpen((prev) => !prev);
  };

  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setIsStatusOpen(false);
    setCurrentPage(1);
  };

  const toggleClass = () => {
    setIsClassOpen((prev) => !prev);
  };

  const handleClassSelect = (cls) => {
    setClassFilter(cls);
    setIsClassOpen(false);
    setCurrentPage(1);
  };

  const formatAddress = (addr) => {
    if (!addr) return "-";
    const parts = addr.split(',').map(p => p.trim());

    // Filter out parts that are clearly not city/state (pincodes, country names, empty)
    const cleanedParts = parts.filter(p => {
      if (!p) return false;
      const pLower = p.toLowerCase();
      // Matches 6-digit pincode alone or with trailing text like "-India"
      const isPincode = /^\d{6}/.test(p);
      const isCountry = pLower === "india" || pLower === "ind";
      return !isPincode && !isCountry;
    });

    // Take the last two available parts (usually City and State)
    const cityStateParts = cleanedParts.slice(-2);
    if (cityStateParts.length === 0) return "-";

    const rawAddr = cityStateParts.join(", ");
    // Capitalize first letter of each word
    return rawAddr.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Company Database</h1>
      </header>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.leftTools}>
          <div className={styles.searchWrapper}>
            <img src="/icons/search.svg" alt="" className={styles.icon} />
            <input
              type="text"
              placeholder="Search for company name"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            ref={statusRef}
            className={styles.bulkWrapper}
          >
            <div
              className={styles.filterDropdown}
              onClick={toggleStatus}
            >
              <span>{statusFilter || "Status"}</span>
              <img
                src="/icons/chevron-down-dark.svg"
                alt=""
                className={`${styles.chevron} ${isStatusOpen ? styles.rotated : ""}`}
              />
            </div>

            {isStatusOpen && (
              <div className={`${styles.bulkDropdown} ${styles.dropdownDown}`}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleStatusSelect("")}
                >
                  All Status
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleStatusSelect("Active")}
                >
                  Active
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleStatusSelect("Under Liquidation")}
                >
                  Under Liquidation
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleStatusSelect("Under CIRP")}
                >
                  Under CIRP
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleStatusSelect("Inactive for e-filing")}
                >
                  Inactive for e-filing
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleStatusSelect("Dissolved (Liquidated)")}
                >
                  Dissolved (Liquidated)
                </button>
                {/* <button
                  className={styles.dropdownItem}
                  onClick={() => handleStatusSelect("Inactive")}
                >
                  Inactive
                </button> */}
              </div>
            )}
          </div>

          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleIndicator} ${classFilter === "Private" ? styles.indicatorRight : styles.indicatorLeft
                }`}
            />
            <button
              className={`${styles.toggleBtn} ${classFilter === "Public" || classFilter === "" ? styles.activeTab : ""
                }`}
              onClick={() => handleClassSelect("Public")}
            >
              Public
            </button>
            <button
              className={`${styles.toggleBtn} ${classFilter === "Private" ? styles.activeTab : ""
                }`}
              onClick={() => handleClassSelect("Private")}
            >
              Private
            </button>
          </div>

        </div>

        <div className={styles.rightTools}>
          <div ref={calendarRef} className={styles.datePickerWrapper}>
            <div
              className={styles.datePicker}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <img src="/icons/Calender.svg" alt="" className={styles.icon} />
              <span>
                {startDate
                  ? `${new Date(startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}${endDate ? ` - ${new Date(endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}` : ""}`
                  : "Date of incorporation"}
              </span>
              {startDate && (
                <button
                  className={styles.clearDateBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStartDate(null);
                    setEndDate(null);
                    setIsCalendarOpen(false);
                  }}
                  aria-label="Clear date filter"
                >
                  <img src="/icons/close.svg" alt="Clear" className={styles.clearIcon} />
                </button>
              )}
            </div>

            {isCalendarOpen && (
              <div className={styles.popupDateInput}>
                <CustomCalendar
                  initialStartDate={startDate}
                  initialEndDate={endDate}
                  onSelect={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                    if (start && end) {
                      setIsCalendarOpen(false);
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div ref={bulkRef} className={styles.bulkWrapper}>
            <button className={styles.bulkActionBtn} onClick={toggleBulk}>
              Bulk Action
              <img
                src="/icons/chevron-down.svg"
                alt=""
                className={`${styles.chevron} ${bulkOpen ? styles.rotated : ""
                  }`}
              />
            </button>

            {bulkOpen && (
              <div
                className={`${styles.bulkDropdown} ${bulkDirection === "up"
                  ? styles.dropdownUp
                  : styles.dropdownDown
                  }`}
              >
                <button className={styles.dropdownItem}>Export Selected</button>
                {/* <button className={styles.dropdownItem}>
                  Mark as Inactive
                </button> */}
                {/* <button className={styles.dropdownItem}>Delete</button> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxCol}>
                <div className={styles.checkboxOuter}>
                  <label className={styles.checkboxWrapper}>
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      checked={allChecked}
                      onChange={handleSelectAll}
                    />
                    <span className={styles.customCheckbox}></span>
                  </label>
                </div>
              </th>

              <th
                className={styles.sortableHeader}
                onClick={() => handleSort("company_name")}
              >
                <div className={styles.headerContent}>
                  Company Name
                  <img
                    src={sortConfig.key === "company_name"
                      ? (sortConfig.direction === "asc" ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg")
                      : "/icons/chevrons-up-down.svg"}
                    alt=""
                    className={styles.sortIcon}
                  />
                </div>
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort("market_cap")}
              >
                <div className={styles.headerContent}>
                  Market Cap. (Cr.)
                  <img
                    src={sortConfig.key === "market_cap"
                      ? (sortConfig.direction === "asc" ? "/icons/arrow-down.svg" : "/icons/arrow-up.svg")
                      : "/icons/chevrons-up-down.svg"}
                    alt=""
                    className={styles.sortIcon}
                  />
                </div>
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort("paid_up_capital")}
              >
                <div className={styles.headerContent}>
                  PUC/OOC (Cr.)
                  <img
                    src={sortConfig.key === "paid_up_capital"
                      ? (sortConfig.direction === "asc" ? "/icons/arrow-down.svg" : "/icons/arrow-up.svg")
                      : "/icons/chevrons-up-down.svg"}
                    alt=""
                    className={styles.sortIcon}
                  />
                </div>
              </th>
              <th>SOC (Cr.)</th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort("incorporation_date")}
              >
                <div className={styles.headerContent}>
                  DOI
                  <img
                    src={sortConfig.key === "incorporation_date"
                      ? (sortConfig.direction === "asc" ? "/icons/arrow-down.svg" : "/icons/arrow-up.svg")
                      : "/icons/chevrons-up-down.svg"}
                    alt=""
                    className={styles.sortIcon}
                  />
                </div>
              </th>
              <th className={styles.fixedWidthCol}>Location</th>
              <th className={styles.fixedWidthCol}>Industry</th>
              <th>Company Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 20 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  <td className={styles.checkboxCol}>
                    <div className={styles.checkboxOuter}>
                      <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: '16px', height: '16px', borderRadius: '4px' }}></div>
                    </div>
                  </td>
                  <td className={styles.companyCell}>
                    <div className={`${styles.skeleton} ${styles.skeletonCircle}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '150px' }}></div>
                  </td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60px' }}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60px' }}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60px' }}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80px' }}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '120px' }}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100px' }}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonBadge}`}></div></td>
                </tr>
              ))
            ) : visibleData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No companies found
                </td>
              </tr>
            ) : (
              visibleData.map((company, index) => (
                <tr key={index}>
                  <td className={styles.checkboxCol}>
                    <div className={styles.checkboxOuter}>
                      <label className={styles.checkboxWrapper}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(index)}
                          onChange={() => handleRowSelect(index)}
                        />
                        <span className={styles.customCheckbox}></span>
                      </label>
                    </div>
                  </td>

                  <td className={styles.companyCell}>
                    <div className={styles.companyCellWrapper}>
                      <Image
                        src={
                          company.logo_url && company.logo_url !== "-"
                            ? company.logo_url
                            : "/icons/Image.svg"
                        }
                        alt={company.company_name || ""}
                        className={styles.companyIcon}
                        width={32}
                        height={32}
                        unoptimized={true}
                      // priority
                      />
                      <Link href={`/company/${(company.company_name || "").toLowerCase().replace(/\s+/g, "-")}`} className={styles.companyLink}>{company.company_name || "-"}</Link>
                      {company.company_class && company.company_class !== "-" && (
                        <span className={`${styles.companyClassTag} ${company.company_class.toLowerCase() === 'public' ? styles.tagPublic : styles.tagPrivate}`}>
                          {company.company_class}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {company.market_cap
                      ? (company.market_cap)
                      : "-"}
                  </td>
                  <td>
                    {company.paid_up_capital
                      ? (company.paid_up_capital)
                      : "-"}
                  </td>
                  <td>
                    {company.soc
                      ? (Number(company.soc.replace(/,/g, "")) / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "-"}
                  </td>
                  <td>{company.incorporation_date || "-"}</td>
                  <td className={styles.fixedWidthCol}>
                    <div className={styles.hiddenScroll}>
                      {formatAddress(company.registered_address)}
                    </div>
                  </td>
                  <td className={styles.fixedWidthCol}>
                    <div className={styles.hiddenScroll}>
                      {company.industry || "-"}
                    </div>
                  </td>
                  <td>
                    <span className={styles.statusBadge}>
                      {company.company_status || "-"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.mutedText}>
            Loaded:{" "}
            <span className={styles.boldText}>
              {visibleData.length} Companies
            </span>
          </span>

          <span className={styles.separator}>|</span>

          <span className={styles.mutedText}>
            Found:{" "}
            <span className={styles.boldText}>
              {totalCompanies} Companies
            </span>
          </span>
        </div>

        <div className={styles.footerRight}>
          <div className={styles.paginationControls}>
            <div className={styles.rowsPerPage}>
              <span className={styles.rowsPerPageText}>Rows per page</span>
              <RowsPerPage
                value={rowsPerPage}
                options={[20, 50, 100]}
                onChange={(val) => {
                  setRowsPerPage(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            <span className={styles.pageLabel}>
              Page {currentPage} of {totalPages || 1}
            </span>

            <div className={styles.navButtons}>
              <button
                className={
                  currentPage === 1 ? styles.navBtnDisabled : styles.navBtn
                }
                onClick={goToFirstPage}
              >
                <img src="/icons/chevrons-left.svg" className={styles.navIcon} />
              </button>

              <button
                className={
                  currentPage === 1 ? styles.navBtnDisabled : styles.navBtn
                }
                onClick={goToPrevPage}
              >
                <img src="/icons/chevron-left.svg" className={styles.navIcon} />
              </button>

              <button
                className={
                  currentPage === totalPages
                    ? styles.navBtnDisabled
                    : styles.navBtn
                }
                onClick={goToNextPage}
              >
                <img
                  src="/icons/chevron-right-black.svg"
                  className={styles.navIcon}
                />
              </button>

              <button
                className={
                  currentPage === totalPages
                    ? styles.navBtnDisabled
                    : styles.navBtn
                }
                onClick={goToLastPage}
              >
                <img src="/icons/chevrons-right.svg" className={styles.navIcon} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}