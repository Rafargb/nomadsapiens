import Link from 'next/link';
import { CoursesBrowser } from '@/components/features/CoursesBrowser';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// This is a Server Component
export default async function CoursesPage() {

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching courses:', error);
    }

    const displayCourses = courses && courses.length > 0 ? courses : [];

    return (
        <div className={styles.container}>
            {/* Category Header */}
            <div className={styles.categoryHeader}>
                <div className="container">
                    <h1 className={styles.h1}>Cursos de Estilo de Vida Nômade</h1>
                    <h2 className={styles.h2}>Cursos para te ajudar a trabalhar de qualquer lugar</h2>

                    {/* Featured Hero for Category */}
                    <div className={styles.featuredHero}>
                        <div className={styles.featuredContent}>
                            <span className={styles.badge}>EM DESTAQUE</span>
                            <h3>Torne-se um Nômade Digital: O Guia Completo 2024</h3>
                            <p>Domine as ferramentas, mentalidade e estratégias para criar sua liberdade geográfica agora mesmo.</p>
                            <p className={styles.featuredAuthor}>Rafael Barbosa</p>
                        </div>
                    </div>

                    <div className={styles.relatedTopics}>
                        <h3>Tópicos populares:</h3>
                        <span className={styles.topicPill}>Marketing Digital</span>
                        <span className={styles.topicPill}>Freelancing</span>
                        <span className={styles.topicPill}>Inglês</span>
                        <span className={styles.topicPill}>Fotografia</span>
                        <span className={styles.topicPill}>Investimentos</span>
                    </div>
                </div>
            </div>

            {/* Interactive Browser (Filters + List) */}
            <CoursesBrowser courses={displayCourses} />
        </div>
    );
}
