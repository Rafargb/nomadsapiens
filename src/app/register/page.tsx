"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) throw error;

            // Optional: Auto-login or redirect to confirmation page
            // For now, redirect to courses assuming auto-confirm is off or just to show flow
            alert('Cadastro realizado com sucesso! Verifique seu email se necessário.');
            router.push('/login');

        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Ocorreu um erro ao criar a conta.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className="text-gradient">Crie sua conta</h1>
                    <p>Junte-se à comunidade Nomad Sapiens e comece a evoluir.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            placeholder="Seu nome"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            minLength={6}
                        />
                    </div>

                    <Button fullWidth size="lg" disabled={isLoading}>
                        {isLoading ? 'Criando conta...' : 'Criar Conta'}
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
                        Já tem uma conta? <Link href="/login" className={styles.link}>Entrar</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
