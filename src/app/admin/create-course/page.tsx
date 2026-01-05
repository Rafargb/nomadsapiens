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
        image_url: '',
        description: '',
        sales_copy: '',
        category: 'popular',
        is_locked: true,
        match_score: '95%'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.from('courses').insert([
                {
                    title: formData.title,
                    image_url: formData.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
                    description: formData.description,
                    sales_copy: formData.sales_copy,
                    category: formData.category,
                    is_locked: formData.is_locked,
                    match_score: formData.match_score
                }
            ]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Curso criado e publicado na Netflix Page!' });

            // Redirect to Netflix page to see content
            setTimeout(() => {
                router.push('/courses/netflix');
            }, 1500);

        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Erro ao criar curso. Verifique as permissões do banco (RLS).' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Adicionar Conteúdo (Estúdio)</h1>

            <Card>
                {message && (
                    <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Título</label>
                        <input
                            name="title"
                            required
                            className={styles.input}
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Título Cinematográfico"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Categoria (Onde vai aparecer?)</label>
                            <select name="category" className={styles.input} value={formData.category} onChange={handleChange}>
                                <option value="highlight">Banner Gigante (Highlight)</option>
                                <option value="continue_watching">Minha Lista (Continue)</option>
                                <option value="next_evolution">Sua Próxima Evolução (Funnel)</option>
                                <option value="popular">Populares</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Conteúdo Bloqueado?</label>
                            <div style={{ marginTop: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="is_locked"
                                    checked={formData.is_locked}
                                    onChange={handleChange}
                                    style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                                />
                                <span style={{ fontSize: '0.9rem' }}>Sim (aparece cadeado)</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>URL da Imagem de Capa (16:9)</label>
                        <input
                            name="image_url"
                            className={styles.input}
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Descrição Curta</label>
                        <textarea
                            name="description"
                            className={styles.textarea}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Aparece no Banner Principal"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Copy de Vendas (Para Modal)</label>
                        <textarea
                            name="sales_copy"
                            className={styles.textarea}
                            value={formData.sales_copy}
                            onChange={handleChange}
                            placeholder="Texto persuasivo que aparece no modal de desbloqueio..."
                        />
                    </div>

                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Publicando...' : 'Publicar na Plataforma'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
