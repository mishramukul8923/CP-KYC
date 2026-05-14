"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "../components/company/newLayout/CompanyNewLayout.module.css";
import { CompanySectionProvider } from "@/components/company/context/CompanySectionContext";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import VersionHistory from "@/components/company/versionHistory/VersionHistory";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);

  const [activeTab, setActiveTab] = useState("home");
  const [companyName, setCompanyName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionBoxRef = useRef(null);
  const suggestionRefs = useRef([]);

  /* DYNAMIC SUGGESTIONS FETCHING */
  useEffect(() => {
    if (isAuthPage || !companyName.trim()) {
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
  }, [companyName, isAuthPage]);

  /* ROUTE CHANGE LOGIC */

  useEffect(() => {
    if (!pathname.startsWith("/company/")) {
      setCompanyName("");
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
      suggestionRefs.current = [];
    } else {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }, [pathname]);

  /* SCROLL ACTIVE SUGGESTION */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        // Handle both { user: ... } and direct user object formats
        setUser(parsed.user || parsed);
      } catch (e) {
        setUser(null);
      }
    }
  }, [pathname]);

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Clear cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    setUser(null);
    setShowUserDropdown(false);
    router.push("/login");
  }, [router]);

  // Global 401 interceptor
  useEffect(() => {
    const originalFetch = window.fetch;
    let isRedirecting = false;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (response.status === 401 && !isRedirecting) {
          const url = args[0] instanceof Request ? args[0].url : args[0];
          const isInternalApi = typeof url === 'string' && (url.includes(process.env.NEXT_PUBLIC_API_BASE_URL) || url.startsWith("/"));
          const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(window.location.pathname);

          if (isInternalApi && !isAuthPage) {
            isRedirecting = true;
            handleLogout();
            toast.error("Session expired. Please login again.");
          }
        }
        return response;
      } catch (error) {
        console.error("Fetch Interceptor Error:", error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [handleLogout]);

  const getUserInitials = (email) => {
    if (!email) return "??";
    const namePart = email.split("@")[0];
    const lettersOnly = namePart.replace(/[^a-zA-Z]/g, "");
    if (lettersOnly.length >= 2) {
      return lettersOnly.substring(0, 2).toUpperCase();
    }
    return namePart.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const container = suggestionBoxRef.current;
    const activeItem = suggestionRefs.current[activeIndex];

    if (!container || !activeItem) return;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    const itemTop = activeItem.offsetTop;
    const itemBottom = itemTop + activeItem.offsetHeight;

    if (itemBottom > containerBottom) {
      container.scrollTo({
        top: itemBottom - container.clientHeight,
        behavior: "smooth",
      });
    }

    if (itemTop < containerTop) {
      container.scrollTo({
        top: itemTop,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  /* KEYBOARD NAVIGATION */

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

  /* INPUT CHANGE */

  const handleInputChange = (value) => {
    setCompanyName(value);
    setActiveIndex(-1);
  };

  /* CLICK SUGGESTION */

  const handleSuggestionClick = (name) => {
    setCompanyName(name);
    setShowSuggestions(false);

    router.push(`/company/${name.replaceAll(" ", "-").toLowerCase()}`);
  };

  /* FORM SUBMIT */

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

  /* SIDEBAR ACTIVE TAB */

  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home");
    } else if (pathname.startsWith("/companies")) {
      setActiveTab("company");
    } else if (pathname.startsWith("/people")) {
      setActiveTab("profile");
    }
  }, [pathname]);

  const handleNav = (tab, path) => {
    router.push(path);
  };

  /* CMD / CTRL + K FOCUS SEARCH */

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");

      if (
        (isMac && e.metaKey && e.key.toLowerCase() === "k") ||
        (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* CLOSE SUGGESTIONS ON OUTSIDE CLICK */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.searchContainerr}`)) {
        setShowSuggestions(false);
      }
      if (!e.target.closest(`.${styles.userSection}`)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* DISABLE INSPECT AND RIGHT CLICK IN PRODUCTION */
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Disable F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+I / Cmd+Option+I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+C / Cmd+Option+C (Elements)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+K / Cmd+Option+K (Firefox Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "K" || e.key === "k")) {
        e.preventDefault();
      }
      // Disable Ctrl+U / Cmd+Option+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
      }
      // Disable Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
      }
      // Disable Ctrl+P / Cmd+P (Print Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
      }
      // Disable Shift+F10 (Context Menu)
      if (e.shiftKey && e.key === "F10") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* AGGRESSIVE DEVTOOLS PROTECTION (PRODUCTION ONLY) */
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const interval = setInterval(() => {
      (function () {
        try {
          (function (function_constructor) {
            if (function_constructor) {
              (function_constructor('debugger')());
            }
          })(Function('return this')().constructor('debugger'));
        } catch (e) { }
      })();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable}`}>
        <Suspense fallback={null}>
          <CompanySectionProvider>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  maxWidth: '400px',
                  fontSize: '14px',
                },
              }}
            />
            <div className={styles.layoutContainer}>

              {!isAuthPage && (
                <header className={styles.header}>
                  <div className={styles.headerLeft}>
                    <Link href="/">
                      <img
                        src="/companyWikiLogo.svg"
                        alt="Corporate Professionals"
                        className={styles.logo}
                      />
                    </Link>

                    <div className={styles.divider} />

                    <div className={styles.searchContainerr}>
                      <form
                        className={`${styles.searchContainer} ${styles.headerSearch}`}
                        onSubmit={handleSubmit}
                      >
                        <img src="/icons/search.svg" alt="" className={styles.searchIcon} />

                        <input
                          name="companySearch"
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search by company name, CIN, LLPIN, or director name"
                          className={styles.searchInput}
                          value={companyName}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />

                        <div className={styles.shortcut}>⌘ K</div>
                      </form>

                      {showSuggestions && suggestions.length > 0 && (
                        <div ref={suggestionBoxRef} className={styles.suggestionBox}>
                          {suggestions.map((item, index) => (
                            <div
                              key={index}
                              ref={(el) => (suggestionRefs.current[index] = el)}
                              className={`${styles.suggestionItem} ${index === activeIndex ? styles.activeSuggestion : ""
                                }`}
                              onClick={() =>
                                handleSuggestionClick(item.name)
                              }
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.headerRight}>
                    {user ? (
                      <div className={styles.userSection} onClick={() => setShowUserDropdown(!showUserDropdown)}>
                        <div className={styles.avatarWrapper}>
                          <div className={styles.avatarText}>{getUserInitials(user.email)}</div>
                        </div>
                        {showUserDropdown && (
                          <div className={styles.userDropdown}>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link href="/login" className={styles.loginBtn}>
                        Login
                      </Link>
                    )}
                  </div>
                </header>
              )}

              {isAuthPage ? (
                <main>{children}</main>
              ) : (
                <div className={styles.mainWrapper}>
                  <aside className={styles.sidebar}>
                    <div className={styles.sidebarIcons}>
                      <button
                        type="button"
                        className={`${styles.iconTab} ${activeTab === "home" ? styles.activeTab : ""
                          }`}
                        onClick={() => handleNav("home", "/")}
                      >
                        <img src="/icons/home-icon.svg" alt="Home" />
                        <span className={styles.tooltip}>Home</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.iconTab} ${activeTab === "company" ? styles.activeTab : ""
                          }`}
                        onClick={() => handleNav("company", "/companies")}
                      >
                        <img src="/icons/company-icon.svg" alt="Companies" />
                        <span className={styles.tooltip}>Companies Database</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.iconTab} ${activeTab === "profile" ? styles.activeTab : ""
                          }`}
                        onClick={() => handleNav("profile", "/people")}
                      >
                        <img src="/icons/profile-icon.svg" alt="People" />
                        <span className={styles.tooltip}>People Database</span>
                      </button>
                    </div>
                  </aside>

                  <main className={styles.contentArea}>{children}</main>
                  <VersionHistory />
                </div>
              )}
            </div>
          </CompanySectionProvider>
        </Suspense>
      </body>
    </html>
  );
}
