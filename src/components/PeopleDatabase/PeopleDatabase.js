"use client";
import React from "react";
import styles from "./PeopleDatabase.module.css";
import { useState, useRef, useEffect } from "react";
import RowsPerPage from "@/components/common/RowsPerPage";

export default function PeopleDatabase({ onRowClick }) {
  const headerCheckboxRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPeople, setTotalPeople] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const cleanCompanyName = (name) => {
    if (typeof name !== "string") return name;
    // Check if it's a Python-style dict string: {'type': 'string', 'value': '...'}
    const match = name.match(/\{['"]type['"]:\s*['"]string['"],\s*['"]value['"]:\s*['"](.*?)['"]\}/);
    if (match && match[1]) {
      return match[1];
    }
    return name;
  };

  const getCleanDisplay = (companies, originalDisplay) => {
    if (!companies || companies.length === 0) return originalDisplay || "-";

    const cleaned = [...new Set(companies.map(cleanCompanyName))];
    if (cleaned.length === 0) return "-";

    if (cleaned.length === 1) return cleaned[0];
    if (cleaned.length === 2) return `${cleaned[0]}, ${cleaned[1]}`;
    return `${cleaned[0]}, ${cleaned[1]} +${cleaned.length - 2} more`;
  };

  const fetchPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const url = `https://cpkycapi.webninjaz.com/api/people-database?q=${encodeURIComponent(
        searchQuery
      )}&page=${currentPage}&per_page=${rowsPerPage}`;
      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch people data");
      const data = await response.json();

      const processedItems = (data.items || []).map(item => ({
        ...item,
        current: getCleanDisplay(item.current_companies, item.current_companies_display),
        previous: getCleanDisplay(item.previous_companies, item.previous_companies_display)
      }));

      setPeople(processedItems);
      setTotalPeople(data.total || 0);
      setTotalPages(data.pages || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPeople();
    }); // debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, rowsPerPage]);

  const allChecked = selectedRows.length > 0 && selectedRows.length === people.length;
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
      setSelectedRows(people.map((_, i) => i));
    }
  };

  const handleRowSelect = (e, index) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>People Database</h1>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <img src="/icons/search.svg" alt="" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search Din/Pan E.g. Din no, Pan number"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
            />
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
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
                  <th>Name</th>
                  <th>Location</th>
                  <th>Current Companies</th>
                  <th>Previous Companies</th>
                  <th>Sector</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                      <td className={styles.checkboxCol}>
                        <div className={`${styles.skeleton} ${styles.skeletonCheckbox}`}></div>
                      </td>
                      <td className={styles.nameCell}>
                        <div className={`${styles.skeleton} ${styles.skeletonAvatar}`}></div>
                        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "120px" }}></div>
                      </td>
                      <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                      <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                      <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                      <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="6" className={styles.errorCell}>
                      {error}
                    </td>
                  </tr>
                ) : people.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.noDataCell}>
                      No people found.
                    </td>
                  </tr>
                ) : (
                  people.map((person, index) => (
                    <tr
                      key={index}
                      onClick={() => onRowClick && onRowClick(person)}
                      className={styles.clickableRow}
                    >
                      <td className={styles.checkboxCol}>
                        <div className={styles.checkboxOuter}>
                          <label className={styles.checkboxWrapper}>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(index)}
                              onChange={(e) => handleRowSelect(e, index)}
                            />
                            <span className={styles.customCheckbox}></span>
                          </label>
                        </div>
                      </td>
                      <td className={styles.nameCell}>
                        <img
                          src={
                            person.profile_image && person.profile_image !== "-"
                              ? person.profile_image
                              : "/icons/profile-icon.svg"
                          }
                          alt=""
                          className={styles.avatar}
                        />
                        <span>{person.name}</span>
                      </td>
                      <td>{person.location}</td>
                      <td>{person.current}</td>
                      <td>{person.previous}</td>
                      <td>{person.sector}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.mutedText}>
              Loaded:{" "}
              <span className={styles.boldText}>
                {people.length} People
              </span>
            </span>
            <span className={styles.separator}>|</span>
            <span className={styles.mutedText}>
              Found: <span className={styles.boldText}>{totalPeople} People</span>
            </span>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.paginationControls}>
              <div className={styles.rowsPerPage}>
                <span className={styles.rowsPerPageText}>Rows per page</span>
                <RowsPerPage
                  value={rowsPerPage}
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
                  className={currentPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                >
                  <img src="/icons/chevrons-left.svg" alt="First page" />
                </button>
                <button
                  className={currentPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <img src="/icons/chevron-left.svg" alt="Prev page" />
                </button>
                <button
                  className={currentPage === totalPages || totalPages === 0 ? styles.navBtnDisabled : styles.navBtn}
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <img src="/icons/chevron-right-black.svg" alt="Next page" />
                </button>
                <button
                  className={currentPage === totalPages || totalPages === 0 ? styles.navBtnDisabled : styles.navBtn}
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(totalPages)}
                >
                  <img src="/icons/chevrons-right.svg" alt="Last page" />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
