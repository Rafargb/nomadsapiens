"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, FastForward, Check, ChevronDown, ChevronUp, List, X } from 'lucide-react';
import styles from './page.module.css';

// Mock data for seamless preview
const MOCK_COURSE = {
    title: "Torne-se um Nômade Digital",
    modules: [
        {
            id: 1,
            title: "Seção 1: Introdução",
            lessons: [
                { id: 101, title: "Bem-vindo ao curso", duration: "5m", completed: true },
                { id: 102, title: "O que é um Nômade Digital?", duration: "12m", completed: false },
                { id: 103, title: "Mitos e Verdades", duration: "8m", completed: false },
            ]
        },
        {
            id: 2,
            title: "Seção 2: Planejamento",
            lessons: [
                { id: 201, title: "Finanças Pessoais", duration: "15m", completed: false },
                { id: 202, title: "Escolhendo o País", duration: "20m", completed: false },
            ]
        }
    ]
};

export default function NetflixLearnPage({ params }: { params: { courseId: string, lessonId: string } }) {
    const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default for clarity
    const [openModules, setOpenModules] = useState<number[]>([1]); // Default open first module

    const toggleModule = (id: number) => {
        if (openModules.includes(id)) {
            setOpenModules(openModules.filter(m => m !== id));
        } else {
            setOpenModules([...openModules, id]);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header / Navbar Minimalista */}
            <header className={styles.header}>
                <Link href="/courses/netflix" className={styles.backButton}>
                    <ArrowLeft size={24} />
                    <span>Voltar para Cursos</span>
                </Link>
                {/* Brand removed or replaced by Course Title optionally */}
                <div className={styles.brand}></div>
                <div className="w-8"></div> {/* Spacer to center brand if needed */}
            </header>

            {/* Main Content Area */}
            <main className={styles.mainArea}>

                {/* Video / Player Section */}
                <section className={styles.videoSection} style={{ marginRight: sidebarOpen ? '350px' : '0', transition: 'margin-right 0.3s' }}>

                    <button
                        className={styles.sidebarToggle}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={18} /> : <List size={18} />}
                        {sidebarOpen ? 'Fechar Lista' : 'Aulas'}
                    </button>

                    <div className={styles.videoPlayerWrapper}>
                        {/* Placeholder for video frame */}
                        <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Static Image or Poster could go here */}
                            <div className={styles.bigPlayButton}>
                                <Play size={32} fill="white" />
                            </div>
                        </div>
                    </div>

                    {/* Content Below Video */}
                    <div className={styles.contentContainer}>
                        <div className={styles.lessonHeader}>
                            <h1 className={styles.lessonTitle}>Aula 1: Bem-vindo ao curso</h1>
                            <p className={styles.lessonDescription}>
                                Nesta introdução rápida, vamos alinhar as expectativas e preparar você para a jornada de liberdade geográfica. Discutiremos os pilares fundamentais do nomadismo digital e como este curso foi estruturado para levar você do zero à sua primeira viagem trabalhando.
                            </p>
                        </div>

                        <div className={styles.resourcesSection}>
                            <h2 className={styles.sectionTitle}>Material de Apoio</h2>
                            <div className={styles.resourceGrid}>
                                <a href="#" className={styles.resourceItem}>
                                    <div className={styles.resourceIcon}>
                                        <div className="text-red-500 font-bold">PDF</div>
                                    </div>
                                    <div className={styles.resourceInfo}>
                                        <span className={styles.resourceName}>Resumo da Aula.pdf</span>
                                        <span className={styles.resourceType}>Documento • 2.4 MB</span>
                                    </div>
                                </a>
                                <a href="#" className={styles.resourceItem}>
                                    <div className={styles.resourceIcon}>
                                        <div className="text-blue-500 font-bold">MP3</div>
                                    </div>
                                    <div className={styles.resourceInfo}>
                                        <span className={styles.resourceName}>Audiobook da Aula</span>
                                        <span className={styles.resourceType}>Audio • 15 min</span>
                                    </div>
                                </a>
                                <a href="#" className={styles.resourceItem}>
                                    <div className={styles.resourceIcon}>
                                        <div className="text-green-500 font-bold">XLS</div>
                                    </div>
                                    <div className={styles.resourceInfo}>
                                        <span className={styles.resourceName}>Planilha de Custos</span>
                                        <span className={styles.resourceType}>Planilha • 120 KB</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Sidebar / Curriculum */}
                <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h3>{MOCK_COURSE.title}</h3>
                    </div>

                    <div className={styles.moduleList}>
                        {MOCK_COURSE.modules.map((module) => (
                            <div key={module.id} className={styles.module}>
                                <div
                                    className={styles.moduleTitle}
                                    onClick={() => toggleModule(module.id)}
                                >
                                    <span>{module.title}</span>
                                    {openModules.includes(module.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>

                                {openModules.includes(module.id) && (
                                    <div className={styles.lessonList}>
                                        {module.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className={`${styles.lessonItem} ${lesson.id === 101 ? styles.active : ''} ${lesson.completed ? styles.completed : ''}`}
                                            >
                                                <div>
                                                    <div className={styles.lessonTitle}>{lesson.title}</div>
                                                    <span className={styles.lessonDuration}>{lesson.duration}</span>
                                                </div>
                                                {lesson.completed && <Check size={16} color="#4ade80" />}
                                                {!lesson.completed && lesson.id === 101 && <Play size={14} fill="white" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}
