"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            console.log("Login successful:", data);

            // Check for admin simply by email (Temporary solution before RBAC)
            if (email.includes('admin') || email === 'rafaelbarbosa85rd@gmail.com') {
                router.push('/courses/netflix'); // Or /admin
            } else {
                router.push('/courses/netflix');
            }

        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || 'Falha ao entrar. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/courses/netflix`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("Google Login Error:", err);
            setError(err.message || "Erro ao conectar com Google.");
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className="text-gradient">Bem-vindo de volta</h1>
                    <p>Acesse sua conta para continuar aprendendo ou ensinando.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

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
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button fullWidth size="lg" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <div className={styles.divider}>
                        <span>ou</span>
                    </div>

                    <Button fullWidth variant="secondary" type="button" onClick={handleGoogleLogin}>
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
