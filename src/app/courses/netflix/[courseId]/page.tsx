"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowLeft, Clock, Lock, CheckCircle, Info } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import styles from './page.module.css';

interface Lesson {
    id: number;
    title: string;
    description: string;
    video_url: string;
    duration: string;
    position: number;
    is_locked: boolean;
}

interface Course {
    id: number;
    title: string;
    description: string;
    image_url: string;
    sales_copy?: string;
    category: string;
    is_locked: boolean; // Initial state for user
}

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.courseId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!courseId) return;

        async function loadCourseDetails() {
            try {
                // 1. Get User Session
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user;
                setUser(currentUser);

                // 2. Fetch Course Info
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', courseId)
                    .single();

                if (courseError) throw courseError;
                
                // 3. Check Enrollment to determine lock status
                let isLocked = true;
                if (currentUser) {
                    const { data: enrollment } = await supabase
                        .from('enrollments')
                        .select('id')
                        .eq('user_id', currentUser.id)
                        .eq('course_id', courseId)
                        .single();
                    
                    if (enrollment) isLocked = false;
                }

                setCourse({ ...courseData, is_locked: isLocked });

                // 4. Fetch Lessons
                const { data: lessonsData, error: lessonsError } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('course_id', courseId)
                    .order('position', { ascending: true });

                if (lessonsError) {
                     console.error("Error fetching lessons:", lessonsError);
                     // Allow empty lessons if error or none
                }

                setLessons(lessonsData || []);

            } catch (err) {
                console.error("Error loading course details:", err);
            } finally {
                setLoading(false);
            }
        }

        loadCourseDetails();
    }, [courseId]);

    const handlePlayClick = (lessonId: number, isLessonLocked: boolean) => {
        if (isLessonLocked && course?.is_locked) {
            // Redirect to checkout or offer page
             router.push(`/checkout?courseId=${courseId}`);
             return;
        }
        // Go to player
        router.push(`/learn/netflix/${courseId}/${lessonId}`);
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!course) {
        return (
             <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <h1>Curso não encontrado.</h1>
                <Link href="/courses/netflix" className={styles.secondaryButton} style={{marginTop: '1rem'}}>
                    Voltar
                </Link>
            </div>
        );
    }

    // Determine first lesson to play
    const firstLessonId = lessons.length > 0 ? lessons[0].id : null;

    return (
        <div className={styles.container}>
            {/* Back Navigation */}
            <Link href="/courses/netflix" className={styles.backLink}>
                <ArrowLeft size={20} /> Voltar para o Início
            </Link>

            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroBackground}>
                    <img src={course.image_url} alt={course.title} className={styles.heroImage} />
                    <div className={styles.gradientOverlay}></div>
                </div>

                <div className={styles.heroContent}>
                    {/* Optional: Add Logo or just Title */}
                    <h1 className={styles.title}>{course.title}</h1>
                    
                    <div className={styles.meta}>
                        <span className={styles.matchScore}>98% Relevante</span>
                        <span>{new Date().getFullYear()}</span>
                        <span>{lessons.length} Aulas</span>
                        <span style={{ border: '1px solid #666', padding: '0 4px', fontSize: '0.8rem' }}>HD</span>
                    </div>

                    <p className={styles.description}>
                        {course.sales_copy || course.description}
                    </p>

                    <div className={styles.actionButtons}>
                        {!course.is_locked ? (
                            <Link href={firstLessonId ? `/learn/netflix/${course.id}/1` : '#'} className={styles.playButton}>
                                <Play fill="black" size={24} /> Assistir
                            </Link>
                        ) : (
                             <Link href={`/checkout?courseId=${course.id}`} className={styles.playButton}>
                                <Lock size={24} /> Desbloquear Agora
                            </Link>
                        )}
                        
                        {/* Optional buttons */}
                        {/* <button className={styles.secondaryButton}>
                            <Plus size={24} /> Minha Lista
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Episodes List */}
            <div className={styles.episodesSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className={styles.sectionTitle}>Espisódios</h2>
                    <span style={{color:'#666', fontSize:'0.9rem'}}>Curso: {course.category}</span>
                </div>

                <div className={styles.episodesList}>
                    {lessons.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Em breve novas aulas...</p>
                    ) : (
                        lessons.map((lesson, index) => {
                            // Logic: if course is locked, user can't watch unless lesson is free preview (if we implemented that).
                            // Assuming for now: Course Locked -> All Lessons Locked (unless specified otherwise in lesson row, but we use course enrollment mainly)
                            const isLocked = course.is_locked && lesson.is_locked; 

                            return (
                                <div 
                                    key={lesson.id} 
                                    className={styles.episodeItem} 
                                    onClick={() => handlePlayClick(lesson.id, isLocked)}
                                >
                                    <div className={styles.episodeNumber}>{index + 1}</div>
                                    
                                    <div className={styles.episodeImageContainer}>
                                        {/* Using course image as placeholder for lesson thumb if specific thumb not available */}
                                        <img 
                                            src={course.image_url} 
                                            alt={lesson.title} 
                                            className={styles.episodeThumbnail} 
                                        />
                                        <div className={styles.durationBadge}>{lesson.duration || '10:00'}</div>
                                    </div>

                                    <div className={styles.episodeInfo}>
                                        <div className={styles.episodeTitle}>
                                            <span>{lesson.title}</span>
                                        </div>
                                        <p className={styles.episodeDesc}>{lesson.description}</p>
                                    </div>

                                    {/* Status Icon */}
                                    <div style={{ marginLeft: '1rem' }}>
                                        {isLocked ? (
                                            <Lock size={20} className="text-gray-500" />
                                        ) : (
                                           <Play size={20} className="text-white opacity-0 group-hover:opacity-100" />
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
