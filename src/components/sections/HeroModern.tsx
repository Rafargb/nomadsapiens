"use client";

import { Play, Maximize2, Volume2, Settings } from 'lucide-react';
import Image from 'next/image';
import styles from './HeroModern.module.css';

export const HeroModern = () => {
    return (
        <section className={styles.section}>
            {/* Decorative elements */}
            <div className={styles.decoCircle}></div>
            <div className={styles.decoSquare}></div>
            <div className={styles.decoline}></div>

            <div className="container">
                <div className={styles.grid}>
                    {/* Left Text */}
                    <div className={styles.content}>
                        <h1 className={styles.title}>
                            Garanta a sua Vaga.
                            <br className={styles.desktopBr} />
                            <span className={styles.highlight}> (O lugar, você escolhe).</span>
                        </h1>

                        <p className={styles.description}>
                            O hub de educação e lifestyle para quem quer o mundo como escritório.
                        </p>

                        <div className={styles.ctaGroup}>
                            <button className={styles.btnPrimary}>Começar Agora</button>
                            <button className={styles.btnSecondary}>Ver Depoimentos</button>
                        </div>
                    </div>

                    {/* Right Video Player Card */}
                    <div className={styles.cardWrapper}>
                        <div className={styles.videoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.liveBadge}>● AO VIVO</div>
                                <div className={styles.viewerCount}>1.254 alunos assistindo</div>
                            </div>

                            {/* Video Mockup */}
                            <div className={styles.videoFrame}>
                                <Image
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"
                                    alt="Aula de Nomadismo Digital"
                                    fill
                                    className={styles.videoImage}
                                />
                                <div className={styles.playOverlay}>
                                    <div className={styles.playButton}>
                                        <Play size={32} fill="white" stroke="none" />
                                    </div>
                                </div>

                                {/* Video Controls Mock */}
                                <div className={styles.controlsBar}>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill}></div>
                                    </div>
                                    <div className={styles.controlIcons}>
                                        <div className={styles.leftIcons}>
                                            <Play size={16} fill="white" />
                                            <Volume2 size={16} />
                                            <span className={styles.time}>12:45 / 45:00</span>
                                        </div>
                                        <div className={styles.rightIcons}>
                                            <Settings size={16} />
                                            <Maximize2 size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <div>
                                    <div className={styles.lessonTitle}>Aula 01: O Mindset Nômade</div>
                                    <div className={styles.instructor}>Rafael Barbosa</div>
                                </div>
                                <div className={styles.nextUp}>
                                    <span>Próxima:</span>
                                    <strong>Finanças Globais</strong>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className={styles.floatIcon1}></div>
                        <div className={styles.floatIcon2}></div>
                    </div>
                </div>

                {/* Trust Indicators */}

            </div>
        </section>
    )
}
