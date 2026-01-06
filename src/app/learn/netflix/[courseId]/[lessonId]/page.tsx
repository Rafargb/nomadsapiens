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
    const [accessDenied, setAccessDenied] = useState(false);

    // Fetch Data
    useEffect(() => {
        if (!courseId) return;

        async function loadContent() {
            setLoading(true);
            try {
                // 0. Get Session
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;

                // 1. Fetch Course Details
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', courseId)
                    .single();

                if (courseError || !courseData) {
                    throw new Error("Curso não encontrado.");
                }
                setCourse(courseData);

                // 2. CHECK ACCESS (Enrollment)
                if (courseData.is_locked) {
                    // Allow access if: User is Admin OR User is Enrolled
                    const isAdmin = user?.email === 'rafaelbarbosa85rd@gmail.com' || user?.email?.includes('admin');

                    if (!isAdmin) {
                        if (!user) {
                            // Not logged in -> Denied
                            setAccessDenied(true);
                            setLoading(false);
                            return;
                        }

                        const { data: enrollment } = await supabase
                            .from('enrollments')
                            .select('id')
                            .eq('user_id', user.id)
                            .eq('course_id', courseId)
                            .single();

                        if (!enrollment) {
                            // No enrollment -> Denied
                            setAccessDenied(true);
                            setLoading(false);
                            return;
                        }
                    }
                }

                // 3. Fetch Lessons for this Course
                const { data: lessonsData, error: lessonsError } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('course_id', courseId)
                    .order('position', { ascending: true });

                if (lessonsError) throw lessonsError;

                if (lessonsData) {
                    setLessons(lessonsData);

                    // 4. Find Current Lesson
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
                setError(err.message || "Não foi possível carregar a aula.");
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
            <RefreshCw className="animate-spin mr-2" /> Verificando acesso...
        </div>;
    }

    if (accessDenied) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-white bg-[#141414] p-4 text-center">
                <div className="bg-red-600/20 p-6 rounded-full mb-6">
                    <Check className="text-red-500" size={64} style={{ transform: 'rotate(45deg)' }} />
                    {/* Hacky Lock Icon (using rotated X or actually import Lock if possible later, for now Check rotated acts as block symbol or just simple placeholder) */}
                </div>
                <h1 className="text-3xl font-bold mb-4">Conteúdo Exclusivo</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    Esta aula faz parte de um curso premium. Adquira o acesso completo para desbloquear todas as aulas.
                </p>
                <Link href={`/offer/${courseId}`}>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-bold text-lg transition-colors">
                        Desbloquear Acesso Agora
                    </button>
                </Link>
                <div className="mt-4">
                    <Link href="/courses/netflix" className="text-gray-500 hover:text-white text-sm">
                        Voltar para o Início
                    </Link>
                </div>
            </div>
        );
    }

    if (error || !currentLesson) {
        return <div className="h-screen flex flex-col items-center justify-center text-white bg-black p-4">
            <h2 className="text-xl mb-4">{error || "Nenhuma aula encontrada."}</h2>
            <Link href="/courses/netflix">
                <button className="bg-red-600 px-4 py-2 rounded">Voltar</button>
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
                                                {/* Lock icon for future enhancement if lesson locked indv */}
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
