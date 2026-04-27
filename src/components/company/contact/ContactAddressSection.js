import React from "react";
import styles from "./ContactAddressSection.module.css";

const ContactAddressSection = ({ companyData, loading, error }) => {

  if (loading || !companyData) {
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={styles.container}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.row}>
              <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
              <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
              <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red", fontWeight: 500 }}>
          {error}
        </div>
      </div>
    );
  }

  const contact = companyData?.contact_details;

  if (!contact) {
    return null;
  }

  const contactItems = [
    {
      label: "Official Email ID",
      value: (
        <a href={`mailto:${contact.email}`} className={styles.link}>
          {contact.email || "-"}
        </a>
      ),
    },
    {
      label: "Official Website",
      value: (
        <a
          href={contact.website}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {contact.website || "-"}
        </a>
      ),
    },
    {
      label: "Registered Office Address",
      value: contact.registered_office_address || "-",
    },
    {
      label: "City",
      value: contact.city || "-",
    },
    {
      label: "State",
      value: contact.state || "-",
    },
  ];

  const socialIcons = [
    "/icons/fb.svg",
    "/icons/li.svg",
    "/icons/instagram.svg",
    "/icons/youtube2.svg",
    "/icons/twitter.svg",
  ];

  const getSocialIcon = (url) => {
    if (url.includes("facebook")) return "/icons/fb.svg";
    if (url.includes("linkedin")) return "/icons/li.svg";
    if (url.includes("instagram")) return "/icons/instagram.svg";
    if (url.includes("youtube")) return "/icons/youtube2.svg";
    if (url.includes("twitter") || url.includes("x.com"))
      return "/icons/twitter.svg";

    return "/icons/link.svg"; // fallback icon
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>Company Contact Details</h2>
      <div className={styles.container}>
        {contactItems.map((item, index) => (
          <div key={index} className={styles.row}>
            <label className={styles.label}>{item.label}</label>
            <div className={styles.dashedLine}></div>
            <div className={styles.valueBox}>{item.value}</div>
          </div>
        ))}

        <div className={styles.row}>
          <label className={styles.label}>Social Media</label>
          <div className={styles.dashedLine}></div>

          <div className={styles.socialBox}>
            {contact.social_media?.length > 0 ? (
              contact.social_media.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={getSocialIcon(link)}
                    alt="Social Media"
                    className={styles.socialIcon}
                  />
                </a>
              ))
            ) : (
              <span className={styles.valueBox}>-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAddressSection;
