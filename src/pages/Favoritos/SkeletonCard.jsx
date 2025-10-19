// src/pages/Favoritos/SkeletonCard.jsx
import styles from './SkeletonCard.module.css';

function SkeletonCard() {
    return (
        <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonElement} ${styles.skeletonImage}`}></div>
            <div className={styles.skeletonContent}>
                <div className={`${styles.skeletonElement} ${styles.skeletonText} ${styles.skeletonTitle}`}></div>
                <div className={`${styles.skeletonElement} ${styles.skeletonText} ${styles.skeletonButton}`}></div>
                <div className={`${styles.skeletonElement} ${styles.skeletonText} ${styles.skeletonButton}`}></div>
            </div>
        </div>
    );
}

export default SkeletonCard;