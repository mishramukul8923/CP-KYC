"use client";
import React from 'react';
import DirectorProfile from '@/components/company/people/DirectorProfile';
import styles from './PeopleProfileWrapper.module.css';

const PeopleProfileWrapper = ({ din, onBack }) => {
  const [directorData, setDirectorData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchDirectorDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!din) throw new Error("DIN not found");


        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/people-database/${din}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch director details");
        const data = await response.json();

        // Map API response to DirectorProfile format
        const mappedDirector = {
          name: data.name,
          designation: data.type || "Director",
          din_pan: data.din_pan,
          status: data.din_status,
          category: data.type,
          appointment_date: data.current_companies?.[0]?.appointment_date || "-",
          linkedin_url: data.linkedin_url, // Assuming it might be there
          director_type: true, // Always show as current in the profile view
          details: {
            profile_image: data.profile_image && data.profile_image !== "-" ? data.profile_image : "/icons/profile-icon.svg",
            din_status: data.din_status,
            pan: data.pan,
            nationality: data.nationality,
            dob: data.dob,
            gender: data.gender,
            residential_status: data.residential_status,
            email: data.email,
            mobile: data.mobile,
            current_residential_address: data.current_residential_address,
            permanent_address: data.permanent_address,
            current_positions: (data.current_companies || []).map(c => ({
              company_name: c.company_name,
              designation: c.designation,
              category: c.type,
              tenure_years: c.period,
              appointment_date: c.appointment_date,
              company_log: c.company_log // If available
            })),
            past_positions: (data.previous_companies || []).map(c => ({
              company_name: c.company_name,
              designation: c.designation,
              tenure_years: c.tenure,
              company_log: c.company_log // If available
            })),
            shareholding: (data.shareholding || []).map(item => ({
              company_name: item.company_name,
              share_percentage: item.shareholding_percentage || item.share_percentage || "-",
              nature_of_holding: item.nature || item.nature_of_holding || "-",
            })),
            negative_media: data.negative_media || [],
            banking_default: data.banking_default_declarations || [],
            regulatory_history: data.regulatory_compliance_history || [],
            pep_sanctions: data.pep_sanctions_checks || [],
            risk_edd: (() => {
              const raw = data.risk_edd;
              if (!raw) return [];
              if (Array.isArray(raw)) return raw;
              return [raw];
            })(),
            career_timeline: (data.career_timeline || []).map(c => ({
              company_name: c.company,
              designation: c.role,
              appointment_date: c.from_date,
              cessation_date: c.to_date,
              status: c.is_current ? "Active" : "Inactive",
              tenure_years: "" // Can calculate or leave empty
            })),
            qualifications: (data.qualifications || []).map(item => ({
              icon: item.icon || "/images/placeholder.svg",
              title: item.certificate_in || "-",
              inst: item.institute_name || "-",
              spec: item.specialization_in || "-",
              yearfrom: item.year_from || "-",
              yearto: item.year_to || "-"
            }))
          }
        };

        setDirectorData(mappedDirector);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorDetails();
  }, [din]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading director profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={onBack} className={styles.backButton}>Back to Database</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* <button className={styles.backButton} onClick={onBack}>
        <img src="/icons/chevron-left.svg" alt="" />
        Back to People Database
      </button> */}
      {directorData && <DirectorProfile directors={[directorData]} hideSidebar={true} />}
    </div>
  );
};

export default PeopleProfileWrapper;
