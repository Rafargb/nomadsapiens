"use client";
// Force Vercel Deploy

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload, Lock, Unlock, AlignLeft, Image as ImageIcon, Type, ChevronDown } from 'lucide-react';

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
            const { data, error } = await supabase.from('courses').insert([
                {
                    title: formData.title,
                    image_url: formData.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
                    description: formData.description,
                    sales_copy: formData.sales_copy,
                    category: formData.category,
                    is_locked: formData.is_locked,
                    match_score: formData.match_score
                }
            ]).select().single();

            if (error) throw error;

            setMessage({ type: 'success', text: 'Curso criado! Redirecionando para adicionar aulas...' });

            setTimeout(() => {
                if (data) {
                    router.push(`/admin/courses/${data.id}/lessons`);
                } else {
                    router.push('/admin/courses');
                }
            }, 1000);

        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Erro ao publicar curso.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Novo Módulo (Estúdio)</h1>
                    <p className="text-gray-500">Adicione um novo curso ou série à plataforma.</p>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {message && (
                    <div className={`p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-b border-green-100' : 'bg-red-50 text-red-700 border-b border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-8">

                        {/* Section 1: Basic Info */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <Type className="w-5 h-5 text-gray-400" />
                                Informações Básicas
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Título do Curso</label>
                                    <input
                                        name="title"
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Ex: Masterclass de Cinema"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Categoria</label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="popular">🔥 Populares</option>
                                            <option value="highlight">⭐ Destaque (Banner Gigante)</option>
                                            <option value="continue_watching">▶️ Minha Lista</option>
                                            <option value="next_evolution">🚀 Próxima Evolução</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronDown size={16} className="rotate-0" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Descrição Curta (Banner)</label>
                                <textarea
                                    name="description"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all min-h-[80px]"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Uma breve introdução que aparece no banner principal..."
                                />
                            </div>
                        </div>

                        {/* Section 2: Media & Access */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-gray-400" />
                                Mídia e Acesso
                            </h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">URL da Capa (16:9)</label>
                                <div className="flex gap-3">
                                    <input
                                        name="image_url"
                                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-mono text-sm"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                    {formData.image_url && (
                                        <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Status de Acesso</label>
                                    <div
                                        onClick={() => setFormData({ ...formData, is_locked: !formData.is_locked })}
                                        className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${formData.is_locked ? 'border-red-100 bg-red-50/50' : 'border-green-100 bg-green-50/50'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${formData.is_locked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {formData.is_locked ? <Lock size={20} /> : <Unlock size={20} />}
                                        </div>
                                        <div>
                                            <div className={`font-semibold ${formData.is_locked ? 'text-red-900' : 'text-green-900'}`}>
                                                {formData.is_locked ? 'Conteúdo Bloqueado' : 'Acesso Liberado'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formData.is_locked ? 'Alunos verão um cadeado.' : 'Disponível para todos.'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Copy de Vendas (Modal)</label>
                                    <textarea
                                        name="sales_copy"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all min-h-[100px]"
                                        value={formData.sales_copy}
                                        onChange={handleChange}
                                        placeholder="Texto persuasivo para convencer o aluno a desbloquear..."
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="px-6"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all"
                        >
                            {isLoading ? 'Publicando...' : 'Publicar Conteúdo'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Quick Preview Hint */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">Este conteúdo será adicionado ao catálogo estilo Netflix.</p>
            </div>
        </div>
    );
}

