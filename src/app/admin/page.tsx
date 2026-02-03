"use client";

import Link from 'next/link';
import { Eye, Info, ChevronRight, CreditCard, ArrowRight } from 'lucide-react';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        courses: 0,
        enrollments: 0,
        revenue: 0
    });
    const [recentSales, setRecentSales] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            // 1. Count Courses
            const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });

            // 2. Count Enrollments (Simulated Sales)
            const { count: enrollmentCount, data: enrollments } = await supabase
                .from('enrollments')
                .select('*, courses(title, image_url)')
                .order('created_at', { ascending: false })
                .limit(5);

            // 3. Mock Revenue (Enrollments * Avg Ticket R$ 97)
            const mockRevenue = (enrollmentCount || 0) * 97.90;

            setStats({
                courses: courseCount || 0,
                enrollments: enrollmentCount || 0,
                revenue: mockRevenue
            });

            if (enrollments) {
                setRecentSales(enrollments);
            }
        }
        fetchData();
    }, []);

    return (
        <div className={styles.gridContainer}>
            {/* Top Banner */}
            <div className={styles.banner}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerText}>
                        <span className={styles.bannerLabel}>PAINEL ADMINISTRATIVO</span>
                        <h1>Bem-vindo ao Nomad Sapiens</h1>
                        <div className={styles.brandBadge}>
                            <span className={styles.greenText}>Nomad Sapiens</span>
                        </div>
                        <p>Gerencie seus cursos, acompanhe vendas e expanda seu impacto global.</p>

                    </div>
                </div>
            </div>

            {/* Wallet Card */}
            <div className={styles.walletCard}>
                <div className={styles.cardHeader}>
                    <h3>Minha carteira</h3>
                    <Eye size={18} className={styles.iconMuted} />
                </div>
                <div className={styles.balance}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenue)}
                </div>
                <div className={styles.walletFooter}>
                    <div className={styles.walletInfo}>
                        <span>Antecipável:</span>
                        <strong>R$ 0,00</strong>
                    </div>
                    <div className={styles.walletActions}>
                        <button className={styles.actionBtn}><CreditCard size={14} /> Antecipar</button>
                        <button className={styles.actionBtnOutline}><ArrowRight size={14} /> Sacar</button>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statIconBag}></span>
                        <span>Vendas (Matrículas)</span>
                        <Info size={14} className={styles.infoIcon} />
                    </div>
                    <div className={styles.statValue}>{stats.enrollments}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statIconCal}></span>
                        <span>Cursos Ativos</span>
                        <Info size={14} className={styles.infoIcon} />
                    </div>
                    <div className={styles.statValue}>{stats.courses}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statIconDollar}></span>
                        <span>Vendas totais (Est.)</span>
                        <Info size={14} className={styles.infoIcon} />
                    </div>
                    <div className={styles.statValue}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenue)}
                    </div>
                </div>
            </div>

            {/* Recent Sales (Right Column) */}
            <div className={styles.recentSales}>
                <div className={styles.sectionHeader}>
                    <h3>Vendas recentes</h3>
                    <a href="#" className={styles.linkMore}>Mais <ChevronRight size={14} /></a>
                </div>

                <div className={styles.salesList}>
                    {recentSales.length === 0 ? (
                        <div className={styles.saleItem}>
                            <div className={styles.saleInfo}>
                                <h4>Nenhuma venda recente</h4>
                                <span className={styles.saleMeta}>Aguardando dados...</span>
                            </div>
                        </div>
                    ) : recentSales.map((sale, i) => (
                        <div key={i} className={styles.saleItem}>
                            <div className={styles.saleInfo}>
                                <h4>{sale.courses?.title || 'Curso Desconhecido'}</h4>
                                <span className={styles.saleMeta}>
                                    {new Date(sale.created_at).toLocaleDateString('pt-BR')} | Pix
                                </span>
                            </div>
                            <div className={styles.saleThumb}>
                                {sale.courses?.image_url && (
                                    <img
                                        src={sale.courses.image_url}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart (Bottom Left) */}
            <div className={styles.chartSection}>
                <div className={styles.chartHeader}>
                    <div className={styles.chartLegend}>
                        <span className={styles.legendItem}><span className={styles.dotLocal}></span>Vendas últimos 7 dias / R$</span>
                    </div>
                </div>
                <div className={styles.chartArea}>
                    {/* CSS Grid lines for mock chart logic handled in CSS for now */}
                </div>
            </div>
        </div>
    );
}
