"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Lock, X } from 'lucide-react';
import styles from './page.module.css';

// Mock Data
const MY_COURSES = [
    { id: 1, title: "Torne-se um Nômade Digital", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800", progress: 35, locked: false },
    { id: 2, title: "Inglês para Viagem", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800", progress: 10, locked: false },
];

const FUNNEL_SUGGESTIONS = [
    { id: 3, title: "Marketing Digital Avançado", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800", match: "98%", locked: true },
    { id: 4, title: "Edição de Vídeo Pro", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800", match: "95%", locked: true },
    { id: 5, title: "Investimentos Globais", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800", match: "90%", locked: true },
];

const RECOMMENDATIONS = [
    { id: 6, title: "Design com Figma", image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800", match: "85%", locked: true },
    { id: 7, title: "Setup YouTuber", image: "https://images.unsplash.com/photo-1593697820928-601d4a0f44e6?w=800", match: "80%", locked: true },
    { id: 8, title: "Fotografia Mobile", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800", match: "75%", locked: true },
];

const HIGHLIGHTS = [
    {
        id: 1,
        title: "Nômade Digital",
        desc: "Acompanhe a jornada completa de zero a 100 países. Descubra como criar liberdade geográfica e financeira em tempo recorde.",
        image: "/hero-nomad-v2.jpg",
        locked: false,
        salesCopy: "Você já tem acesso! Sua jornada para a liberdade geográfica já começou. Continue assistindo para dominar as técnicas de produtividade em trânsito."
    },
    {
        id: 2,
        title: "Inglês para o Mundo",
        desc: "O método definitivo para destravar seu inglês e se comunicar em qualquer lugar do planeta sem medo.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
        locked: true,
        salesCopy: "Imagine pedir seu café em Paris ou negociar um tuk-tuk na Tailândia com total confiança. O mundo se abre quando você fala a língua dele. Desbloqueie agora e destrave sua comunicação global."
    },
    {
        id: 3,
        title: "Filmmaker Pro",
        desc: "Aprenda a capturar e editar vídeos cinematográficos usando apenas o seu equipamento atual.",
        image: "https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?auto=format&fit=crop&w=1600&q=80",
        locked: true,
        salesCopy: "Suas viagens merecem mais do que stories de 24 horas. Crie narrativas visuais cinematográficas que inspiram, engajam e podem até financiar sua próxima passagem aérea."
    }
];

export default function NetflixDashboard() {
    const [scrolled, setScrolled] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!showModal) {
                setHeroIndex((prev) => (prev + 1) % HIGHLIGHTS.length);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [showModal]);

    // Simple scroll handler would go here (useEffect)

    return (
        <div className={styles.container}>
            {/* Navbar Overlay */}
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.navLeft}>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/nomad-iso-transparent.png"
                            alt="N"
                            width={40}
                            height={40}
                            className={styles.logoImage}
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
            </nav>

            {/* Billboard / Hero */}
            <div className={styles.billboard}>
                {HIGHLIGHTS.map((item, index) => (
                    <div
                        key={item.id}
                        className={`${styles.billboardItem} ${index === heroIndex ? styles.active : ''}`}
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className={styles.billboardBg}
                            priority={index === 0}
                        />
                        <div className={styles.billboardContent}>
                            <h1 className={styles.billboardTitle}>{item.title}</h1>
                            <p className={styles.billboardDesc}>
                                {item.desc}
                            </p>
                            <div className={styles.billboardActions}>
                                {!item.locked ? (
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

            {/* Rows Container */}
            <div className={styles.rowsContainer}>

                {/* Meus Cursos (Unlocked) */}
                <section className={styles.row}>
                    <h2 className={styles.rowTitle}>Continuar Assistindo</h2>
                    <div className={styles.slider}>
                        {MY_COURSES.map(course => (
                            <Link href={`/learn/netflix/${course.id}/101`} key={course.id}>
                                <div className={styles.continueCardWrapper}>
                                    <div className={styles.continueCardInner}>
                                        <img src={course.image} className={styles.cardImage} alt={course.title} />

                                        {/* Cinematic Title Overlay (Simulating Logo) */}
                                        <div className={styles.continueTitle}>
                                            {course.title}
                                        </div>

                                        {course.progress > 0 && (
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

                {/* Funnel (Locked) */}
                <section className={styles.row}>
                    <h2 className={styles.rowTitle}>Sua Próxima Evolução</h2>
                    <div className={styles.slider}>
                        {FUNNEL_SUGGESTIONS.map(course => (
                            <div className={styles.cardWrapper} key={course.id}>
                                <div className={styles.cardInner}>
                                    <img src={course.image} className={`${styles.cardImage} ${styles.locked}`} alt={course.title} />
                                    <div className={styles.lockOverlay}>
                                        <div className={styles.lockIcon}>
                                            <Lock size={24} />
                                        </div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardTitle}>{course.title}</div>
                                        <div className={styles.cardMeta}>Bloqueado</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommendations (Locked) */}
                <section className={styles.row}>
                    <h2 className={styles.rowTitle}>Populares na Nomad</h2>
                    <div className={styles.slider}>
                        {RECOMMENDATIONS.map(course => (
                            <div className={styles.cardWrapper} key={`rec-${course.id}`}>
                                <div className={styles.cardInner}>
                                    <img src={course.image} className={`${styles.cardImage} ${styles.locked}`} alt={course.title} />
                                    <div className={styles.lockOverlay}>
                                        <div className={styles.lockIcon}>
                                            <Lock size={24} />
                                        </div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardTitle}>{course.title}</div>
                                        <div className={styles.cardMeta}>{course.match} Relevante</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
            {/* Modal */}
            {showModal && selectedCourse && (
                <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                            <X size={24} />
                        </button>
                        <div className={styles.modalHero}>
                            <Image
                                src={selectedCourse.image}
                                alt={selectedCourse.title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.modalDetails}>
                            <h2 className={styles.modalTitle}>{selectedCourse.title}</h2>
                            <p className={styles.salesCopy}>
                                {selectedCourse.salesCopy}
                            </p>

                            {selectedCourse.locked ? (
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
