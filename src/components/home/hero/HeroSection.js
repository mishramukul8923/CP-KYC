"use client";

import { useRouter } from "next/navigation";
import styles from "./HeroSection.module.css";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const searchInputRef = useRef(null);

  const suggestionRefs = useRef([]);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleSearch = () => {
    const query = companyName.trim();
    if (!query) return;

    router.push(`/company/${encodeURIComponent(query)}`);
  };

  // Dynamic Suggestions Fetching
  useEffect(() => {
    if (!companyName.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://cpkycapi.webninjaz.com/api/search/suggestions?q=${encodeURIComponent(companyName)}&limit=40`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : ""
          }
        });
        const result = await res.json();
        if (Array.isArray(result?.suggestions)) {
          setSuggestions(result.suggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [companyName]);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeIndex].name);
      }
    }
  };

  const handleInputChange = (value) => {
    setCompanyName(value);
    setActiveIndex(-1);
  };

  const handleSuggestionClick = (name) => {
    setCompanyName(name);
    setShowSuggestions(false);

    router.push(`/company/${name.replaceAll(" ", "-").toLowerCase()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.searchContainerr}`)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("companySearch")?.toString().trim();

    if (!query) return;

    setShowSuggestions(false);

    // If there are suggestions, select the first one automatically
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].name);
      return;
    }

    router.push(`/company/${query.replaceAll(" ", "-").toLowerCase()}`);
  };

  // ⭐ AUTO SCROLL TO ACTIVE ITEM
  useEffect(() => {
    if (activeIndex >= 0 && suggestionRefs.current[activeIndex]) {
      suggestionRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.textWrapper}>
          <h1 className={styles.title}>
            Know who you’re dealing with — before you decide
          </h1>

          <p className={styles.subtitle}>
            Comprehensive company KYC with ownership, control, financial health,
            and compliance insights
          </p>
        </div>

        <div className={styles.searchOuter}>
          <form className={styles.searchContainer} onSubmit={handleSubmit}>
            <div className={styles.searchIcon}>
              <div className={styles.squareIcon}>
                <img
                  src="/icons/company.svg"
                  alt="Company Icon"
                  className={styles.iconImg}
                />
              </div>
            </div>

            <input
              name="companySearch"
              ref={searchInputRef}
              type="text"
              placeholder="Search by company name, CIN, LLPIN, or director name"
              className={styles.input}
              value={companyName}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button type="submit" className={styles.searchBtn}>
              <span className={styles.arrowUp}>
                <img
                  src="/icons/arrow-up.svg"
                  alt="Search"
                  className={styles.arrowImg}
                />
              </span>
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestionBox}>
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => (suggestionRefs.current[index] = el)}
                  className={`${styles.suggestionItem} ${index === activeIndex ? styles.activeSuggestion : ""
                    }`}
                  onClick={() => handleSuggestionClick(item.name)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.gridOverlay}></div>
    </section>
  );
}