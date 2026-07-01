import { Suspense } from "react";
import Navbar from "@/components/home/navbar/Navbar";
import HeroSection from "@/components/home/hero/HeroSection";
import StatsSection from "@/components/home/stats/StatsSection";
import StatsSectionSkeleton from "@/components/home/stats/StatsSectionSkeleton";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.pageWrapper}>
      <HeroSection />
      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSection />
      </Suspense>
    </main>
  );
}
