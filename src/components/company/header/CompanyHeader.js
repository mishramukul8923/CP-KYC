import React from "react";
import styles from "./CompanyHeader.module.css";

const CompanyHeader = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.mainLayout}>
        {/* Left Section: Logo */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoCircle}>
            <img
              src="/icons/Image.svg"
              alt="LOGO"
              className={styles.logoCircle}
            />
          </div>
        </div>

        {/* Middle Section: Content */}
        <div className={styles.contentSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.companyName}>Dabur India</h1>

            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Growth Score</span>
                <span className={styles.scoreBadgeRed}>69</span>
                <img
                  src="/icons/arrow-down.svg"
                  alt="arrow down"
                  className={styles.arrowDown}
                />
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>CB Rank</span>
                <span className={styles.scoreBadgeRed}>268240</span>
                <img
                  src="/icons/arrow-down.svg"
                  alt="arrow down"
                  className={styles.arrowDown}
                />
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Heat Score</span>
                <span className={styles.scoreBadgeRed}>59</span>
                <img
                  src="/icons/arrow-down.svg"
                  alt="arrow down"
                  className={styles.arrowDown}
                />
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>CIN</span>
                <span className={styles.cinBadge}>L24230DL1975PLC007908</span>
              </div>
            </div>
          </div>

          <p className={styles.description}>
            Dabur is an India's leading FMCG Companies with Revenues of over Rs
            7,680 Crore & Market Capitalisation of over Rs 48,800 Crore.
          </p>

          <div className={styles.infoMetaRow}>
            <div className={styles.metaItem}>
              <img
                src="/icons/calendar.svg"
                alt="Founded"
                className={styles.icon}
              />
              <span>Funded 1884</span>
            </div>
            <div className={styles.metaItem}>
              <img src="/icons/flag.svg" alt="Type" className={styles.icon} />
              <span>Public</span>
            </div>
            <div className={styles.metaItem}>
              <img
                src="/icons/location.svg"
                alt="Location"
                className={styles.icon}
              />
              <span>Ghaziabad, Uttar Pradesh, India</span>
            </div>
            <div className={styles.metaItem}>
              <img
                src="/icons/profile-2user.svg"
                alt="Employees"
                className={styles.icon}
              />
              <span>5001-10000</span>
            </div>
            <div className={styles.metaItem}>
              <img
                src="/icons/global.svg"
                alt="Website"
                className={styles.icon}
              />
              <a href="https://www.dabur.com/" className={styles.link}>
                www.dabur.com/
              </a>
            </div>
            <div className={styles.socialIcons}>
              <img
                src="/icons/fb.svg"
                alt="Facebook"
                className={styles.socialIcon}
              />
              <img
                src="/icons/li.svg"
                alt="LinkedIn"
                className={styles.socialIcon}
              />
            </div>
          </div>

          <div className={styles.tagsRow}>
            <span className={styles.tag}>Beauty</span>
            <span className={styles.tag}>Fast-Moving Consumer Goods</span>
            <span className={styles.tag}>Fruit</span>
            <span className={styles.tag}>Health Care</span>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className={styles.actionSection}>
          <div className={styles.buttonGroup}>
            {/* <button className={styles.saveButton}>
              <img
                src="/icons/bookmark.svg"
                alt="Save"
                className={styles.buttonIcon}
              />
              Save
            </button> */}

            <button className={styles.actionsButton}>
              Actions
              <img
                src="/icons/chevron-down.svg"
                alt="Actions"
                className={styles.chevronDown}
              />
            </button>
          </div>
          {/* <div className={styles.lastUpdated}>
            <span>Last Updated:</span>{" "}
            <strong>{formatDateToIST(companyData?.header?.last_updated) || "-"}</strong>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
