"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
        <div style={{ color: '#1a1a1a', maxWidth: '800px', margin: '0 auto' }}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Adicionar Conteúdo (Estúdio)</h1>
                <p className="text-gray-500">Preencha os dados abaixo para cadastrar um novo curso ou módulo.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                {message && (
                    <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Título</label>
                        <input
                            name="title"
                            required
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Título Cinematográfico"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Categoria</label>
                            <select
                                name="category"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="highlight">Banner Gigante (Highlight)</option>
                                <option value="continue_watching">Minha Lista (Continue)</option>
                                <option value="next_evolution">Sua Próxima Evolução (Funnel)</option>
                                <option value="popular">Populares</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Conteúdo Bloqueado?</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <input
                                    type="checkbox"
                                    name="is_locked"
                                    checked={formData.is_locked}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Sim (aparece cadeado)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">URL da Imagem de Capa (16:9)</label>
                        <input
                            name="image_url"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Descrição Curta</label>
                        <textarea
                            name="description"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all min-h-[100px]"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Aparece no Banner Principal"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Copy de Vendas (Para Modal)</label>
                        <textarea
                            name="sales_copy"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all min-h-[100px]"
                            value={formData.sales_copy}
                            onChange={handleChange}
                            placeholder="Texto persuasivo que aparece no modal de desbloqueio..."
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" fullWidth disabled={isLoading} className="py-4 text-base font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/30">
                            {isLoading ? 'Publicando...' : 'Publicar na Plataforma'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
