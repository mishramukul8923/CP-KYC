import React, { useState } from 'react';
import { X, Copy, Check, Twitter, Linkedin, MessageCircle, Share2 } from 'lucide-react';
import styles from './ShareModal.module.css';

const ShareModal = ({ isOpen, onClose, shareLink, companyName, title, subtitle }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: '#25D366',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out the company profile for ${companyName}: ${shareLink}`)}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      color: '#0077B5',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out the company profile for ${companyName}: ${shareLink}`)}`,
    },
  ];

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${companyName} - Company Profile`,
        url: shareLink,
      }).catch(console.error);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerIcon}>
            <Share2 size={22} color="#2563EB" />
          </div>
          <div className={styles.titleArea}>
            <h2 className={styles.modalTitle}>{title || "Share"}</h2>
            <p className={styles.modalSubTitle}>{subtitle || `Share ${companyName} with others`}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.shareSection}>
            <label className={styles.sectionLabel}>Direct Link</label>
            <div className={styles.linkContainer}>
              <input
                type="text"
                value={shareLink}
                readOnly
                className={styles.linkInput}
              />
              <button
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className={styles.socialGrid}>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialItem}
              >
                <div className={styles.socialIcon} style={{ color: social.color, backgroundColor: `${social.color}15` }}>
                  {social.icon}
                </div>
                <span className={styles.socialName}>{social.name}</span>
              </a>
            ))}
            {navigator.share && (
              <button className={styles.socialItem} onClick={handleNativeShare}>
                <div className={styles.socialIcon} style={{ color: '#6366F1', backgroundColor: '#6366F115' }}>
                  <Share2 size={20} />
                </div>
                <span className={styles.socialName}>More</span>
              </button>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
