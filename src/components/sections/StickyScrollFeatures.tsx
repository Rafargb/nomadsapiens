"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './StickyScrollFeatures.module.css';

// --- Data for the feature cards (Adapted for Nomad Academy) ---
// --- Data for the feature cards (Adapted for Nomad Academy) ---
const features = [
    {
        title: "Nômade Digital Completo 2024",
        description: "O guia definitivo para quem quer começar. Domine as ferramentas, encontre os melhores destinos e desenhe seu plano de fuga do escritório. Tudo o que você precisa em um só lugar.",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        bgColor: "var(--secondary-bg)", // Using project colors
        textColor: "var(--foreground)"
    },
    {
        title: "Inglês para Negócios Globais",
        description: "Não deixe o idioma ser uma barreira. Aprenda a negociar contratos, passar em entrevistas internacionais e se comunicar com confiança em qualquer fuso horário.",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        bgColor: "#e0e7ff", // Light Indigo
        textColor: "var(--foreground)"
    },
    {
        title: "Freelancer de Alta Performance",
        description: "Pare de vender horas e comece a vender valor. Técnicas avançadas de negociação, precificação e gestão de clientes para quem quer ganhar em dólar.",
        imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
        bgColor: "#fce7f3", // Light Pink
        textColor: "var(--foreground)"
    },
    {
        title: "Gestão Financeira Internacional",
        description: "Receba em múltiplas moedas, legalizar seus ganhos e invista globalmente. Desmistificamos a burocracia para você focar no que importa: sua liberdade.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        bgColor: "#dcfce7", // Light Green
        textColor: "var(--foreground)"
    },
];

// --- Custom Hook for Scroll Animation ---
const useScrollAnimation = () => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return { ref, inView };
};

// --- Header Component ---
const AnimatedHeader = () => {
    const { ref: headerRef, inView: headerInView } = useScrollAnimation();
    const { ref: pRef, inView: pInView } = useScrollAnimation();

    return (
        <div className={styles.headerWrapper}>
            <h2
                ref={headerRef}
                className={`${styles.title} ${headerInView ? styles.visible : styles.hidden}`}
            >
                Os Caminhos Mais <span className="text-gradient">Procurados</span>
            </h2>
            <p
                // @ts-ignore
                ref={pRef}
                className={`${styles.subtitle} ${pInView ? styles.visible : styles.hidden}`}
            >
                Descubra as trilhas que milhares de alunos já percorreram para alcançar a liberdade.
            </p>
        </div>
    );
};

// Main Component
export function StickyScrollFeatures() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.wrapper}>

                    <AnimatedHeader />

                    <div className={styles.cardsContainer}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={styles.card}
                                style={{
                                    backgroundColor: feature.bgColor,
                                    top: `calc(100px + ${index * 40}px)`, // Increased spacing for better visibility
                                    zIndex: index + 1 // Ensure visual stacking order
                                }}
                            >
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{feature.title}</h3>
                                    <p className={styles.cardDescription} style={{ color: feature.textColor }}>{feature.description}</p>
                                    <button className={styles.cardButton}>Ver Detalhes</button>
                                </div>

                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={feature.imageUrl}
                                        alt={feature.title}
                                        fill
                                        className={styles.image}
                                        unoptimized // Fix for broken images in some environments
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
