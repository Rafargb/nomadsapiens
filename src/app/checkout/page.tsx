"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, CreditCard, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function CheckoutPage() {
    const [success, setSuccess] = useState(false);

    const handlePayment = () => {
        // Mock payment processing
        setSuccess(true);
    };

    if (success) {
        return (
            <div className={styles.successContainer}>
                <CheckCircle size={64} color="#16a34a" />
                <h1>Pagamento Confirmado!</h1>
                <p>Você já pode acessar seu curso.</p>
                <Button onClick={() => window.location.href = '/learn/1/1'}>
                    Começar a Aprender
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Checkout Seguro</h2>
                <div className={styles.secureBadge}>
                    <Lock size={14} /> 256-bit SSL Encrypted
                </div>
            </header>

            <div className={styles.grid}>
                {/* Payment Form */}
                <div className={styles.formColumn}>
                    <Card className={styles.card}>
                        <h3>Método de Pagamento</h3>

                        <div className={styles.tabs}>
                            <div className={`${styles.tab} ${styles.activeTab}`}>
                                <CreditCard size={20} /> Cartão de Crédito
                            </div>
                            <div className={styles.tab}>
                                <span>PIX</span>
                            </div>
                        </div>

                        <form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Nome no Cartão</label>
                                <input type="text" placeholder="Nome como aparece no cartão" className={styles.input} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Número do Cartão</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className={styles.input} />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Validade</label>
                                    <input type="text" placeholder="MM/AA" className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>CVC</label>
                                    <input type="text" placeholder="123" className={styles.input} />
                                </div>
                            </div>

                            <div className={styles.totalRow}>
                                <span>Total:</span>
                                <span className={styles.totalPrice}>R$ 49,90</span>
                            </div>

                            <Button fullWidth onClick={handlePayment} type="button">
                                Finalizar Pagamento
                            </Button>
                        </form>
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
