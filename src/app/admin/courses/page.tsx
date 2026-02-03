"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Edit, Video, ExternalLink } from 'lucide-react';

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('id', { ascending: false });

        if (data) setCourses(data);
        setLoading(false);
    }

    return (
        <div style={{ color: '#1a1a1a' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Meus Cursos</h1>
                    <p className="text-gray-500">Gerencie seu portfólio de produtos educacionais.</p>
                </div>
                <Link href="/admin/create-course">
                    <Button>
                        <Plus size={18} className="mr-2" /> Novo Curso
                    </Button>
                </Link>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            <div className="relative aspect-video w-full bg-gray-100">
                                <img src={course.image_url} alt={course.title} className="object-cover w-full h-full" />
                            </div>
                            <div className="p-5">
                                <h2 className="text-lg font-bold mb-2 text-gray-900 line-clamp-1">{course.title}</h2>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{course.description || 'Sem descrição definida.'}</p>

                                <div className="flex flex-col gap-2">
                                    <Link href={`/admin/courses/${course.id}/lessons`}>
                                        <Button variant="secondary" fullWidth size="sm" className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200">
                                            <Video size={16} className="mr-2" /> Gerenciar Aulas
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
