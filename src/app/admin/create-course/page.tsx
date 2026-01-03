"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        instructor: '',
        price: '',
        image_url: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        // Basic check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setMessage({ type: 'error', text: 'Você precisa estar logado para criar um curso.' });
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.from('courses').insert([
                {
                    title: formData.title,
                    instructor: formData.instructor,
                    price: parseFloat(formData.price),
                    image_url: formData.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', // Default image
                    rating: 0,
                    reviews_count: 0
                }
            ]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Curso criado com sucesso!' });
            // Reset form or redirect
            setTimeout(() => {
                router.push('/courses');
            }, 1500);

        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Erro ao criar curso.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Criar Novo Curso</h1>

            <Card>
                {message && (
                    <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Título do Curso</label>
                        <input
                            name="title"
                            required
                            className={styles.input}
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Marketing Digital 2.0"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Nome do Instrutor</label>
                            <input
                                name="instructor"
                                required
                                className={styles.input}
                                value={formData.instructor}
                                onChange={handleChange}
                                placeholder="Seu nome"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Preço (R$)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                required
                                className={styles.input}
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="99.90"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>URL da Imagem de Capa (Opcional)</label>
                        <input
                            name="image_url"
                            className={styles.input}
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Descrição (Breve)</label>
                        <textarea
                            name="description"
                            className={styles.textarea}
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Publicar Curso'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
