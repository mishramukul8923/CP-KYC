import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './StatsSection.module.css';

export default async function StatsSection() {
  let data = { companies: 0, cases: 0, directors: 0 };
  let loadingError = false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kpi`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      },
      cache: "no-store"
    });

    if (res.status === 401) {
      cookieStore.delete("token");
      redirect('/login');
    }

    if (res.ok) {
      data = await res.json();
    } else {
      loadingError = true;
    }
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    console.error("Failed to fetch KPI:", error);
    loadingError = true;
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "-";
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const stats = [
    { value: loadingError ? "-" : formatNumber(data.companies), label: 'Companies' },
    { value: loadingError ? "-" : formatNumber(data.cases), label: 'Cases' },
    { value: loadingError ? "-" : formatNumber(data.directors), label: 'Directors' }
  ];

  return (
    <section className={styles.statsWrapper}>
      <div className={styles.badge}>
        This month on Corporate Professionals
      </div>
      
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statBox}>
            <h2 className={styles.number}>{stat.value}</h2>
            <p className={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}