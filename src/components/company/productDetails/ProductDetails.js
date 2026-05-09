"use client";
import React, { useState, useEffect } from "react";
import styles from "./ProductDetails.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";

function toCapitalizeEachWord(str) {
  return str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

const ProductDetails = ({ companyData }) => {
  const params = useParams();
  const companyName = params?.name ? decodeURIComponent(params.name.replace(/-/g, " ")) : "";

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!companyName) return;
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/products`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [companyName]);

  return (
    <div className={styles.container}>
      {/* <nav className={styles.breadcrumb}>
        <Link href="/company" className={styles.breadcrumbLink}>
          Company Details
        </Link>
        <span className={styles.breadcrumbSeparator}>
          <img
            src="/icons/arrow-right-black.svg"
            alt=""
            className={styles.breadcrumbIcon}
          />
        </span>
        <span className={styles.breadcrumbActive}>Products Details</span>
      </nav> */}

      <h1 className={styles.title}>
        Products or Services related to {toCapitalizeEachWord(companyData?.company_information?.legal_name || companyName)}
      </h1>

      <div className={styles.gridWrapper}>
        <div className={styles.productGrid}>
          {isLoading ? (
            [...Array(10)].map((_, index) => (
              <div key={index} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  <div className={`${styles.skeleton} ${styles.productImage}`} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>
                <div className={styles.productInfo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={styles.skeleton} style={{ width: '80%', height: '14px', borderRadius: '4px' }} />
                  <div className={styles.skeleton} style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
                </div>
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={product.image_url && product.image_url !== "-" ? product.image_url : "/icons/Image.svg"}
                    alt={product.productName || "Product"}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productName}>{product.productName || "-"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noData}>No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
