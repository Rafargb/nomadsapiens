"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [courseId, setCourseId] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            return;
        }

        async function verifyAndEnroll() {
            try {
                // 1. Verify with Stripe API
                const response = await fetch('/api/checkout/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId }),
                });

                const data = await response.json();

                if (data.success) {
                    setCourseId(data.courseId);

                    // 2. Insert Enrollment in Supabase
                    // (Ensure user is logged in first)
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        const { error } = await supabase
                            .from('enrollments')
                            .insert({
                                user_id: session.user.id,
                                course_id: parseInt(data.courseId),
                            });

                        if (!error || error.code === '23505') { // 23505 = unique violation (already enrolled)
                            setStatus('success');
                        } else {
                            console.error('Enrollment error:', error);
                            setStatus('error');
                        }
                    } else {
                        setStatus('error'); // User not logged in?
                    }

                } else {
                    setStatus('error');
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        }

        verifyAndEnroll();
    }, [sessionId]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-red-600" size={48} />
                <h1 className="text-2xl font-bold">Confirmando pagamento...</h1>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-red-900/20 p-4 rounded-full">
                    <span className="text-red-500 text-4xl">!</span>
                </div>
                <h1 className="text-2xl font-bold text-red-500">Algo deu errado.</h1>
                <p className="text-gray-400">Não conseguimos confirmar sua matrícula. Entre em contato com o suporte.</p>
                <Button onClick={() => router.push('/')} variant="secondary">Voltar ao Início</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-green-500/10 p-6 rounded-full">
                <CheckCircle className="text-green-500" size={64} />
            </div>
            <h1 className="text-4xl font-bold text-white">Pagamento Confirmado!</h1>
            <p className="text-xl text-gray-300 max-w-md">
                Parabéns! Você agora é um membro oficial. Sua jornada começa agora.
            </p>
            <div className="flex gap-4 mt-4">
                <Button onClick={() => router.push(`/learn/netflix/${courseId}/1`)} variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 border-none">
                    ACESSAR AULA AGORA
                </Button>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4">
            <Suspense fallback={<div>Carregando...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
