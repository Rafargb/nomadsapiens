"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Play, X, List, ChevronDown, RefreshCw, Check } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';

interface Lesson {
    id: number;
    title: string;
    description: string;
    video_url: string;
    duration: string;
    position: number;
}

interface Course {
    id: number;
    title: string;
    description: string;
}

export default function NetflixLearnPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params?.courseId as string;
    const lessonId = params?.lessonId as string;

    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Data State
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Data
    useEffect(() => {
        if (!courseId) return;

        async function loadContent() {
            setLoading(true);
            try {
                // 1. Fetch Course Details
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', courseId)
                    .single();

                if (courseError) {
                    console.error("Course error:", courseError);
                }
                if (courseData) setCourse(courseData);

                // 2. Fetch Lessons for this Course
                const { data: lessonsData, error: lessonsError } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('course_id', courseId)
                    .order('position', { ascending: true });

                if (lessonsError) throw lessonsError;

                if (lessonsData) {
                    setLessons(lessonsData);

                    // 3. Find Current Lesson
                    let active = null;
                    if (lessonId) {
                        active = lessonsData.find(l => l.id.toString() === lessonId);
                    }

                    // If not found or no ID provided, default to first
                    if (!active && lessonsData.length > 0) {
                        active = lessonsData[0];
                    }

                    if (active) {
                        setCurrentLesson(active);
                    }
                }
            } catch (err: any) {
                console.error("Error loading content:", err);
                setError("Não foi possível carregar a aula. Verifique se o curso possui conteúdo.");
            } finally {
                setLoading(false);
            }
        }

        loadContent();
    }, [courseId, lessonId]);

    // Helper for Video URL
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        } else if (url.includes('youtube.com/embed/')) {
            return url;
        }

        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3`;

        return url; // Fallback
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-white bg-black">
            <RefreshCw className="animate-spin mr-2" /> Carregando Aula...
        </div>;
    }

    if (error || !currentLesson) {
        return <div className="h-screen flex flex-col items-center justify-center text-white bg-black p-4">
            <h2 className="text-xl mb-4">{error || "Nenhuma aula encontrada para este curso."}</h2>
            <Link href="/courses/netflix">
                <button className="bg-red-600 px-4 py-2 rounded">Voltar para Cursos</button>
            </Link>
        </div>;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/courses/netflix" className={styles.backButton}>
                    <ArrowLeft size={24} />
                    <span>Voltar para Cursos</span>
                </Link>
                {course && <div className={styles.brand}>{course.title}</div>}
                <div className="w-8"></div>
            </header>

            {/* Main Content */}
            <main className={styles.mainArea}>

                {/* Video Section */}
                <section className={styles.videoSection} style={{ marginRight: sidebarOpen ? '350px' : '0', transition: 'margin-right 0.3s' }}>
                    <button
                        className={styles.sidebarToggle}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={18} /> : <List size={18} />}
                        {sidebarOpen ? 'Fechar Lista' : 'Aulas'}
                    </button>

                    <div className={styles.videoPlayerWrapper}>
                        {currentLesson.video_url.includes('youtube') || currentLesson.video_url.includes('youtu.be') ? (
                            <iframe
                                src={getEmbedUrl(currentLesson.video_url)}
                                title={currentLesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                        ) : (
                            <video
                                src={currentLesson.video_url}
                                controls
                                autoPlay
                                className="w-full h-full object-contain bg-black"
                                controlsList="nodownload"
                            >
                                Seu navegador não suporta o player de vídeo.
                            </video>
                        )}
                    </div>

                    <div className={styles.contentContainer}>
                        <div className={styles.lessonHeader}>
                            <div className="flex justify-between items-start mb-2">
                                <h1 className={styles.lessonTitle}>{currentLesson.position}. {currentLesson.title}</h1>
                            </div>
                            <p className={styles.lessonDescription}>
                                {currentLesson.description || "Sem descrição disponível."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sidebar Playlist */}
                <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h3>Conteúdo do Curso</h3>
                    </div>

                    <div className={styles.moduleList}>
                        {lessons.length === 0 ? (
                            <div className="p-4 text-gray-500">Nenhuma aula cadastrada.</div>
                        ) : (
                            <div className={styles.module}>
                                <div className={styles.moduleTitle} style={{ cursor: 'default' }}>
                                    <span>Lista de Aulas</span>
                                    <ChevronDown size={16} />
                                </div>

                                <div className={styles.lessonList} style={{ display: 'block' }}>
                                    {lessons.map((lesson) => (
                                        <Link href={`/learn/netflix/${courseId}/${lesson.id}`} key={lesson.id}>
                                            <div
                                                className={`${styles.lessonItem} ${lesson.id === currentLesson.id ? styles.active : ''}`}
                                            >
                                                <div>
                                                    <div className={styles.lessonTitle}>{lesson.position}. {lesson.title}</div>
                                                    <span className={styles.lessonDuration}>{lesson.duration || '10m'}</span>
                                                </div>
                                                {lesson.id === currentLesson.id && <Play size={14} fill="white" />}
                                                {lesson.id !== currentLesson.id && <Check size={14} className="opacity-0" />}
                                                {/* Check placeholder */}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
}
