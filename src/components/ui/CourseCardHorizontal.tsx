import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from '@/components/ui/StarRating';
import styles from './CourseCardHorizontal.module.css';

interface CourseCardHorizontalProps {
    id: number;
    title: string;
    instructor: string;
    rating: number;
    reviewCount: number;
    price: number;
    image: string;
    bestseller?: boolean;
    description?: string; // Short summary often shown in list view
    lectures?: number;
    duration?: string;
    level?: string;
}

export const CourseCardHorizontal = ({
    id,
    title,
    instructor,
    rating,
    reviewCount,
    price,
    image,
    bestseller = false,
    description = "Aprenda tudo o que você precisa saber para dominar esta habilidade do zero ao avançado.",
    lectures = 42,
    duration = "8h 30m",
    level = "Todos os níveis"
}: CourseCardHorizontalProps) => {
    return (
        <Link href={`/courses/${id}`} className={styles.container}>
            <div className={styles.imageWrapper}>
                <Image src={image} alt={title} fill className={styles.image} />
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <p className={styles.instructor}>{instructor}</p>

                <div className={styles.meta}>
                    <span className={styles.rating}>{rating.toFixed(1)}</span>
                    <StarRating rating={rating} />
                    <span className={styles.reviews}>({reviewCount.toLocaleString()})</span>
                </div>

                <div className={styles.details}>
                    <span>{duration} totais</span>
                    <span className={styles.dot}>•</span>
                    <span>{lectures} aulas</span>
                    <span className={styles.dot}>•</span>
                    <span>{level}</span>
                </div>

                {bestseller && <div className={styles.badge}>Mais Vendido</div>}
            </div>

            <div className={styles.priceColumn}>
                <span className={styles.price}>R$ {price.toFixed(2)}</span>
                <span className={styles.oldPrice}>R$ {(price * 2.5).toFixed(2)}</span>
            </div>
        </Link>
    );
};
