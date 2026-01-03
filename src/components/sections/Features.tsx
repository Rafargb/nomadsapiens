"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Globe, TrendingUp, Users } from "lucide-react"; // Icons for our niche
import styles from './Features.module.css';

interface FeatureItem {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
    image: string;
}

const featuresData: FeatureItem[] = [
    {
        id: 1,
        icon: Globe,
        title: "Liberdade Geográfica Real",
        description:
            "Não é apenas sobre viajar, é sobre viver. Aprenda a estruturar sua carreira para trabalhar de Bali, Lisboa ou do seu sofá.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 2,
        icon: TrendingUp,
        title: "Ganhos em Moeda Forte",
        description:
            "Pare de perder poder de compra. Ensinamos o caminho das pedras para prospectar clientes nos EUA e Europa e receber em Dólar ou Euro.",
        image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 3,
        icon: Users,
        title: "Networking de Outro Nível",
        description:
            "Conecte-se com mentores e alunos que já vivem essa realidade. O ambiente certo acelera seus resultados em 10x.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    },
];

export function Features() {
    const [currentFeature, setCurrentFeature] = useState(0);
    const [progress, setProgress] = useState(0);
    const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => {
                setCurrentFeature((prev) => (prev + 1) % featuresData.length);
                setProgress(0);
            }, 200);
        }
    }, [progress]);

    useEffect(() => {
        const activeFeatureElement = featureRefs.current[currentFeature];
        const container = containerRef.current;

        if (activeFeatureElement && container) {
            // Logic to scroll sidebar if needed on mobile, mainly
            // For this CSS module implementation, we'll keep it simple
        }
    }, [currentFeature]);

    const handleFeatureClick = (index: number) => {
        setCurrentFeature(index);
        setProgress(0);
    };

    return (
        <div className={styles.section}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.label}>
                        METODOLOGIA NOMAD ACADEMY
                    </span>
                    <h2 className={styles.title}>
                        Mais que um curso, um estilo de vida
                    </h2>
                </div>

                <div className={styles.grid}>
                    {/* Left Side - Features List */}
                    <div ref={containerRef} className={styles.featuresList}>
                        {featuresData.map((feature, index) => {
                            const Icon = feature.icon;
                            const isActive = currentFeature === index;

                            return (
                                <div
                                    key={feature.id}
                                    ref={(el) => {
                                        featureRefs.current[index] = el;
                                    }}
                                    className={`${styles.featureItem} ${isActive ? styles.active : ''}`}
                                    onClick={() => handleFeatureClick(index)}
                                >
                                    <div className={styles.iconWrapper}>
                                        <Icon size={24} color={isActive ? "white" : "var(--primary)"} />
                                    </div>

                                    <div className={styles.content}>
                                        <h3 className={styles.itemTitle}>{feature.title}</h3>
                                        <p className={styles.itemDesc}>{feature.description}</p>

                                        <div className={styles.progressBarBg}>
                                            {isActive && (
                                                <motion.div
                                                    className={styles.progressBarFill}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.1, ease: "linear" }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Side - Image Display */}
                    <div className={styles.imageContainer}>
                        <motion.div
                            key={currentFeature}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={styles.imageMotionWrapper}
                        >
                            <Image
                                src={featuresData[currentFeature].image}
                                alt={featuresData[currentFeature].title}
                                fill
                                className={styles.image}
                                priority
                                unoptimized
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
