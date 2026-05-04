"use client";

import React, { useRef, useEffect, useState } from "react";
import styles from "./RowsPerPage.module.css";

export default function RowsPerPage({ openTop, value, onChange, options = [10, 20, 50, 100] }) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState("down"); // down | up
  const wrapperRef = useRef(null);

  const toggle = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const dropdownHeight = 160; // approx dropdown height
    const spaceBelow = window.innerHeight - rect.bottom;

    setDirection(spaceBelow > dropdownHeight ? "down" : "up");
    setOpen((prev) => !prev);
  };

  // close on outside click
  useEffect(() => {
    const close = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.rowsWrapper}>
      {/* Trigger */}
      <div className={styles.pageSizeControl} onClick={toggle}>
        <span className={styles.pageSizeValue}>{value}</span>
        <img src="/icons/chevrons-up-down.svg" alt="" />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`${styles.rowsDropdown} ${
            direction === "up" ? styles.dropdownUp : styles.dropdownDown
          }
          ${openTop ? styles.openOntop : ""}
          `}
        >
          {options.map((val) => (
            <button
              key={val}
              className={styles.rowsOption}
              onClick={() => {
                onChange(val);
                setOpen(false);
              }}
            >
              {val}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
