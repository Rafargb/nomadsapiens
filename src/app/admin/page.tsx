"use client";

import { Card } from '@/components/ui/Card';
import { DollarSign, Users, BookOpen, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboard() {
    const stats = [
        { title: 'Faturamento Total', value: 'R$ 124.590', icon: DollarSign, trend: '+12% este mês' },
        { title: 'Alunos Ativos', value: '2.450', icon: Users, trend: '+54 novos' },
        { title: 'Cursos Publicados', value: '12', icon: BookOpen, trend: '2 em rascunho', active: true },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dashboard do Instrutor</h1>
                <p>Bem-vindo de volta, Rafael.</p>
            </header>

            <div className={styles.statsGrid}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <span className={styles.statTitle}>{stat.title}</span>
                                <Icon size={20} className={styles.statIcon} />
                            </div>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statTrend}>
                                <TrendingUp size={14} /> {stat.trend}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className={styles.recentSection}>
                <h2>Vendas Recentes</h2>
                <Card className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Aluno</th>
                                <th>Curso</th>
                                <th>Data</th>
                                <th>Valor (Seu Split)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Maria Silva</td>
                                <td>Nômade Digital 2024</td>
                                <td>Hoje, 14:30</td>
                                <td className={styles.income}>+ R$ 34,50</td>
                                <td><span className={styles.badgeSuccess}>Aprovado</span></td>
                            </tr>
                            <tr>
                                <td>João Santos</td>
                                <td>Inglês para Viagem</td>
                                <td>Ontem, 09:12</td>
                                <td className={styles.income}>+ R$ 22,90</td>
                                <td><span className={styles.badgeSuccess}>Aprovado</span></td>
                            </tr>
                            <tr>
                                <td>Ana Costa</td>
                                <td>Fotografia Mobile</td>
                                <td>28/12/2024</td>
                                <td className={styles.income}>+ R$ 45,00</td>
                                <td><span className={styles.badgePending}>Processando</span></td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
}
