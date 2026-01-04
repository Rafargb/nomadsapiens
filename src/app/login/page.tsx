"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock login logic
        setTimeout(() => {
            setIsLoading(false);
            if (email.includes('admin')) {
                router.push('/admin');
            } else {
                router.push('/courses/netflix');
            }
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <Card className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className="text-gradient">Bem-vindo de volta</h1>
                    <p>Acesse sua conta para continuar aprendendo ou ensinando.</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Senha</label>
                        <input type="password" placeholder="••••••••" className={styles.input} required />
                    </div>

                    <Button fullWidth size="lg" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <div className={styles.divider}>
                        <span>ou</span>
                    </div>

                    <Button fullWidth variant="secondary" type="button">
                        Continuar com Google
                    </Button>
                </form>

                <div className={styles.footer}>
                    <p>
                        Não tem uma conta? <Link href="/register" className={styles.link}>Crie agora</Link>
                    </p>
                    <p className={styles.hint}>
                        Dica: Use <strong>admin@nomad.com</strong> para ver o painel de instrutor.
                    </p>
                </div>
            </Card>
        </div>
    );
}
