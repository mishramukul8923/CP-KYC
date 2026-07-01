import styles from './StatsSection.module.css';

export default function StatsSectionSkeleton() {
  const stats = [
    { label: 'Companies' },
    { label: 'Cases' },
    { label: 'Directors' }
  ];

  return (
    <section className={styles.statsWrapper}>
      <div className={styles.badge}>
        This month on Corporate Professionals
      </div>
      
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statBox}>
            <div className={`${styles.skeletonNumber} ${styles.shimmer}`} />
            <p className={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
