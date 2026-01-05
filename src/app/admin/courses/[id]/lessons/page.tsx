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
        <div className="container mx-auto p-6 text-white min-h-screen">
            <div className="mb-6">
                <Link href="/admin/courses" className="text-gray-400 hover:text-white flex items-center mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Voltar para Cursos
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Gerenciar Aulas</h1>
                        <p className="text-gray-400">Curso: {courseTitle}</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancelar' : <><Plus size={18} className="mr-2" /> Nova Aula</>}
                    </Button>
                </div>
            </div>

            {/* Create Form */}
            {showForm && (
                <Card className="mb-8 p-6 bg-gray-900 border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Adicionar Nova Aula</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Título da Aula</label>
                                <input
                                    className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Duração (ex: 12:30)</label>
                                <input
                                    className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Video Source Selection */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Vídeo da Aula</label>

                            <div className="flex gap-4 mb-3 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setIrisMode('upload')}
                                    className={`pb-1 border-b-2 ${irisMode === 'upload' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}
                                >
                                    Fazer Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIrisMode('youtube')}
                                    className={`pb-1 border-b-2 ${irisMode === 'youtube' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}
                                >
                                    Link Externo (YouTube)
                                </button>
                            </div>

                            {irisMode === 'youtube' ? (
                                <div className="flex gap-2">
                                    <Video className="text-gray-500 mt-2" size={20} />
                                    <input
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={formData.video_url}
                                        onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-700 rounded p-6 text-center hover:border-gray-500 transition-colors bg-black/50">
                                    <input
                                        type="file"
                                        accept="video/mp4,video/webm"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                                        <UploadCloud size={32} className="text-primary mb-2" />
                                        <span className="text-white font-medium">Clique para selecionar o vídeo</span>
                                        <span className="text-xs text-gray-500 mt-1">MP4 (Max 50MB)</span>
                                        {uploading && <span className="text-yellow-400 mt-2 text-sm animate-pulse">Enviando... Aguarde...</span>}
                                        {formData.video_url && irisMode === 'upload' && !uploading && (
                                            <span className="text-green-400 mt-2 text-sm flex items-center gap-1">
                                                <Check size={14} /> Upload Concluído!
                                            </span>
                                        )}
                                    </label>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                            <textarea
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white h-24"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_locked}
                                    onChange={e => setFormData({ ...formData, is_locked: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className={formData.is_locked ? "text-red-400 flex items-center gap-1" : "text-green-400 flex items-center gap-1"}>
                                    {formData.is_locked ? <><Lock size={14} /> Bloqueado (Pago)</> : <><Unlock size={14} /> Gratuito (Preview)</>}
                                </span>
                            </label>

                            <div className="flex items-center gap-2 ml-auto">
                                <input
                                    type="number"
                                    className="w-16 bg-black border border-gray-700 rounded p-1 text-center"
                                    value={formData.position}
                                    onChange={e => setFormData({ ...formData, position: parseInt(e.target.value) })}
                                />
                                <span className="text-gray-400 text-sm">Ordem</span>
                            </div>
                        </div>

                        <Button type="submit" fullWidth disabled={uploading}>
                            {uploading ? 'Aguarde o Upload...' : 'Salvar Aula'}
                        </Button>
                    </form>
                </Card>
            )}

            {/* Lessons List */}
            {loading ? <p>Carregando aulas...</p> : (
                <div className="space-y-3">
                    {lessons.length === 0 && !showForm && (
                        <div className="text-center py-10 bg-gray-900 rounded border border-dashed border-gray-700">
                            <p className="text-gray-400">Nenhuma aula cadastrada ainda.</p>
                            <Button variant="ghost" onClick={() => setShowForm(true)} className="mt-2 text-primary">
                                Criar Primeira Aula
                            </Button>
                        </div>
                    )}

                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded hover:border-gray-600 transition-colors">
                            <div className="bg-gray-800 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold text-gray-400">
                                {lesson.position}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{lesson.title}</h3>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Video size={12} /> {lesson.duration}</span>
                                    {lesson.is_locked ?
                                        <span className="flex items-center gap-1 text-red-900 bg-red-200 px-2 rounded-full text-xs font-bold w-fit">Premium</span> :
                                        <span className="flex items-center gap-1 text-green-900 bg-green-200 px-2 rounded-full text-xs font-bold w-fit">Grátis</span>
                                    }
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
