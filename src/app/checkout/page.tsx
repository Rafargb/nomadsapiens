"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Shield, CheckCircle, CreditCard } from 'lucide-react';
import styles from './page.module.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

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

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const coursePrice = 49.90;

    useEffect(() => {
        async function initCheckout() {
            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        courseId: 1,
                        courseTitle: 'Nômade Digital 2024',
                        price: coursePrice,
                        userId: 'guest-user',
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
    }, []);

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

                        {clientSecret ? (
                            <Elements stripe={stripePromise} options={{
                                clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                    variables: { colorPrimary: '#5022c3' }
                                }
                            }}>
                                <CheckoutForm price={coursePrice} clientSecret={clientSecret} />
                            </Elements>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Carregando formulário seguro...
                            </div>
                        )}
                    </Card>
                </div>

                {/* Order Summary Column */}
                <div className={styles.summaryColumn}>
                    <div className={styles.summary}>
                        <h3>Resumo do Pedido</h3>
                        <div className={styles.item}>
                            <div className="relative w-[60px] h-[60px] rounded overflow-hidden flex-shrink-0 bg-gray-200">
                                <img
                                    src="/logo.png"
                                    alt="Capa do Curso"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4>Nômade Digital 2024</h4>
                                <p>Rafael Barbosa</p>
                            </div>
                            <div className={styles.price}>R$ {coursePrice.toFixed(2).replace('.', ',')}</div>
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

