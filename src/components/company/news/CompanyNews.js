"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./CompanyNews.module.css";
import { ChevronRight, FileText, ExternalLink, Share2 } from "lucide-react";
import CustomCalendar from "../../common/CustomCalendar";
import ShareModal from "../modals/ShareModal";


const CompanyNews = ({ companyName }) => {
    const [news, setNews] = useState([]);
    const [totalNews, setTotalNews] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(!!companyName);
    const [hasFetched, setHasFetched] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [apiInfo, setApiInfo] = useState({ source: "-", lastUpdated: "-" });

    const [expandedIds, setExpandedIds] = useState({});
    const [overflowingIds, setOverflowingIds] = useState({});
    const descriptionRefs = useRef([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [currentShareLink, setCurrentShareLink] = useState("");
    const calendarRef = useRef(null);
    const [activeTab, setActiveTab] = useState("news");
    const [activeFilter, setActiveFilter] = useState("All");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [announcements, setAnnouncements] = useState([]);
    const [announcementCategories, setAnnouncementCategories] = useState(["All"]);
    const [announcementsTotal, setAnnouncementsTotal] = useState(0);
    const [announcementsPage, setAnnouncementsPage] = useState(1);
    const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(false);
    const [hasAnnouncementsFetched, setHasAnnouncementsFetched] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState(false);

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    function timeAgo(dateString) {
        if (!dateString || dateString === "-") return "-";
        const now = new Date();
        const past = new Date(dateString);

        // Check if date is valid
        if (isNaN(past.getTime())) return dateString;

        const diff = now - past;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);  // Approximate
        const years = Math.floor(days / 365); // Approximate

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };

        if (isCalendarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCalendarOpen]);

    const fetchNews = async (pageNum = 1, shouldAppend = false) => {
        if (!companyName || companyName === "undefined") {
            setIsLoading(false);
            setHasFetched(true);
            return;
        }
        const fetchId = `NewsFetch-${pageNum}-${Date.now()}`;
        try {
            setIsLoading(true);
            console.time(fetchId);
            const formatDate = (date) => {
                if (!date) return "";
                const d = new Date(date);
                return d.toISOString().split('T')[0];
            };

            const dateFrom = formatDate(startDate);
            const dateTo = formatDate(endDate);

            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/news?page=${pageNum}&size=5`;

            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (dateFrom) url += `&date_from=${dateFrom}`;
            if (dateTo) url += `&date_to=${dateTo}`;

            const token = localStorage.getItem("token");

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                cache: "no-store"
            });
            if (!response.ok) throw new Error("Failed to fetch news");

            const data = await response.json();

            if (shouldAppend) {
                setNews(prev => [...prev, ...(data.news || [])]);
            } else {
                setNews(data.news || []);
                setPage(1);
            }

            setTotalNews(data.total || 0);
        } catch (error) {
            console.error("News API Error:", error);
        } finally {
            console.timeEnd(fetchId);
            setIsLoading(false);
            setHasFetched(true);
        }
    };

    const fetchAnnouncements = async (pageNum = 1, shouldAppend = false) => {
        if (!companyName || companyName === "undefined") {
            setIsAnnouncementsLoading(false);
            setHasAnnouncementsFetched(true);
            return;
        }
        const fetchId = `AnnouncementsFetch-${pageNum}-${Date.now()}`;
        try {
            setIsAnnouncementsLoading(true);
            console.time(fetchId);
            const formatDate = (date) => {
                if (!date) return "";
                const d = new Date(date);
                return d.toISOString().split('T')[0];
            };

            const dateFrom = formatDate(startDate);
            const dateTo = formatDate(endDate);

            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/announcements?page=${pageNum}&per_page=5`;

            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (dateFrom) url += `&from_date=${dateFrom}`;
            if (dateTo) url += `&to_date=${dateTo}`;
            if (activeFilter && activeFilter !== "All") url += `&category=${encodeURIComponent(activeFilter)}`;

            const token = localStorage.getItem("token");

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                cache: "no-store"
            });
            if (!response.ok) throw new Error("Failed to fetch announcements");

            const data = await response.json();

            if (shouldAppend) {
                setAnnouncements(prev => [...prev, ...(data.announcements?.items || [])]);
            } else {
                setAnnouncements(data.announcements?.items || []);
                setAnnouncementsPage(1);
            }

            setAnnouncementsTotal(data.announcements?.total || 0);

            if (!shouldAppend && data.categories) {
                setAnnouncementCategories(["All", ...data.categories]);
            }
        } catch (error) {
            console.error("Announcements API Error:", error);
        } finally {
            console.timeEnd(fetchId);
            setIsAnnouncementsLoading(false);
            setHasAnnouncementsFetched(true);
        }
    };

    // Initial load and filter changes
    useEffect(() => {
        if (activeTab === "news") {
            if (!hasFetched && companyName && companyName !== "undefined") {
                fetchNews(1, false);
                return;
            }
            const timer = setTimeout(() => {
                fetchNews(1, false);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            if (!hasAnnouncementsFetched && companyName && companyName !== "undefined") {
                fetchAnnouncements(1, false);
                return;
            }
            const timer = setTimeout(() => {
                fetchAnnouncements(1, false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, startDate, endDate, activeFilter, companyName, activeTab]);

    const handleLoadMore = () => {
        if (activeTab === "news") {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNews(nextPage, true);
        } else {
            const nextPage = announcementsPage + 1;
            setAnnouncementsPage(nextPage);
            fetchAnnouncements(nextPage, true);
        }
    };

    // Detect overflow for "Show More" button
    useEffect(() => {
        const detectOverflow = () => {
            const newOverflowingIds = {};
            descriptionRefs.current.forEach((el, index) => {
                if (el) {
                    // 40px is the height of 2 lines (20px line-height * 2)
                    // We check if the scrollHeight is significantly larger than the clamped height
                    const isOverflowing = el.scrollHeight > 40;
                    if (isOverflowing) {
                        newOverflowingIds[index] = true;
                    }
                }
            });
            setOverflowingIds(newOverflowingIds);
        };

        // Small timeout to ensure DOM is rendered and styles applied
        const timeoutId = setTimeout(detectOverflow, 100);
        return () => clearTimeout(timeoutId);
    }, [news]);

    const handleShare = (link) => {
        setCurrentShareLink(link || "");
        setIsShareModalOpen(true);
    };




    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.titleContainer}>
                        <p className={styles.newsTitle}>{activeTab === "news" ? "Company News" : "Company Announcements"}</p>
                        <p className={styles.subtitle}>
                            {activeTab === "news"
                                ? "Latest updates, announcements, and media coverage"
                                : "Official corporate disclosures, filings, and regulatory announcements"}
                        </p>
                    </div>
                    <div className={styles.rightActions}>
                        <div className={styles.calendarContainer} ref={calendarRef}>
                            <button
                                className={styles.calendarBtn}
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            >
                                <img src="/calendaricon.svg" alt="calendar" className={styles.calendarIcon} />
                                <span className={`${styles.dateLabel} ${!startDate ? styles.placeholder : ""}`}>
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
                                        : "Select Date"}
                                </span>
                                {startDate && (
                                    <div
                                        className={styles.clearDateBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStartDate(null);
                                            setEndDate(null);
                                            setIsCalendarOpen(false);
                                        }}
                                    >
                                        <img src="/icons/close.svg" alt="Clear" className={styles.clearIcon} />
                                    </div>
                                )}
                            </button>
                            {isCalendarOpen && (
                                <div className={styles.popupCalendar}>
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
                        <div className={styles.searchContainer}>
                            <img src="/icons/search.svg" alt="search" className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={activeTab === 'news' ? "Search News..." : "Search Announcements..."}
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className={styles.toggleContainer}>
                            <div className={`${styles.toggleIndicator} ${activeTab === 'announcements' ? styles.indicatorRight : styles.indicatorLeft}`} />
                            <button
                                className={`${styles.toggleBtn} ${activeTab === 'news' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('news')}
                            >
                                Company News
                            </button>
                            <button
                                className={`${styles.toggleBtn} ${activeTab === 'announcements' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('announcements')}
                            >
                                Announcements
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {activeTab === "news" ? (
                <div className={styles.newsList}>
                    {isLoading && news.length === 0 ? (
                        [...Array(3)].map((_, index) => (
                            <div key={index} className={styles.newsCard}>
                                <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
                                <div className={styles.content}>
                                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonDesc}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonDesc}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonFooter}`} />
                                </div>
                            </div>
                        ))
                    ) : (
                        news.map((item, index) => (
                            <div key={index} className={styles.newsCard}>
                                {/* <div className={`${styles.statusDot} ${styles[item.status]}`}></div> */}
                                <div className={styles.imageContainer}>
                                    <img
                                        src={(item.image_url && item.image_url !== "-") ? item.image_url : '/icons/Image.svg'}
                                        alt={item.title || "-"}
                                        className={styles.newsImage}
                                    />
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.newsTitle}>{item.title || "-"}</h3>
                                    <div className={styles.descriptionContainer}>
                                        <div
                                            ref={el => descriptionRefs.current[index] = el}
                                            className={`${styles.description} ${expandedIds[index] ? styles.expanded : styles.clamped}`}
                                            dangerouslySetInnerHTML={{ __html: item.description || "-" }}
                                        />
                                        {!expandedIds[index] && overflowingIds[index] && (
                                            <span
                                                className={styles.showMoreInline}
                                                onClick={() => toggleExpand(index)}
                                            >
                                                Show More
                                            </span>
                                        )}
                                        {expandedIds[index] && (
                                            <span
                                                className={styles.showLess}
                                                onClick={() => toggleExpand(index)}
                                            >
                                                Show Less
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.footer}>
                                        <div className={styles.footerItem}>
                                            <img src="/icons/footer_calender.svg" alt="date" className={styles.footerIcon} />
                                            <span>{timeAgo(item.date)}</span>
                                        </div>
                                        <div className={styles.footerItem}>
                                            <img src="/globe.svg" alt="source" className={styles.footerIcon} />
                                            <span>{item.source || "-"}</span>
                                        </div>
                                        {item.category && (
                                            <div className={styles.tag}>
                                                {item.category || "-"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {(item.external_url || item.share_url) && (
                                    <div className={styles.cardActions}>
                                        {item.external_url && item.external_url !== "-" && (
                                            <a href={item.external_url} target="_blank" rel="noopener noreferrer">
                                                <img src="/viewsourceIcon.svg" alt="view-source" className={styles.actionIcon} />
                                            </a>
                                        )}
                                        {(item.external_url || item.share_url) && (
                                            <div
                                                onClick={() => handleShare(item.external_url || item.share_url)}
                                                className={styles.actionButton}
                                            >
                                                <img src="/iconShare.svg" alt="share" className={styles.actionIcon} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {news.length < totalNews && (
                        <div className={styles.loadMoreWrapper}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={handleLoadMore}
                                disabled={isLoading}
                            >

                                {isLoading ? "Loading..." : "Load More"}
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    )}

                    {news.length === 0 && !isLoading && hasFetched && (
                        <div className={styles.noResults}>No news articles found.</div>
                    )}
                </div>
            ) : (
                <div className={styles.announcementsSection}>
                    <div className={styles.filtersSection}>
                        <div className={`${styles.filtersContainer} ${!expandedCategories ? styles.collapsedFilters : ''}`}>
                            {isAnnouncementsLoading && announcementCategories.length <= 1 ? (
                                [80, 120, 90, 110, 100].map((width, index) => (
                                    <div 
                                        key={index} 
                                        className={styles.skeleton} 
                                        style={{ width: `${width}px`, height: '36px', borderRadius: '100px' }} 
                                    />
                                ))
                            ) : (
                                announcementCategories.map(filter => (
                                    <button
                                        key={filter}
                                        className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ''}`}
                                        onClick={() => setActiveFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))
                            )}
                        </div>
                        {!isAnnouncementsLoading && announcementCategories.length > 5 && (
                            <button
                                className={styles.seeMoreBtn}
                                onClick={() => setExpandedCategories(!expandedCategories)}
                            >
                                {expandedCategories ? "See Less" : "See More"}
                            </button>
                        )}
                    </div>
                    <div className={styles.newsList}>
                        {isAnnouncementsLoading && announcements.length === 0 ? (
                            [...Array(3)].map((_, index) => (
                                <div key={index} className={styles.newsCard}>
                                    <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
                                    <div className={styles.content}>
                                        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                                        <div className={`${styles.skeleton} ${styles.skeletonDesc}`} />
                                        <div className={`${styles.skeleton} ${styles.skeletonDesc}`} />
                                        <div className={`${styles.skeleton} ${styles.skeletonFooter}`} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            announcements.map((item, index) => (
                                <div key={item.id || index} className={styles.announcementCard}>
                                    <div className={styles.announcementHeader}>
                                        <div className={styles.announcementHeaderLeft}>
                                            <span className={styles.announcementId}>{item.scrip_code || "-"}</span>
                                            <div className={styles.idDivider} />
                                            <span className={styles.announcementBadge}>{item.category}</span>
                                        </div>
                                        <div className={styles.announcementHeaderRight}>
                                            {item.pdf_url && item.pdf_url !== "-" && (
                                                <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className={styles.pdfBadge} style={{ textDecoration: 'none' }}>
                                                    <FileText size={14} color="#DC2626" /> PDF
                                                </a>
                                            )}
                                            {item.xbrl_url && item.xbrl_url !== "-" && (
                                                <a href={item.xbrl_url} target="_blank" rel="noopener noreferrer" className={styles.xbrlBadge} style={{ textDecoration: 'none' }}>
                                                    XBRL
                                                </a>
                                            )}
                                            {item.pdf_url && item.pdf_url !== "-" && (
                                                <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className={styles.externalIcon}>
                                                    <ExternalLink size={16} color="#64748B" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.announcementBody}>
                                        <div className={styles.announcementTitleRow}>
                                            <h3 className={styles.announcementTitle}>{item.headline}</h3>
                                            {item.pdf_url && item.pdf_url !== "-" && (
                                                <div className={styles.shareIcon} onClick={(e) => { e.stopPropagation(); handleShare(item.pdf_url); }}>
                                                    <Share2 size={16} color="#64748B" />
                                                </div>
                                            )}
                                        </div>
                                        <p className={styles.announcementDesc}>
                                            {item.description}
                                            {item.pdf_url && item.pdf_url !== "-" && (
                                                <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className={styles.readMore} style={{ textDecoration: 'none' }}>
                                                    Read More
                                                </a>
                                            )}
                                        </p>
                                    </div>

                                    <div className={styles.announcementFooter}>
                                        <span className={styles.timeLabel}>Exchange Received Time</span>
                                        <span className={styles.timeValue}>{item.received_time || "-"}</span>

                                        <span className={styles.timeLabel}>Exchange Disseminated Time</span>
                                        <span className={styles.timeValue}>{item.disseminated_time || "-"}</span>

                                        <span className={styles.timeLabel}>Time Taken</span>
                                        <span className={styles.timeValue}>{item.time_taken || "-"}</span>
                                    </div>
                                </div>
                            ))
                        )}

                        {announcements.length < announcementsTotal && (
                            <div className={styles.loadMoreWrapper}>
                                <button className={styles.loadMoreBtn} onClick={handleLoadMore} disabled={isAnnouncementsLoading}>
                                    {isAnnouncementsLoading ? "Loading..." : "Load More"}
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        )}

                        {announcements.length === 0 && !isAnnouncementsLoading && hasAnnouncementsFetched && (
                            <div className={styles.noResults}>No announcements found.</div>
                        )}
                    </div>
                </div>
            )}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                shareLink={currentShareLink}
                companyName={companyName}
                title={activeTab === 'news' ? "Share News" : "Share Announcement"}
                subtitle={`Share ${companyName}'s ${activeTab === 'news' ? 'News' : 'Announcement'} with others`}
            />
        </div>
    );
};

export default CompanyNews;
