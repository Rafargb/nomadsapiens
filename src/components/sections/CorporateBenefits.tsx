"use client";

import { Globe, TrendingUp, Users, Laptop } from 'lucide-react';
import styles from './CorporateBenefits.module.css';

const benefits = [
    {
        icon: Laptop,
        title: "Acesso Vitalício ao Conteúdo",
        description: "Todo o material didático, atualizações e novas aulas ficam disponíveis para você acessar quando e onde quiser, sem expiração."
    },
    {
        icon: Users,
        title: "Comunidade Exclusiva",
        description: "Entre para o nosso círculo fechado de nômades digitais. Troque experiências, consiga indicações de jobs e faça parceiros de viagem."
    },
    {
        icon: TrendingUp,
        title: "Mentoria de Carreira",
        description: "Calls mensais com especialistas para desenhar o seu plano de transição de carreira e garantir que você ganhe em moeda forte."
    }
];

export const CorporateBenefits = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={index} className={styles.card}>
                                <div className={styles.iconWrapper}>
                                    <Icon size={32} />
                                </div>
                                <h3 className={styles.cardTitle}>{benefit.title}</h3>
                                <p className={styles.cardDescription}>{benefit.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
