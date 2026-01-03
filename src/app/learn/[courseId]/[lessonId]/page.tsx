"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';
import { PlayCircle, CheckCircle, Circle, MapPin, Download, MessageCircle, FileText } from 'lucide-react';

export default function LearnPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className={styles.container}>
            {/* Main Content (Video + Tabs) */}
            <div className={styles.main}>
                <div className={styles.videoPlayer}>
                    {/* Placeholder for actual video player */}
                    <div className={styles.videoPlaceholder}>
                        <div className={styles.playIcon}><PlayCircle size={80} strokeWidth={1} /></div>
                        <span>Aula 1: Bem-vindo ao curso</span>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Visão Geral
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'qa' ? styles.active : ''}`}
                            onClick={() => setActiveTab('qa')}
                        >
                            Perguntas e Respostas
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`}
                            onClick={() => setActiveTab('notes')}
                        >
                            Anotações
                        </button>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'overview' && (
                            <div className="animate-fade-in">
                                <h2>Sobre esta aula</h2>
                                <p>Nesta introdução, vamos discutir o que significa ser um nômade digital hoje em dia e alinhar as expectativas para o resto do curso.</p>

                                <div className={styles.resources}>
                                    <h3>Recursos</h3>
                                    <a href="#" className={styles.resourceLink}><FileText size={16} /> Slides da Aula (PDF)</a>
                                    <a href="#" className={styles.resourceLink}><MessageCircle size={16} /> Link para comunidade</a>
                                </div>
                            </div>
                        )}
                        {activeTab === 'qa' && (
                            <div className="animate-fade-in">
                                <p>Nenhuma pergunta ainda. Seja o primeiro!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar (Curriculum) */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>Conteúdo do Curso</h3>
                </div>
                <div className={styles.curriculum}>
                    {/* Section 1 */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <strong>Seção 1: Introdução</strong>
                            <span>1 / 3</span>
                        </div>
                        <div className={styles.lessons}>
                            <div className={`${styles.lesson} ${styles.current}`}>
                                <CheckCircle size={18} className={styles.iconCheck} />
                                <div className={styles.lessonInfo}>
                                    <span>1. Bem-vindo ao curso</span>
                                    <span className={styles.duration}>5m</span>
                                </div>
                            </div>
                            <div className={styles.lesson}>
                                <Circle size={18} className={styles.iconUncheck} />
                                <div className={styles.lessonInfo}>
                                    <span>2. O que é um Nômade Digital?</span>
                                    <span className={styles.duration}>12m</span>
                                </div>
                            </div>
                            <div className={styles.lesson}>
                                <Circle size={18} className={styles.iconUncheck} />
                                <div className={styles.lessonInfo}>
                                    <span>3. Mitos e Verdades</span>
                                    <span className={styles.duration}>8m</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <strong>Seção 2: Planejamento</strong>
                            <span>0 / 5</span>
                        </div>
                        <div className={styles.lessons}>
                            <div className={styles.lesson}>
                                <input type="checkbox" />
                                <div className={styles.lessonInfo}>
                                    <span>4. Finanças Pessoais</span>
                                    <span className={styles.duration}>15m</span>
                                </div>
                            </div>
                            <div className={styles.lesson}>
                                <input type="checkbox" />
                                <div className={styles.lessonInfo}>
                                    <span>5. Escolhendo o País</span>
                                    <span className={styles.duration}>20m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
