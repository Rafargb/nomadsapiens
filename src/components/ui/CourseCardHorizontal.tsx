import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from '@/components/ui/StarRating';
import styles from './CourseCardHorizontal.module.css';
import { Lock, PlayCircle } from 'lucide-react';

interface CourseCardHorizontalProps {
    id: number;
    title: string;
    instructor: string;
    rating: number;
    reviewCount: number;
    price: number;
    image: string;
    bestseller?: boolean;
    description?: string;
    lectures?: number;
    duration?: string;
    level?: string;
    isLocked?: boolean;
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
    level = "Todos os níveis",
    isLocked = true
}: CourseCardHorizontalProps) => {
    // Destination URL based on lock status
    // If locked -> Sales Page. If unlocked -> Player (assuming lesson 1 for now)
    const destination = isLocked ? `/courses/${id}` : `/learn/netflix/${id}/1`;

    return (
        <div className={styles.container}>
            <Link href={destination} className="contents">
                <div className={styles.imageWrapper}>
                    <Image src={image} alt={title} fill className={styles.image} />
                    {/* Overlay Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        {isLocked ? (
                            <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                                <Lock className="text-white w-6 h-6 opacity-70" />
                            </div>
                        ) : (
                            <div className="bg-primary/90 p-3 rounded-full shadow-lg scale-110">
                                <PlayCircle className="text-white w-8 h-8 fill-current" />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                    <p className={styles.instructor}>{instructor}</p>

                    <div className={styles.meta}>
                        <span className={styles.rating}>{(rating || 0).toFixed(1)}</span>
                        <StarRating rating={rating || 0} />
                        <span className={styles.reviews}>({(reviewCount || 0).toLocaleString()})</span>
                    </div>

                    <div className={styles.details}>
                        <span>{duration} totais</span>
                        <span className={styles.dot}>•</span>
                        <span>{lectures} aulas</span>
                        <span className={styles.dot}>•</span>
                        <span>{level}</span>
                    </div>

                    {bestseller && isLocked && <div className={styles.badge}>Mais Vendido</div>}
                    {!isLocked && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">SEU CURSO</div>}
                </div>
            </Link>

            <div className={`p-4 flex flex-col items-end justify-center border-l border-gray-100 min-w-[140px] ${styles.priceColumn}`}>
                {isLocked ? (
                    <>
                        <span className={styles.price}>R$ {(price || 0).toFixed(2)}</span>
                        <span className={styles.oldPrice}>R$ {((price || 0) * 2.5).toFixed(2)}</span>

                        {/* Direct Checkout Link */}
                        <Link href={`/checkout?courseId=${id}`} className="mt-2 w-full">
                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded text-sm transition-colors cursor-pointer">
                                Comprar
                            </button>
                        </Link>
                    </>
                ) : (
                    <div className="flex flex-col items-end">
                        <span className="text-green-600 font-bold text-lg">Liberado</span>
                        <span className="text-xs text-gray-500">Toque para assistir</span>
                    </div>
                )}
            </div>
        </div>
    );
};
