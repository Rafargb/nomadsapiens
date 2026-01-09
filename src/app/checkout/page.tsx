"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Shield, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabaseClient';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ price, clientSecret }: { price: number, clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the user is redirected after the payment
                return_url: `${window.location.origin}/checkout/success`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message ?? "Ocorreu um erro desconhecido.");
        } else {
            setMessage("Ocorreu um erro inesperado.");
        }

        setIsLoading(false);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* We use Stripe's PaymentElement which handles tabs for Card/Pix internally and elegantly */}
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

            {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}

            <Button fullWidth type="submit" disabled={isLoading || !stripe || !elements}>
                {isLoading ? "Processando..." : `Pagar R$ ${price.toFixed(2).replace('.', ',')}`}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <Lock size={12} /> Pagamento 100% Seguro via Stripe
            </div>
        </form>
    );
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const courseIdParam = searchParams.get('courseId');

    const [course, setCourse] = useState<any>(null);
    const [loadingCourse, setLoadingCourse] = useState(true);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // 1. Fetch Course Data
    useEffect(() => {
        async function fetchCourse() {
            setLoadingCourse(true);
            try {
                // If no ID provided, default to 1 (or handle error)
                const idToFetch = courseIdParam || '1';

                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', idToFetch)
                    .single();

                if (error) {
                    console.error('Error fetching course:', error);
                    // Fallback to static data if DB fail
                    setCourse({
                        id: 1,
                        title: 'Nômade Digital 2024',
                        instructor: 'Rafael Barbosa',
                        price: 49.90,
                        image_url: '/nomad-sapiens-logo.png'
                    });
                } else if (data) {
                    setCourse(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingCourse(false);
            }
        }
        fetchCourse();
    }, [courseIdParam]);

    // 2. Init Checkout only AFTER we have the course
    useEffect(() => {
        if (!course) return;

        async function initCheckout() {
            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        courseId: course.id,
                        courseTitle: course.title,
                        price: course.price,
                        userId: 'guest-user', // In real app, fetch from auth context
                        userEmail: 'guest@example.com',
                        origin: window.location.origin,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                }
            } catch (err) {
                console.error(err);
            }
        }
        initCheckout();
    }, [course]);

    if (loadingCourse) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    if (!course) return <div>Curso não encontrado.</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Checkout Seguro</h2>
                <div className={styles.secureBadge}>
                    <Lock size={14} /> 256-bit SSL Encrypted
                </div>
            </header>

            <div className={styles.grid}>
                {/* Payment Form Column */}
                <div className={styles.formColumn}>
                    <Card className={styles.card}>
                        <h3 className="mb-6 text-lg font-semibold">Método de Pagamento</h3>

                        {/* Custom visual tabs were replaced by Stripe's internal tabs for better security/handling */}
                        {/* But the layout structure is now preserved (White Card + Sidebar) */}

                        {/* Check if price is valid > 0 */}
                        {course.price && course.price > 0 ? (
                            clientSecret ? (
                                <Elements stripe={stripePromise} options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'stripe',
                                        variables: { colorPrimary: '#5022c3' }
                                    }
                                }}>
                                    <CheckoutForm price={course.price} clientSecret={clientSecret} />
                                </Elements>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <Loader2 className="animate-spin mx-auto mb-2" />
                                    Preparando pagamento...
                                </div>
                            )
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>Este produto não está disponível para compra online no momento.</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Order Summary Column */}
                <div className={styles.summaryColumn}>
                    <div className={styles.summary}>
                        <h3>Resumo do Pedido</h3>
                        <div className={styles.item}>
                            <div className={styles.thumbWrapper}>
                                <img
                                    src={course.image_url || '/nomad-sapiens-logo.png'}
                                    alt={course.title}
                                />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm line-clamp-2">{course.title}</h4>
                                <p className="text-xs text-gray-500">{course.instructor || 'Nomad Sapiens'}</p>
                            </div>
                            <div className={styles.price}>
                                R$ {Number(course.price || 0).toFixed(2).replace('.', ',')}
                            </div>
                        </div>

                        <div className={styles.policies}>
                            <p>Ao completar sua compra você concorda com nossos Termos de Serviço.</p>
                            <p>Garantia de 30 dias.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Carregando...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
