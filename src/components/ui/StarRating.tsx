import styles from './StarRating.module.css';

interface StarRatingProps {
    rating: number;
    showCount?: boolean;
    count?: number;
}

export const StarRating = ({ rating, showCount = false, count = 0 }: StarRatingProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? styles.filled : styles.empty}>
                        ★
                    </span>
                ))}
            </div>
            {showCount && <span className={styles.count}>({count})</span>}
        </div>
    );
};
