"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { CourseCard } from '@/components/ui/CourseCard';
import styles from './CourseList.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const CourseList = ({ title, subtitle }: { title: string, subtitle?: string }) => {
    const [emblaRef] = useEmblaCarousel({ align: 'start', loop: false });
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Add a small delay to prevent flickering if it loads too fast (optional, but good for UX feel)
                // await new Promise(resolve => setTimeout(resolve, 500)); 

                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .limit(8);

                if (error) throw error;
                if (data) setCourses(data);
            } catch (err: any) {
                console.error("Error loading courses:", err);
                setError("Não foi possível carregar os cursos no momento.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (error) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.title}>{title}</h2>
                    <div className="p-4 rounded bg-red-50 text-red-600">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>{title}</h2>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                <div className={styles.embla} ref={emblaRef}>
                    <div className={styles.container}>
                        {isLoading ? (
                            // Simple Skeleton Loading
                            Array.from({ length: 4 }).map((_, i) => (
                                <div className={styles.slide} key={`skeleton-${i}`}>
                                    <div className="h-[320px] w-full bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                            ))
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <div className={styles.slide} key={course.id}>
                                    <CourseCard
                                        id={course.id}
                                        title={course.title}
                                        instructor={course.instructor}
                                        rating={course.rating}
                                        reviewCount={course.reviews_count}
                                        price={course.price}
                                        image={course.image_url}
                                        bestseller={course.rating > 4.7}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-10 text-gray-500">
                                Nenhum curso encontrado.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
