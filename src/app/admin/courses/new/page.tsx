"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Users, DollarSign, PieChart } from 'lucide-react';
import styles from './page.module.css';

export default function NewCoursePage() {
    const [price, setPrice] = useState(199.90);
    const [platformFee, setPlatformFee] = useState(10); // 10% platform fee
    const [instructors, setInstructors] = useState([
        { id: 1, name: 'Rafael Barbosa', share: 100 }
    ]);

    const addInstructor = () => {
        // Logic to split share (mock)
        const newShare = 50;
        setInstructors([
            { id: 1, name: 'Rafael Barbosa', share: 50 },
            { id: 2, name: 'Sarah Jenkins', share: 50 } // Mock addition
        ]);
    };

    const calculateEarnings = (share: number) => {
        const net = price * ((100 - platformFee) / 100);
        return (net * (share / 100)).toFixed(2);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Criar Novo Curso</h1>
                <div className={styles.actions}>
                    <Button variant="ghost">Cancelar</Button>
                    <Button>Salvar e Publicar</Button>
                </div>
            </header>

            <div className={styles.grid}>
                {/* Main Form */}
                <div className={styles.formColumn}>
                    <section className={styles.section}>
                        <h2>Informações Básicas</h2>
                        <div className={styles.inputGroup}>
                            <label>Título do Curso</label>
                            <input type="text" placeholder="Ex: Como se tornar um Nômade Digital" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Preço (R$)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className={styles.input}
                            />
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Split de Pagamento (Comissões)</h2>
                            <span className={styles.badge}>Automático</span>
                        </div>
                        <p className={styles.hint}>Defina como o lucro da venda será dividido entre os instrutores.</p>

                        <div className={styles.splitCard}>
                            <div className={styles.platformRow}>
                                <div className={styles.user}>
                                    <div className={styles.avatar}>🏛️</div>
                                    <span>Taxa da Plataforma</span>
                                </div>
                                <div className={styles.shareInput}>
                                    <span>{platformFee}%</span>
                                </div>
                                <div className={styles.earnings}>
                                    R$ {(price * (platformFee / 100)).toFixed(2)} / venda
                                </div>
                            </div>

                            <div className={styles.divider} />

                            {instructors.map((inst) => (
                                <div key={inst.id} className={styles.instructorRow}>
                                    <div className={styles.user}>
                                        <div className={styles.avatar}>👤</div>
                                        <span>{inst.name}</span>
                                    </div>
                                    <div className={styles.shareInput}>
                                        <input type="number" value={inst.share} readOnly className={styles.smallInput} />
                                        <span>%</span>
                                    </div>
                                    <div className={styles.earnings}>
                                        R$ {calculateEarnings(inst.share)} / venda
                                    </div>
                                </div>
                            ))}

                            {instructors.length < 2 && (
                                <button onClick={addInstructor} className={styles.addBtn}>
                                    + Adicionar Co-instrutor
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Summary */}
                <div className={styles.simulationColumn}>
                    <Card className={styles.summaryCard}>
                        <h3>Simulação de Venda</h3>
                        <div className={styles.bigPrice}>R$ {price.toFixed(2)}</div>

                        <div className={styles.chartWrapper}>
                            <PieChart size={120} className={styles.placeholderChart} />
                            {/* Visualization would use a real chart lib in prod */}
                        </div>

                        <div className={styles.breakdown}>
                            <div className={styles.row}>
                                <span>Plataforma ({platformFee}%)</span>
                                <strong>R$ {(price * (platformFee / 100)).toFixed(2)}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Instrutores (Net)</span>
                                <strong>R$ {(price * ((100 - platformFee) / 100)).toFixed(2)}</strong>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
