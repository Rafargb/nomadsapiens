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
    const [userMenuOpen, setUserMenuOpen] = useState(false);

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

                <div className={styles.actions}>
                    {/* Desktop Only Nav Link */}
                    <Link href="/courses/netflix" className={`${styles.link} ${styles.hiddenMobile} hidden md:block text-white hover:text-gray-300 mr-4`}>Cursos</Link>

                    {user ? (
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <Link href="/admin/courses">
                                    <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 border-none text-xs px-2 py-1">
                                        Admin
                                    </Button>
                                </Link>
                            )}
                            <Button variant="ghost" size="sm" onClick={handleLogout} className={isHome ? "text-white" : ""}>
                                Sair
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Mobile Dropdown Menu (Visible only on mobile) */}
                            <div className="relative md:hidden">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="bg-white text-black hover:bg-gray-200 border-none font-bold text-xs px-4 flex items-center gap-2"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    Menu
                                </Button>

                                {userMenuOpen && (
                                    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
                                        <button
                                            className="absolute top-6 right-6 text-white p-2"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>

                                        <nav className="flex flex-col items-center gap-8">
                                            <Link
                                                href="/"
                                                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Início
                                            </Link>
                                            <Link
                                                href="/courses"
                                                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Cursos
                                            </Link>
                                            <Link
                                                href="/login"
                                                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Entrar
                                            </Link>
                                        </nav>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Buttons (Hidden on mobile) */}
                            <Link href="/login" className={`hidden md:block ${styles.hiddenMobile}`}>
                                <Button variant={isHome ? "secondary" : "ghost"} size="sm" className={`${styles.loginButton} text-white`}>Entrar</Button>
                            </Link>
                            <Link href="/courses/netflix" className={`hidden md:block ${styles.hiddenMobile}`}>
                                <Button variant="primary" size="sm" className="bg-white text-black hover:bg-gray-200 border-none font-bold text-xs px-4">
                                    Começar
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
