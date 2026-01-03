import Link from 'next/link';
import { CourseCardHorizontal } from '@/components/ui/CourseCardHorizontal';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Search, Info } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';

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

            <div className={`container ${styles.layout}`}>
                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Classificação <ChevronDown size={14} /></h3>
                        <label className={styles.radioRow}><input type="radio" name="rating" /> <span>4.5 e acima</span> <span className={styles.count}>(120)</span></label>
                        <label className={styles.radioRow}><input type="radio" name="rating" /> <span>4.0 e acima</span> <span className={styles.count}>(450)</span></label>
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Duração do vídeo <ChevronDown size={14} /></h3>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>0-1 hora</span> <span className={styles.count}>(24)</span></label>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>1-3 horas</span> <span className={styles.count}>(130)</span></label>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>3-6 horas</span> <span className={styles.count}>(85)</span></label>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>6-17 horas</span> <span className={styles.count}>(12)</span></label>
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Preço <ChevronDown size={14} /></h3>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>Pago</span> <span className={styles.count}>(340)</span></label>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>Gratuito</span> <span className={styles.count}>(40)</span></label>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={styles.main}>
                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <div className={styles.toolbarLeft}>
                            <Button variant="ghost" size="sm" className={styles.filterBtn}>Filtrar</Button>
                            <div className={styles.sortWrapper}>
                                <span className={styles.sortBy}>Classificar por:</span>
                                <select className={styles.select}>
                                    <option>Mais Relevantes</option>
                                    <option>Mais Bem Avaliados</option>
                                    <option>Mais Novos</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.resultCount}>
                            <span>{displayCourses.length} resultados</span>
                        </div>
                    </div>

                    {/* List */}
                    <div className={styles.list}>
                        {displayCourses.length > 0 ? (
                            displayCourses.map((course: any) => (
                                <CourseCardHorizontal
                                    key={course.id}
                                    id={course.id}
                                    title={course.title}
                                    instructor={course.instructor}
                                    rating={course.rating}
                                    reviewCount={course.reviews_count}
                                    price={course.price}
                                    image={course.image_url}
                                    bestseller={course.rating > 4.7}
                                />
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p>Carregando cursos...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
