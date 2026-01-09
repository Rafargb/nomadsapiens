"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import styles from './page.module.css';
import { useParams } from 'next/navigation';
import { PlayCircle, Clock, FileText, Download, Smartphone, Award, Globe, RotateCcw } from 'lucide-react';

export default function CourseDetailPage() {
    const params = useParams();

    // Dummy data (would come from API based on params.id)
    const course = {
        title: "Torne-se um Nômade Digital: O Guia Completo 2024",
        subtitle: "Aprenda tudo sobre trabalho remoto, vistos, impostos e como viver viajando o mundo com segurança e estabilidade financeira.",
        rating: 4.8,
        reviews: 1250,
        students: 8432,
        instructor: "Rafael Barbosa",
        lastUpdated: "12/2024",
        price: 49.90,
        originalPrice: 199.90,
    };

    return (
        <div className={styles.page}>
            {/* Hero Section (Dark Background) */}
            <section className={styles.heroWrapper}>
                <div className={`container ${styles.hero}`}>
                    <div className={styles.heroContent}>
                        <div className={styles.breadcrumbs}>
                            Cursos {'>'} Estilo de Vida {'>'} Nômade Digital
                        </div>

                        <h1 className={styles.title}>{course.title}</h1>
                        <p className={styles.subtitle}>{course.subtitle}</p>

                        <div className={styles.meta}>
                            <div className={styles.ratingBadge}>
                                <span className={styles.ratingNumber}>{course.rating}</span>
                                <StarRating rating={course.rating} />
                            </div>
                            <span className={styles.link}>({course.reviews} classificações)</span>
                            <span>{course.students.toLocaleString()} alunos</span>
                        </div>

                        <div className={styles.instructor}>
                            Criado por <span className={styles.link}>{course.instructor}</span>
                        </div>

                        <div className={styles.updateInfo}>
                            <span className={styles.iconText}><RotateCcw size={14} /> Última atualização em {course.lastUpdated}</span>
                            <span className={styles.iconText}><Globe size={14} /> Português</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content & Sticky Sidebar Container */}
            <div className={`container ${styles.bodyContainer}`}>

                {/* Sticky Sidebar (Buy Box) */}
                <aside className={styles.sidebar}>
                    <div className={`${styles.buyBox} glass`}>
                        <Link href="/learn/1/1" className={styles.previewVideo}>
                            <div className={styles.playButton}><PlayCircle size={48} fill="currentColor" /></div>
                            <span>Pré-visualizar aula (Demo)</span>
                        </Link>
                        <div className={styles.buyContent}>
                            <div className={styles.priceRow}>
                                <span className={styles.currentPrice}>R$ {course.price.toFixed(2)}</span>
                                <span className={styles.originalPrice}>R$ {course.originalPrice.toFixed(2)}</span>
                                <span className={styles.discount}>75% off</span>
                            </div>
                            <p className={styles.timeAlert}><Clock size={16} /> <strong>5 horas</strong> restantes com esse preço!</p>

                            <div className={styles.actions}>
                                <Button fullWidth size="lg">Adicionar ao Carrinho</Button>
                                <Link href={`/checkout?courseId=${params.id}`} style={{ width: '100%' }}>
                                    <Button fullWidth variant="secondary" size="lg">Comprar Agora</Button>
                                </Link>
                            </div>

                            <p className={styles.guarantee}>Garantia de 30 dias ou seu dinheiro de volta</p>

                            <div className={styles.includes}>
                                <h4>Este curso inclui:</h4>
                                <ul>
                                    <li><Clock size={16} /> 14 horas de vídeo</li>
                                    <li><FileText size={16} /> 5 artigos</li>
                                    <li><Download size={16} /> 10 recursos para download</li>
                                    <li><Smartphone size={16} /> Acesso no dispositivo móvel e na TV</li>
                                    <li><Award size={16} /> Certificado de conclusão</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Info Column */}
                <div className={styles.mainColumn}>

                    {/* What you'll learn */}
                    <div className={styles.sectionBox}>
                        <h2>O que você aprenderá</h2>
                        <div className={styles.learnGrid}>
                            <span>✓ Como encontrar trabalhos remotos que pagam em Dólar</span>
                            <span>✓ Planejamento financeiro para viagens de longo prazo</span>
                            <span>✓ Gestão de vistos e residência digital</span>
                            <span>✓ Mindset de produtividade e disciplina viajando</span>
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className={styles.sectionBox}>
                        <h2>Conteúdo do curso</h2>
                        <div className={styles.curriculumStats}>
                            5 seções • 42 aulas • 14h 32m de duração total
                        </div>

                        {/* Dummy Accordion Items */}
                        <div className={styles.accordion}>
                            <div className={styles.accordionItem}>
                                <div className={styles.accordionHeader}>
                                    <span>🔻 Introdução ao Nomadismo Digital</span>
                                    <span>3 aulas • 15min</span>
                                </div>
                            </div>
                            <div className={styles.accordionItem}>
                                <div className={styles.accordionHeader}>
                                    <span>🔻 Preparação Financeira</span>
                                    <span>8 aulas • 45min</span>
                                </div>
                            </div>
                            <div className={styles.accordionItem}>
                                <div className={styles.accordionHeader}>
                                    <span>🔻 Escolhendo seu Destino</span>
                                    <span>5 aulas • 30min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
