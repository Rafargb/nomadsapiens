"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Play, Check, Shield, Clock, Award, Star } from 'lucide-react';
import styles from './page.module.css';

interface Course {
    id: number;
    title: string;
    description: string;
    image_url: string;
    category: string;
    is_locked: boolean;
}

export default function OfferPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check Auth First
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user;

            // Check if admin
            const isAdmin = currentUser?.email === 'rafaelbarbosa85rd@gmail.com' || currentUser?.email?.includes('admin');

            if (!isAdmin) {
                router.push('/'); // Kick out if not admin
                return;
            }
            setUser(currentUser);

            // Fetch Course only if admin
            if (!courseId) return;
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (data) setCourse(data);
            setLoading(false);
        }
        checkAuth();
    }, [courseId, router]);

    if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Verificando permissão...</div>;
    if (!user) return null; // Should redirect
    if (!course) return <div className="h-screen bg-black text-white flex items-center justify-center">Oferta não encontrada.</div>;

    const handleBuy = () => {
        alert("Modo Visualização Admin: O checkout seria aqui.");
    };

    // Mock features based on category or generic
    const features = [
        "Acesso vitalício ao conteúdo",
        "Certificado de conclusão Nomad Sapiens",
        "Suporte direto com o instrutor",
        "Garantia de 7 dias ou seu dinheiro de volta",
        "Acesso em qualquer dispositivo (Mobile/Desktop)"
    ];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.gradientOverlay}></div>
                <img
                    src={course.image_url}
                    alt={course.title}
                    className={styles.heroImage}
                />

                <div className={styles.heroContent}>
                    <div className={styles.logo}>NOMAD SAPIENS ORIGINAL</div>

                    <h1 className={styles.title}>{course.title}</h1>

                    <div className={styles.meta}>
                        <span className={styles.matchScore}>98% Relevante</span>
                        <span>2024</span>
                        <span className={styles.badge}>HD</span>
                        <span className={styles.badge}>5.1</span>
                    </div>

                    <p className={styles.description}>
                        {course.description || "Uma jornada cinematográfica para transformar sua carreira e estilo de vida. Aprenda com os melhores e domine novas habilidades."}
                    </p>

                    <div className={styles.actions}>
                        <button onClick={handleBuy} className={styles.ctaButton}>
                            <Play fill="white" size={24} /> DESBLOQUEAR AGORA
                            <span className={styles.price}>R$ 97,00</span>
                        </button>

                        <div className={styles.guarantee}>
                            <Shield size={16} /> Compra 100% Segura e Garantida
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section className={styles.detailsSection}>
                <div className="left-col">
                    <h2 className={styles.sectionTitle}>O que está incluso</h2>
                    <ul className={styles.featureList}>
                        {features.map((feature, i) => (
                            <li key={i} className={styles.featureItem}>
                                <Check className="text-red-600" size={24} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <p className="text-gray-400 mt-8">
                        *Este curso faz parte da coleção Nomad Sapiens. Ao adquirir, você apoia diretamente a produção de novos conteúdos independentes.
                    </p>
                </div>

                <div className={styles.sidebar}>
                    <div className="mb-6">
                        <span className={styles.sidebarTitle}>Criado por</span>
                        <span className={styles.sidebarValue}>Rafael Barbosa</span>
                    </div>
                    <div className="mb-6">
                        <span className={styles.sidebarTitle}>Nível</span>
                        <span className={styles.sidebarValue}>Iniciante ao Avançado</span>
                    </div>
                    <div className="mb-6">
                        <span className={styles.sidebarTitle}>Categoria</span>
                        <span className={styles.sidebarValue}>{course.category || 'Geral'}</span>
                    </div>
                    <div>
                        <span className={styles.sidebarTitle}>Avaliação</span>
                        <div className="flex items-center gap-1 text-white mt-1">
                            <Star fill="#e50914" stroke="none" size={18} />
                            <Star fill="#e50914" stroke="none" size={18} />
                            <Star fill="#e50914" stroke="none" size={18} />
                            <Star fill="#e50914" stroke="none" size={18} />
                            <Star fill="#e50914" stroke="none" size={18} />
                            <span className="ml-2">(5.0)</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
