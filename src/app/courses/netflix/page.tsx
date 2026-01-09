"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Lock, X } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';

interface Course {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    sales_copy?: string;
    is_locked: boolean;
    category: string;
    progress?: number;
    match_score?: string;
}

export default function NetflixDashboard() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const isAdmin = user?.email === 'rafaelbarbosa85rd@gmail.com' || user?.email?.includes('admin');

    const [heroIndex, setHeroIndex] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Data State
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        async function loadData() {
            try {
                // 1. Get Session
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user;
                setUser(currentUser);

                // 2. Fetch All Courses
                const { data: coursesData, error: coursesError } = await supabase
                    .from('courses')
                    .select('*')
                    .order('id');

                if (coursesError) throw coursesError;

                // 3. Fetch Enrollments
                let enrolledCourseIds: number[] = [];
                if (currentUser) {
                    const { data: enrollments } = await supabase
                        .from('enrollments')
                        .select('course_id')
                        .eq('user_id', currentUser.id);

                    if (enrollments) {
                        enrolledCourseIds = enrollments.map(e => e.course_id);
                    }
                }

                // 4. Separate Lists
                const my: Course[] = [];
                const others: Course[] = [];

                if (coursesData) {
                    coursesData.forEach(course => {
                        if (enrolledCourseIds.includes(course.id)) {
                            // User owns this course
                            my.push({ ...course, is_locked: false }); // Force unlock in UI
                        } else {
                            // User does not own this course
                            others.push(course);
                        }
                    });
                }

                setAllCourses(coursesData || []);
                setMyCourses(my);
                setAvailableCourses(others);

            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Billboard Rotation (Cycle through available/highlight courses)
    const billboardCourses = availableCourses.length > 0 ? availableCourses : myCourses;
    useEffect(() => {
        if (billboardCourses.length === 0) return;
        const interval = setInterval(() => {
            if (!showModal) {
                setHeroIndex((prev) => (prev + 1) % billboardCourses.length);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [showModal, billboardCourses]);

    if (loading) {
        return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: '1rem' }}>Carregando Nomad Sapiens...</h1>
            <p style={{ color: '#666' }}>Personalizando sua experiência...</p>
        </div>;
    }

    // Helper to group available courses by category (or just show all if few)
    const categories = Array.from(new Set(availableCourses.map(c => c.category))).filter(Boolean);

    return (
        <div className={styles.container}>
            {/* Navbar Overlay */}
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.navLeft}>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/nomad-iso-transparent.png"
                            alt="N"
                            width={35}
                            height={35}
                            className="object-contain"
                            priority
                        />
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/" className={`${styles.navLink} ${styles.active}`}>Início</Link>
                        <a href="#" className={styles.navLink}>Minha Lista</a>
                        <a href="#" className={styles.navLink}>Explorar</a>
                    </div>
                </div>

                <div className="flex items-center gap-4 mr-8 z-50">
                    {isAdmin && (
                        <Link href="/admin/courses">
                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                                Painel Admin
                            </button>
                        </Link>
                    )}
                    <span className="text-white text-sm cursor-pointer opacity-80 hover:opacity-100">Cursos</span>
                </div>
            </nav>

            {/* Billboard / Hero */}
            {billboardCourses.length > 0 && (
                <div className={styles.billboard}>
                    {billboardCourses.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${styles.billboardItem} ${index === heroIndex ? styles.active : ''}`}
                        >
                            <img
                                src={item.image_url}
                                className={styles.billboardBg}
                                alt={item.title}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                            <div className={styles.billboardContent}>
                                <h1 className={styles.billboardTitle}>{item.title}</h1>
                                <p className={styles.billboardDesc}>
                                    {item.description}
                                </p>
                                <div className={styles.billboardActions}>
                                    {!item.is_locked ? (
                                        <Link href={`/learn/netflix/${item.id}/1`}>
                                            <button className={styles.playButton}>
                                                <Play fill="black" size={24} /> Continuar
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            className={styles.playButton}
                                            onClick={() => { setSelectedCourse(item); setShowModal(true); }}
                                        >
                                            <Play fill="black" size={24} /> Conhecer
                                        </button>
                                    )}
                                    <button
                                        className={styles.infoButton}
                                        onClick={() => { setSelectedCourse(item); setShowModal(true); }}
                                    >
                                        <Info size={24} /> Mais Informações
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rows Container */}
            <div className={styles.rowsContainer}>

                {/* 1. MY COURSES (Unlocked) */}
                {myCourses.length > 0 ? (
                    <section className={styles.row}>
                        <h2 className={styles.rowTitle}>Minha Lista (Meus Cursos)</h2>
                        <div className={styles.slider}>
                            {myCourses.map(course => (
                                <Link href={`/learn/netflix/${course.id}/1`} key={course.id}>
                                    <div className={styles.continueCardWrapper}>
                                        <div className={styles.continueCardInner}>
                                            <img src={course.image_url} className={styles.cardImage} alt={course.title} />
                                            {/* Cinematic Title Overlay */}
                                            <div className={styles.continueTitle}>
                                                {course.title}
                                            </div>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressFill} style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className={styles.emptyStateCore}>
                        <h2>Sua Lista</h2>
                        <p>Você ainda não iniciou nenhum curso. Escolha um abaixo para começar.</p>
                    </div>
                )}

                {/* 2. MARKETPLACE (Locked/Available) - Grouped by Category */}
                {categories.length > 0 ? (
                    categories.map(cat => {
                        const catCourses = availableCourses.filter(c => c.category === cat);
                        if (catCourses.length === 0) return null;

                        // Category Translations
                        const categoryMap: Record<string, string> = {
                            'highlight': 'Destaques da Semana',
                            'popular': 'Mais Populares (Em Alta)',
                            'new_release': 'Lançamentos Recentes',
                            'finance': 'Finanças e Investimentos',
                            'marketing': 'Marketing Digital',
                            'productivity': 'Produtividade e Alta Performance',
                            'tech': 'Tecnologia e Inovação',
                            'business': 'Negócios e Empreendedorismo',
                            'continue_watching': 'Recomendados para Você', // Renamed for non-enrolled context
                            'next_evolution': 'Sua Próxima Evolução'
                        };

                        // Use translation or fallback to Capitalized key
                        const displayTitle = categoryMap[cat] || cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ');

                        return (
                            <section className={styles.row} key={cat}>
                                <h2 className={styles.rowTitle}>{displayTitle}</h2>
                                <div className={styles.slider}>
                                    {catCourses.map(course => (
                                        <div className={styles.cardWrapper} key={course.id} onClick={() => { setSelectedCourse(course); setShowModal(true); }}>
                                            <div className={styles.cardInner}>
                                                <img src={course.image_url} className={`${styles.cardImage} ${styles.locked}`} alt={course.title} />
                                                <div className={styles.lockOverlay}>
                                                    <div className={styles.lockIcon}>
                                                        <Lock size={24} />
                                                    </div>
                                                </div>
                                                <div className={styles.cardContent}>
                                                    <div className={styles.cardTitle}>{course.title}</div>
                                                    <div className={styles.cardMeta}>Disponível</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })
                ) : (
                    // Fallback if no categories or all courses owned
                    availableCourses.length > 0 && (
                        <section className={styles.row}>
                            <h2 className={styles.rowTitle}>Explorar Novos Horizontes</h2>
                            <div className={styles.slider}>
                                {availableCourses.map(course => (
                                    <div className={styles.cardWrapper} key={course.id} onClick={() => { setSelectedCourse(course); setShowModal(true); }}>
                                        <div className={styles.cardInner}>
                                            <img src={course.image_url} className={`${styles.cardImage} ${styles.locked}`} alt={course.title} />
                                            <div className={styles.lockOverlay}>
                                                <div className={styles.lockIcon}>
                                                    <Lock size={24} />
                                                </div>
                                            </div>
                                            <div className={styles.cardContent}>
                                                <div className={styles.cardTitle}>{course.title}</div>
                                                <div className={styles.cardMeta}>Disponível</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                )}

            </div>

            {/* Modal Details */}
            {showModal && selectedCourse && (
                <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                            <X size={24} />
                        </button>
                        <div className={styles.modalHero}>
                            <img
                                src={selectedCourse.image_url}
                                alt={selectedCourse.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.modalDetails}>
                            <h2 className={styles.modalTitle}>{selectedCourse.title}</h2>
                            <p className={styles.salesCopy}>
                                {selectedCourse.sales_copy || selectedCourse.description}
                            </p>

                            {!selectedCourse.is_locked ? (
                                <Link href={`/learn/netflix/${selectedCourse.id}/1`} className={styles.unlockButton} style={{ background: '#fff', color: '#000' }}>
                                    <Play fill="black" size={20} style={{ display: 'inline', marginRight: '8px' }} />
                                    Continuar Assistindo
                                </Link>
                            ) : (
                                <Link href={`/checkout?courseId=${selectedCourse.id}`} className={styles.unlockButton}>
                                    Adquirir Acesso (Via Checkout)
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
