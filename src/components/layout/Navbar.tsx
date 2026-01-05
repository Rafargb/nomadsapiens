"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from './Navbar.module.css';
import { supabase } from '@/lib/supabaseClient';

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter(); // Import useRouter check
    const isHome = pathname === '/';
    const [user, setUser] = useState<any>(null);

    // Check Auth State
    useEffect(() => {
        // Get initial session
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkUser();

        // Listen for changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // Hide global navbar for certain pages to avoid duplication if they have their own headers
    if (pathname?.startsWith('/courses/netflix') || pathname?.startsWith('/learn/netflix')) {
        return null;
    }

    const isAdmin = user?.email === 'rafaelbarbosa85rd@gmail.com' || user?.email?.includes('admin');

    return (
        <header className={`${styles.header} ${isHome ? styles.transparentHomepage : 'glass'}`}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logoWrapper}>
                    <Image
                        src="/nomad-sapiens-white.png"
                        alt="Nomad Sapiens"
                        width={180}
                        height={50}
                        priority
                        className={styles.logoImage}
                    />
                </Link>

                {/* Mobile Only Nav Link */}
                <nav className={`${styles.nav} ${styles.mobileOnlyNav}`}>
                    <Link href="/courses" className={styles.link}>Cursos</Link>
                </nav>

                <div className={styles.actions}>
                    {/* Desktop Only Nav Link */}
                    <Link href="/courses" className={`${styles.link} ${styles.desktopOnlyLink}`}>Cursos</Link>

                    {user ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin/courses">
                                    <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 border-none">
                                        Painel Admin
                                    </Button>
                                </Link>
                            )}
                            <Button variant="ghost" size="sm" onClick={handleLogout} className={isHome ? "text-white" : ""}>
                                Sair
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant={isHome ? "secondary" : "ghost"} size="sm" className={styles.loginButton}>Entrar</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="primary" size="sm">Começar Jornada</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
