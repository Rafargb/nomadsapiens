"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const pathname = usePathname();
    const isHome = pathname === '/';

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

                <nav className={styles.nav}>
                    <Link href="/courses" className={styles.link}>Cursos</Link>
                </nav>

                <div className={styles.actions}>
                    <Link href="/login">
                        <Button variant={isHome ? "secondary" : "ghost"} size="sm" className={styles.loginButton}>Entrar</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="primary" size="sm">Começar Jornada</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};
