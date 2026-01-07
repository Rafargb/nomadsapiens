"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from './Navbar.module.css';
import { supabase } from '@/lib/supabaseClient';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
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

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setUserMenuOpen(false);
        if (userMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [userMenuOpen]);

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
                    <Link href="/courses" className={`${styles.link} ${styles.hiddenMobile} hidden md:block text-white hover:text-gray-300 mr-4`}>Cursos</Link>

                    {user ? (
                        <div className="relative ml-4" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 focus:outline-none group"
                            >
                                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-transparent group-hover:border-white/20 transition-all">
                                    {user.user_metadata?.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            width={36}
                                            height={36}
                                            alt="Avatar"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-sm">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <ChevronDown size={14} className={`text-white transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-md ring-1 ring-white/5">
                                    <div className="px-5 py-4 border-b border-white/10 mb-2">
                                        <p className="text-white text-base font-bold truncate">{user.user_metadata?.full_name || 'Alun@ Nomad'}</p>
                                        <p className="text-gray-400 text-sm truncate mt-1">{user.email}</p>
                                    </div>

                                    <div className="py-1">
                                        {isAdmin && (
                                            <Link href="/admin/courses" className="block px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-4 transition-colors">
                                                <Settings size={18} /> Painel Admin
                                            </Link>
                                        )}

                                        <Link href="/courses" className="block px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-4 transition-colors">
                                            <User size={18} /> Vitrine de Cursos
                                        </Link>
                                    </div>

                                    <div className="border-t border-white/10 mt-2 pt-2 pb-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-4 transition-colors"
                                        >
                                            <LogOut size={18} /> Sair
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Mobile Actions: Simple & Direct */}
                            <div className="flex md:hidden items-center gap-3">
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`${isHome ? 'text-white border border-white/30 bg-white/10' : 'text-gray-900 bg-gray-100'} text-xs font-bold px-3 py-1 transition-all rounded-full`}
                                    >
                                        Entrar
                                    </Button>
                                </Link>
                                <Link href="/courses">
                                    <Button variant="primary" size="sm" className="bg-white text-black hover:bg-gray-200 border-none font-bold text-xs px-4 rounded-full">
                                        Começar
                                    </Button>
                                </Link>
                            </div>

                            {/* Desktop Buttons (Hidden on mobile) */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login" className={styles.hiddenMobile}>
                                    <Button variant={isHome ? "secondary" : "ghost"} size="sm" className={`${styles.loginButton} text-white`}>Entrar</Button>
                                </Link>
                                <Link href="/courses" className={styles.hiddenMobile}>
                                    <Button variant="primary" size="sm" className="bg-white text-black hover:bg-gray-200 border-none font-bold text-xs px-4">
                                        Começar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
