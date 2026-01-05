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

    // Auth State (Moved to top)
    const [user, setUser] = useState<any>(null);
    const isAdmin = user?.email === 'rafaelbarbosa85rd@gmail.com' || user?.email?.includes('admin');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user));
    }, []);
    const [heroIndex, setHeroIndex] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Data State
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtered Lists
    const highlights = courses.filter(c => c.category === 'highlight');
    const myCourses = courses.filter(c => c.category === 'continue_watching');
    const funnel = courses.filter(c => c.category === 'next_evolution');
    const popular = courses.filter(c => c.category === 'popular');

    // Fetch Data from Supabase
    useEffect(() => {
        async function fetchCourses() {
            try {
                const { data, error } = await supabase.from('courses').select('*').order('id');
                if (error) {
                    console.error('Error fetching courses:', error);
                } else if (data) {
                    setCourses(data);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();

        // Navbar scroll handler
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Billboard Rotation
    useEffect(() => {
        if (highlights.length === 0) return;
        const interval = setInterval(() => {
            if (!showModal) {
                setHeroIndex((prev) => (prev + 1) % highlights.length);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [showModal, highlights]);

    if (loading) {
        return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: '1rem' }}>Carregando Nomad Sapiens...</h1>
            <p style={{ color: '#666' }}>Conectando ao banco de dados...</p>
        </div>;
    }



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
                        <a href="#" className={styles.navLink}>Séries</a>
                        <a href="#" className={styles.navLink}>Bombando</a>
                        <a href="#" className={styles.navLink}>Minha Lista</a>
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
            {highlights.length > 0 && (
                <div className={styles.billboard}>
                    {highlights.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${styles.billboardItem} ${index === heroIndex ? styles.active : ''}`}
                        >
                            {/* Using explicit img tag or next/image with full URL */}
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
                                        <Link href="/learn/netflix/1/101">
                                            <button className={styles.playButton}>
                                                <Play fill="black" size={24} /> Assistir
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            className={styles.playButton}
                                            onClick={() => { setSelectedCourse(item); setShowModal(true); }}
                                        >
                                            <Play fill="black" size={24} /> Desbloquear
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

                {/* Meus Cursos (Unlocked) */}
                {myCourses.length > 0 && (
                    <section className={styles.row}>
                        <h2 className={styles.rowTitle}>Continuar Assistindo</h2>
                        <div className={styles.slider}>
                            {myCourses.map(course => (
                                <Link href={`/learn/netflix/${course.id}/101`} key={course.id}>
                                    <div className={styles.continueCardWrapper}>
                                        <div className={styles.continueCardInner}>
                                            <img src={course.image_url} className={styles.cardImage} alt={course.title} />

                                            {/* Cinematic Title Overlay */}
                                            <div className={styles.continueTitle}>
                                                {course.title}
                                            </div>

                                            {(course.progress || 0) > 0 && (
                                                <div className={styles.progressBar}>
                                                    <div className={styles.progressFill} style={{ width: `${course.progress}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Funnel (Locked) */}
                {funnel.length > 0 && (
                    <section className={styles.row}>
                        <h2 className={styles.rowTitle}>Sua Próxima Evolução</h2>
                        <div className={styles.slider}>
                            {funnel.map(course => (
                                <div className={styles.cardWrapper} key={course.id} onClick={() => { setSelectedCourse(course); setShowModal(true); }}>
                                    <div className={styles.cardInner}>
                                        <img src={course.image_url} className={`${styles.cardImage} ${course.is_locked ? styles.locked : ''}`} alt={course.title} />
                                        {course.is_locked && (
                                            <div className={styles.lockOverlay}>
                                                <div className={styles.lockIcon}>
                                                    <Lock size={24} />
                                                </div>
                                            </div>
                                        )}
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardTitle}>{course.title}</div>
                                            <div className={styles.cardMeta}>Bloqueado</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommendations (Locked) */}
                {popular.length > 0 && (
                    <section className={styles.row}>
                        <h2 className={styles.rowTitle}>Populares na Nomad</h2>
                        <div className={styles.slider}>
                            {popular.map(course => (
                                <div className={styles.cardWrapper} key={`rec-${course.id}`} onClick={() => { setSelectedCourse(course); setShowModal(true); }}>
                                    <div className={styles.cardInner}>
                                        <img src={course.image_url} className={`${styles.cardImage} ${course.is_locked ? styles.locked : ''}`} alt={course.title} />
                                        {course.is_locked && (
                                            <div className={styles.lockOverlay}>
                                                <div className={styles.lockIcon}>
                                                    <Lock size={24} />
                                                </div>
                                            </div>
                                        )}
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardTitle}>{course.title}</div>
                                            <div className={styles.cardMeta}>{course.match_score || '90%'} Relevante</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {courses.length === 0 && !loading && (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <h2>Nenhum curso encontrado.</h2>
                        <p>Verifique se você rodou o script SQL no Supabase.</p>
                    </div>
                )}

            </div>
            {/* Modal */}
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

                            {selectedCourse.is_locked ? (
                                <Link href="#" className={styles.unlockButton}>
                                    Desbloquear Acesso Especial
                                </Link>
                            ) : (
                                <Link href="/learn/netflix/1/101" className={styles.unlockButton} style={{ background: '#fff', color: '#000' }}>
                                    <Play fill="black" size={20} style={{ display: 'inline', marginRight: '8px' }} />
                                    Continuar Assistindo
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
