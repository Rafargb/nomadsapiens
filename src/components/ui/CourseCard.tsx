import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import styles from './CourseCard.module.css';

interface CourseCardProps {
    id: number;
    title: string;
    instructor: string;
    rating: number;
    reviewCount: number;
    price: number;
    image: string;
    bestseller?: boolean;
}

export const CourseCard = ({
    id,
    title,
    instructor,
    rating,
    reviewCount,
    price,
    image,
    bestseller = false,
}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`} className={styles.linkWrapper}>
            <Card className={styles.card} hoverEffect>
                <div className={styles.imageWrapper}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className={styles.image}
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.instructor}>{instructor}</p>

                    <div className={styles.ratingRow}>
                        <StarRating rating={rating} showCount count={reviewCount} />
                    </div>

                    <div className={styles.priceRow}>
                        <span className={styles.price}>R$ {(price || 0).toFixed(2)}</span>
                        <span className={styles.oldPrice}>R$ {(price * 2).toFixed(2)}</span>
                    </div>

                    {bestseller && (
                        <div className={styles.badge}>Mais Vendido</div>
                    )}
                </div>
            </Card>
        </Link>
    );
};
