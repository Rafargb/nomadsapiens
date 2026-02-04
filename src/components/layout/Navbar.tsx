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

    // Secure Admin Check inside Component (Hides Verified Admin Visuals)
    const userEmail = user?.email;
    const isAdmin = userEmail?.includes('admin') || userEmail === 'rafaelbarbosa85rd@gmail.com';  // Must match Middleware

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
                                className="flex items-center justify-center focus:outline-none group transition-transform active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-white/20 transition-all shadow-sm">
                                    {user.user_metadata?.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            width={40}
                                            height={40}
                                            alt="Avatar"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </button>

                            {userMenuOpen && (
                                <div className={styles.dropdownMenu}>
                                    {/* Header */}
                                    <div className={styles.dropdownHeader}>
                                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-[#1e1e1e] shadow-lg">
                                            {user.user_metadata?.avatar_url ? (
                                                <Image
                                                    src={user.user_metadata.avatar_url}
                                                    width={80}
                                                    height={80}
                                                    alt="Avatar"
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                    <span className="text-white font-bold text-2xl">
                                                        {user.email?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-white text-lg font-bold truncate max-w-[90%]">{user.user_metadata?.full_name || 'Alun@ Nomad'}</p>
                                        <p className="text-gray-400 text-sm truncate max-w-[90%]">{user.email}</p>
                                    </div>

                                    <div className="px-2">
                                        {isAdmin && (
                                            <Link href="/admin/courses" className={styles.dropdownItem}>
                                                <div className={`text-blue-400 bg-blue-500/10 ${styles.dropdownIcon}`}>
                                                    <Settings size={18} />
                                                </div>
                                                <span className="font-medium">Painel Admin</span>
                                            </Link>
                                        )}

                                        <Link href="/courses" className={styles.dropdownItem}>
                                            <div className={`text-green-400 bg-green-500/10 ${styles.dropdownIcon}`}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <span className="font-medium block">Vitrine de Cursos</span>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="border-t border-white/10 mt-2 py-2 px-2">
                                        <button onClick={handleLogout} className={styles.dropdownItem}>
                                            <div className={`text-red-400 bg-red-500/10 ${styles.dropdownIcon}`}>
                                                <LogOut size={18} />
                                            </div>
                                            <span className="font-medium">Sair</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Mobile Actions: Simple & Direct */}
                            <div className={styles.mobileButtons}>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`${isHome ? 'border border-white/30 bg-white/10' : 'text-gray-900 bg-gray-100'} text-xs font-bold px-3 py-1 transition-all rounded-full`}
                                        style={isHome ? { color: '#ffffff' } : {}}
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
                            <div className={styles.desktopButtons}>
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
