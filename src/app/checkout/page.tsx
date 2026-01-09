"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Lock, Shield, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

// Init Stripe outside component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        // Fetch Client Secret for the default course (MOCKED ID for now)
        async function initCheckout() {
            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        courseId: 1, // Default Course
                        courseTitle: 'Nômade Digital 2024',
                        price: 49.90,
                        userId: 'guest-user', // Should be real user
                        userEmail: 'guest@example.com', // Should be real
                        origin: window.location.origin,
                    }),
                });
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
                {/* Payment Form Area (Replaced by Stripe) */}
                <div className={styles.formColumn}>
                    <Card className={styles.card}>
                        {clientSecret ? (
                            <EmbeddedCheckoutProvider
                                stripe={stripePromise}
                                options={{ clientSecret }}
                            >
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Carregando pagamentos...
                            </div>
                        )}
                    </Card>
                </div>

                {/* Order Summary */}
                <div className={styles.summaryColumn}>
                    <div className={styles.summary}>
                        <h3>Resumo do Pedido</h3>
                        <div className={styles.item}>
                            <div className={styles.thumb} />
                            <div>
                                <h4>Nômade Digital 2024</h4>
                                <p>Rafael Barbosa</p>
                            </div>
                            <div className={styles.price}>R$ 49,90</div>
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

