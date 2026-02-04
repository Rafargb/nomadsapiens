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
    const [isSuccess, setIsSuccess] = useState(false);

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

            setIsSuccess(true);

        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Ocorreu um erro ao criar a conta.');
            setIsLoading(false);
        } finally {
            // Loading state is handled by success/error states mostly, 
            // but if error, we stop loading in catch. 
            // If success, we stay loading until UI switches? 
            // Actually, keep loading false if success to show UI.
            if (!isSuccess) setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={styles.container}>
                <Card className={styles.loginCard}>
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Verifique seu Email</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Enviamos um link de confirmação para <br />
                            <span className="font-semibold text-gray-900">{email}</span>.
                        </p>
                        <p className="text-sm text-gray-500 mb-8">
                            Por segurança, sua conta só será ativada após você clicar no link enviado.
                        </p>
                        <Button fullWidth size="lg" onClick={() => router.push('/login')}>
                            Entendi, ir para o Login
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

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

