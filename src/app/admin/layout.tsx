"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, DollarSign, Settings, LogOut } from 'lucide-react';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { name: 'Meus Cursos', icon: BookOpen, href: '/admin/courses' },
        { name: 'Financeiro (Split)', icon: DollarSign, href: '/admin/finance' },
        { name: 'Configurações', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    Nomad <span className="text-gradient">Admin</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <button className={styles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
