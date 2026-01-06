"use client";

import { useState } from 'react';
import { CourseCardHorizontal } from '@/components/ui/CourseCardHorizontal';
import { Button } from '@/components/ui/Button';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import styles from '@/app/courses/page.module.css';

interface CoursesBrowserProps {
    courses: any[];
}

export function CoursesBrowser({ courses }: CoursesBrowserProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className={`container ${styles.layout}`}>
            {/* Mobile Filter Toggle Overlay */}
            <div className={`${styles.sidebar} ${showFilters ? styles.showMobile : ''}`}>
                <div className={styles.mobileFilterHeader}>
                    <h3>Filtros</h3>
                    <button onClick={() => setShowFilters(false)} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.filterContent}>
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
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Preço <ChevronDown size={14} /></h3>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>Pago</span> <span className={styles.count}>(340)</span></label>
                        <label className={styles.checkboxRow}><input type="checkbox" /> <span>Gratuito</span> <span className={styles.count}>(40)</span></label>
                    </div>

                    <div className="mt-6 md:hidden">
                        <Button
                            className="w-full bg-[#E50914] text-white font-bold"
                            onClick={() => setShowFilters(false)}
                        >
                            Ver Resultados
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.toolbarLeft}>
                        {/* Mobile Filter Trigger */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`${styles.filterBtn} md:hidden`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={16} className="mr-2" />
                            Filtros
                        </Button>

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
                        <span>{courses.length} resultados</span>
                    </div>
                </div>

                {/* List */}
                <div className={styles.list}>
                    {courses.length > 0 ? (
                        courses.map((course: any) => (
                            <CourseCardHorizontal
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                instructor={course.instructor}
                                rating={course.rating || 4.8}
                                reviewCount={course.reviews_count}
                                price={course.price}
                                image={course.image_url}
                                bestseller={(course.rating || 0) > 4.7}
                            />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Nenhum curso encontrado no momento.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for mobile filters */}
            {showFilters && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setShowFilters(false)}
                />
            )}
        </div>
    );
}
