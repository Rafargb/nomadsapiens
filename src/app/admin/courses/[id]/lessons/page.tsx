"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, ArrowLeft, Save, Video, Lock, Unlock, UploadCloud, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManageLessonsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [lessons, setLessons] = useState<any[]>([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [loading, setLoading] = useState(true);

    // Form and Upload State
    const [showForm, setShowForm] = useState(false);
    const [irisMode, setIrisMode] = useState<'upload' | 'youtube'>('upload');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video_url: '',
        duration: '10:00',
        is_locked: true,
        position: 1
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        // Get Course Info
        const { data: course } = await supabase.from('courses').select('title').eq('id', params.id).single();
        if (course) setCourseTitle(course.title);

        // Get Lessons
        const { data: lessonsData } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', params.id)
            .order('position', { ascending: true });

        if (lessonsData) {
            setLessons(lessonsData);
            setFormData(prev => ({ ...prev, position: lessonsData.length + 1 }));
        }
        setLoading(false);
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `course_${params.id}/${fileName}`;

            // Upload via Supabase Storage
            const { data, error } = await supabase.storage
                .from('videos')
                .upload(filePath, file);

            if (error) throw error;

            // Get Public URL
            const { data: urlData } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            if (urlData) {
                setFormData(prev => ({ ...prev, video_url: urlData.publicUrl }));
                // Try to guess duration not implemented, set default or let user edit
            }

        } catch (error: any) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('lessons').insert([
                {
                    course_id: params.id,
                    ...formData
                }
            ]);

            if (error) throw error;

            // Success reset
            setFormData({
                title: '',
                description: '',
                video_url: '',
                duration: '10:00',
                is_locked: true,
                position: lessons.length + 2
            });
            setShowForm(false);
            fetchData(); // Refresh list

        } catch (err: any) {
            alert('Erro ao criar aula: ' + err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja apagar esta aula?')) return;
        await supabase.from('lessons').delete().eq('id', id);
        fetchData();
    };

    return (
        <div style={{ color: '#1a1a1a', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="mb-8">
                <Link href="/admin/courses" className="text-gray-500 hover:text-green-600 flex items-center mb-4 transition-colors text-sm font-medium">
                    <ArrowLeft size={16} className="mr-2" /> Voltar para Cursos
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Aulas</h1>
                        <p className="text-gray-500">Curso: {courseTitle}</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancelar' : <><Plus size={18} className="mr-2" /> Nova Aula</>}
                    </Button>
                </div>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-bold mb-6 text-gray-900">Adicionar Nova Aula</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Título da Aula</label>
                                <input
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="Ex: Introdução ao Módulo"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Duração (ex: 12:30)</label>
                                <input
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Video Source Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Vídeo da Aula</label>

                            <div className="flex gap-6 mb-2 border-b border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIrisMode('upload')}
                                    className={`pb-3 text-sm font-medium transition-all ${irisMode === 'upload' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Fazer Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIrisMode('youtube')}
                                    className={`pb-3 text-sm font-medium transition-all ${irisMode === 'youtube' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Link Externo (YouTube)
                                </button>
                            </div>

                            {irisMode === 'youtube' ? (
                                <div className="flex gap-2 mt-2">
                                    <Video className="text-gray-400 mt-3" size={20} />
                                    <input
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={formData.video_url}
                                        onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="mt-2 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-green-500/50 hover:bg-green-50/10 transition-colors bg-gray-50/50 cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="video/mp4,video/webm"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <UploadCloud size={24} className="text-green-600" />
                                        </div>
                                        <span className="text-gray-900 font-medium">Clique para selecionar o vídeo</span>
                                        <span className="text-xs text-gray-500 mt-1">MP4 (Max 50MB)</span>
                                        {uploading && <span className="text-yellow-600 mt-2 text-sm font-medium animate-pulse">Enviando... Aguarde...</span>}
                                        {formData.video_url && irisMode === 'upload' && !uploading && (
                                            <span className="text-green-600 mt-2 text-sm flex items-center gap-1 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                <Check size={14} /> Upload Concluído!
                                            </span>
                                        )}
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Descrição</label>
                            <textarea
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all min-h-[100px]"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.is_locked}
                                    onChange={e => setFormData({ ...formData, is_locked: e.target.checked })}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                />
                                <span className={formData.is_locked ? "text-red-600 font-medium flex items-center gap-1.5" : "text-green-600 font-medium flex items-center gap-1.5"}>
                                    {formData.is_locked ? <><Lock size={16} /> Bloqueado (Pago)</> : <><Unlock size={16} /> Gratuito (Preview)</>}
                                </span>
                            </label>

                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-sm font-medium">Ordem:</span>
                                <input
                                    type="number"
                                    className="w-16 p-2 bg-gray-50 border border-gray-200 rounded-lg text-center font-medium focus:outline-none focus:border-green-500"
                                    value={formData.position}
                                    onChange={e => setFormData({ ...formData, position: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <Button type="submit" fullWidth disabled={uploading} className="shadow-lg shadow-green-500/20 hover:shadow-green-500/30">
                                {uploading ? 'Aguarde o Upload...' : 'Salvar Aula'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lessons List */}
            {loading ? <p className="text-gray-500">Carregando aulas...</p> : (
                <div className="flex flex-col gap-3">
                    {lessons.length === 0 && !showForm && (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Video className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma aula cadastrada</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Este curso ainda não tem conteúdo. Comece adicionando a primeira aula.</p>
                            <Button variant="ghost" onClick={() => setShowForm(true)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                <Plus size={18} className="mr-2" /> Criar Primeira Aula
                            </Button>
                        </div>
                    )}

                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-green-200 hover:shadow-sm transition-all">
                            <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold text-gray-500 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                                {lesson.position}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">{lesson.title}</h3>
                                <div className="flex gap-4 text-xs font-medium text-gray-500">
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><Video size={12} /> {lesson.duration}</span>
                                    {lesson.is_locked ?
                                        <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">Premium</span> :
                                        <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">Grátis</span>
                                    }
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
