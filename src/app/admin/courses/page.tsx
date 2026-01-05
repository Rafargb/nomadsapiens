"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Edit, Video } from 'lucide-react';

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
        <div className="container mx-auto p-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meus Cursos</h1>
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
                        <Card key={course.id} className="p-4 bg-gray-900 border-gray-800">
                            <div className="relative aspect-video w-full mb-4 rounded overflow-hidden">
                                <img src={course.image_url} alt={course.title} className="object-cover w-full h-full" />
                            </div>
                            <h2 className="text-xl font-bold mb-2 text-white">{course.title}</h2>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                            <div className="flex flex-col gap-2">
                                <Link href={`/admin/courses/${course.id}/lessons`}>
                                    <Button variant="secondary" fullWidth size="sm">
                                        <Video size={16} className="mr-2" /> Gerenciar Aulas
                                    </Button>
                                </Link>
                                <Link href={`/offer/${course.id}`} target="_blank">
                                    <Button variant="ghost" fullWidth size="sm" className="text-green-400 hover:text-green-300 border border-green-900 bg-green-900/10">
                                        🔗 Link de Venda (Oferta)
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
