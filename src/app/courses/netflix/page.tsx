"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Lock, X, Search, Bell, ChevronDown, Menu } from 'lucide-react';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const isAdmin = user?.email === 'rafaelbarbosa85rd@gmail.com' || user?.email?.includes('admin');

    const [heroIndex, setHeroIndex] = useState(0);

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
                        // Fix broken image for Filmmaker Pro
                        if (course.title?.toLowerCase().includes('filmmaker')) {
                            course.image_url = 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=800&auto=format&fit=crop';
                        }

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
            setHeroIndex((prev) => (prev + 1) % billboardCourses.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [billboardCourses]);

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
            {/* Navbar */}
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.navLeft}>
                    <div className={styles.mobileMenuToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu size={24} color="white" />
                    </div>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/nomad-iso-transparent.png"
                            alt="N"
                            width={30}
                            height={30}
                            className="object-contain"
                            priority
                        />
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/courses/netflix" className={`${styles.navLink} ${styles.active}`}>Início</Link>
                        <a href="#" className={styles.navLink}>Profissões</a>
                        <a href="#" className={styles.navLink}>Idiomas</a>
                        <a href="#" className={styles.navLink}>Marketing Digital</a>
                        <a href="#" className={styles.navLink}>Inteligência Artificial</a>
                        <a href="#" className={styles.navLink}>Minha Lista</a>
                    </div>
                    {mobileMenuOpen && (
                        <>
                            <div className={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)} />
                            <div className={styles.mobileDropdown}>
                                <div className="flex items-center gap-3 mb-8 pl-1">
                                    <div className={styles.userAvatarSmall}>
                                        <img
                                            src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg"
                                            alt="User"
                                        />
                                    </div>
                                    <span className="text-gray-400 font-bold text-sm">
                                        {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}
                                    </span>
                                    <ChevronDown size={14} className="text-gray-400 ml-auto" />
                                </div>

                                <Link href="/courses/netflix" className={styles.mobileDropdownItem} onClick={() => setMobileMenuOpen(false)}>Início</Link>
                                <span className={styles.mobileDropdownItem}>Profissões</span>
                                <span className={styles.mobileDropdownItem}>Idiomas</span>
                                <span className={styles.mobileDropdownItem}>Marketing Digital</span>
                                <span className={styles.mobileDropdownItem}>Inteligência Artificial</span>
                                <span className={styles.mobileDropdownItem}>Minha Lista</span>

                                <div className="h-px bg-gray-800 my-4 w-full"></div>

                                {isAdmin && (
                                    <Link href="/admin/courses" className={`${styles.mobileDropdownItem} text-red-500`} onClick={() => setMobileMenuOpen(false)}>
                                        Painel Admin
                                    </Link>
                                )}

                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        window.location.href = '/';
                                    }}
                                    className={styles.mobileDropdownItem}
                                    style={{ background: 'transparent', border: 'none', textAlign: 'left', marginTop: '10px' }}
                                >
                                    Sair da Netflix
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.navRight}>
                    <div className={styles.navIcon}>
                        <Search size={20} color="white" />
                    </div>
                    <div className={styles.navIcon}>
                        <Bell size={20} color="white" />
                        <span className={styles.notificationBadge}>12</span>
                    </div>

                    {/* Desktop Profile Dropdown */}
                    <div
                        className={styles.navProfile}
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    >
                        <div className={styles.avatar}>
                            <img src={user?.user_metadata?.avatar_url || "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg"} alt="User" />
                        </div>
                        <ChevronDown size={14} color="white" className={`ml-1 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />

                        {profileMenuOpen && (
                            <div className={styles.desktopDropdown}>
                                {/* Show User Name */}
                                <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700 mb-2">
                                    Olá, {user?.user_metadata?.full_name?.split(' ')[0]}
                                </div>

                                {isAdmin && (
                                    <Link href="/admin/courses" className={styles.dropdownItem}>
                                        <ChevronDown size={14} className="rotate-[-90deg]" /> {/* Placeholder icon */}
                                        Painel Admin
                                    </Link>
                                )}

                                <Link href="#" className={styles.dropdownItem}>
                                    Minha Conta
                                </Link>
                                <Link href="#" className={styles.dropdownItem}>
                                    Central de Ajuda
                                </Link>

                                <div className={styles.divider} />

                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        window.location.href = '/';
                                    }}
                                    className={styles.dropdownItem}
                                    style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
                                >
                                    Sair da Netflix
                                </button>
                            </div>
                        )}
                    </div>
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
                                    <Link href={`/courses/netflix/${item.id}`}>
                                        <button className={styles.playButton}>
                                            <Play fill="black" size={24} />
                                            {!item.is_locked ? "Assistir" : "Conhecer"}
                                        </button>
                                    </Link>

                                    <Link href={`/courses/netflix/${item.id}`}>
                                        <button className={styles.infoButton}>
                                            <Info size={24} /> Mais Informações
                                        </button>
                                    </Link>
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
                                <Link href={`/courses/netflix/${course.id}`} key={course.id}>
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
                ) : null}

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
                                        <Link href={`/courses/netflix/${course.id}`} key={course.id} className={styles.cardWrapper}>
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
                                        </Link>
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
                                    <Link href={`/courses/netflix/${course.id}`} key={course.id} className={styles.cardWrapper}>
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
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )
                )}

            </div>
        </div>
    );
}
