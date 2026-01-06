"use client"

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import {
    Briefcase,
    Clock,
    MapPin,
    TrendingUp,
    Globe,
    DollarSign,
    LucideIcon,
    Building2,
    Palmtree
} from 'lucide-react';
import styles from './MatrixChoice.module.css';

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ChoiceId = 'blue' | 'red';

export interface FeatureMetric {
    label: string;
    value: number; // 0-100
    icon: LucideIcon;
}

export interface ChoiceData {
    id: ChoiceId;
    label: string;
    title: string;
    description: string;
    image: string;
    colors: {
        gradient: string; // CSS gradient string
        glow: string;     // CSS color
        ring: string;     // CSS border color
    };
    stats: {
        status: string;
        level: number;
    };
    features: FeatureMetric[];
}

const CHOICE_DATA: Record<ChoiceId, ChoiceData> = {
    blue: {
        id: 'blue',
        label: 'A Ilusão',
        title: 'Vida CLT',
        description: 'A zona de conforto. Acordar cedo, pegar trânsito, bater ponto e esperar as férias uma vez por ano. Seguro, previsível e limitado.',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
        colors: {
            gradient: 'linear-gradient(135deg, #1e3a8a, #172554)', // Blue to Dark Blue
            glow: '#3b82f6',
            ring: 'rgba(59, 130, 246, 0.5)',
        },
        stats: { status: 'Estagnado', level: 20 },
        features: [
            { label: 'Liberdade', value: 15, icon: MapPin },
            { label: 'Stress', value: 95, icon: Clock },
        ],
    },
    red: {
        id: 'red',
        label: 'A Verdade',
        title: 'Vida Nômade',
        description: 'O despertar. Trabalhar de onde quiser, ganhar em moeda forte e desenhar a própria rotina. Desafiador, livre e sem fronteiras.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
        colors: {
            gradient: 'linear-gradient(135deg, #15803d, #052e16)', // Green to Dark Green (Matrix/Money)
            glow: '#22c55e',
            ring: 'rgba(34, 197, 94, 0.5)',
        },
        stats: { status: 'Em Crescimento', level: 98 },
        features: [
            { label: 'Liberdade', value: 100, icon: Globe },
            { label: 'Ganhos', value: 85, icon: DollarSign },
        ],
    },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 },
        },
    } as Variants,
    item: {
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
        exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
    } as Variants,
};

const getImageVariants = (isLeft: boolean): Variants => ({
    initial: {
        opacity: 0,
        scale: 1.5,
        filter: 'blur(15px)',
        rotate: isLeft ? -30 : 30,
        x: isLeft ? -80 : 80,
    },
    animate: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        rotate: 0,
        x: 0,
        transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
    exit: {
        opacity: 0,
        scale: 0.6,
        filter: 'blur(20px)',
        transition: { duration: 0.25 },
    },
});

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const BackgroundGradient = ({ isLeft }: { isLeft: boolean }) => (
    <div className={styles.backgroundGradient}>
        <motion.div
            animate={{
                background: isLeft
                    ? 'radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.15), transparent 50%)' // Blueish
                    : 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.15), transparent 50%)', // Greenish
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.gradientBlob}
        />
    </div>
);

const ChoiceVisual = ({ data, isLeft }: { data: ChoiceData; isLeft: boolean }) => (
    <motion.div layout="position" className={styles.visualContainer}>
        {/* Animated Rings */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className={styles.rings}
            style={{ borderColor: data.colors.ring }}
        />
        <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className={styles.glow}
            style={{ background: data.colors.gradient }}
        />

        {/* Image Container */}
        <div className={styles.imageFrame}>
            <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={data.id}
                        src={data.image}
                        alt={`${data.title}`}
                        variants={getImageVariants(isLeft)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={styles.productImage}
                        draggable={false}
                    />
                </AnimatePresence>
            </motion.div>
        </div>

        {/* Status Label */}
        <motion.div
            layout="position"
            className={styles.statusLabel}
        >
            <div className={styles.statusBadge}>
                <span
                    className={styles.statusDot}
                    style={{ backgroundColor: data.colors.glow }}
                />
                {data.stats.status}
            </div>
        </motion.div>
    </motion.div>
);

const ChoiceDetails = ({ data, isLeft }: { data: ChoiceData; isLeft: boolean }) => {
    const alignClass = isLeft ? styles.detailsLeft : styles.detailsRight;
    const barColor = isLeft ? '#3b82f6' : '#22c55e'; // Blue or Green
    const barPosition = isLeft ? { left: 0 } : { right: 0 };
    const rowReverse = !isLeft ? styles.featureRowReverse : '';
    const justifyRow = !isLeft ? 'flex-end' : 'flex-start';

    return (
        <motion.div
            variants={ANIMATIONS.container}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${styles.detailsContainer} ${alignClass}`}
        >
            <motion.h2 variants={ANIMATIONS.item} className={styles.label}>
                {data.label}
            </motion.h2>
            <motion.h1 variants={ANIMATIONS.item} className={styles.title}>
                {data.title}
            </motion.h1>
            <motion.p variants={ANIMATIONS.item} className={styles.description}>
                {data.description}
            </motion.p>

            {/* Feature Grid */}
            <motion.div variants={ANIMATIONS.item} className={styles.featureCard}>
                {data.features.map((feature, idx) => (
                    <div key={feature.label}>
                        <div className={`${styles.featureRow} ${rowReverse}`}>
                            <div className={`${styles.featureLabel} ${feature.value > 50 ? 'text-zinc-200' : 'text-zinc-400'}`}>
                                <feature.icon size={16} /> <span>{feature.label}</span>
                            </div>
                            <span className={styles.featureValue}>{feature.value}%</span>
                        </div>
                        <div className={styles.progressBar}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${feature.value}%` }}
                                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                                className={styles.progressFill}
                                style={{ backgroundColor: barColor, ...barPosition }}
                            />
                        </div>
                    </div>
                ))}

                <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: justifyRow }}>
                    {isLeft ? (
                        <Building2 size={24} style={{ opacity: 0.5 }} />
                    ) : (
                        <Palmtree size={24} style={{ opacity: 0.5, color: '#22c55e' }} />
                    )}
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={ANIMATIONS.item} className={`${styles.statsRow} ${!isLeft ? 'flex-row-reverse' : ''}`}>
                <TrendingUp size={16} />
                <span>Nível de Satisfação: {data.stats.level}%</span>
            </motion.div>
        </motion.div>
    );
};

const Switcher = ({
    activeId,
    onToggle
}: {
    activeId: ChoiceId;
    onToggle: (id: ChoiceId) => void
}) => {
    const options = Object.values(CHOICE_DATA).map(p => ({ id: p.id, label: p.label }));

    return (
        <div className={styles.switcherContainer}>
            <motion.div layout className={styles.switcherWrapper}>
                {options.map((opt) => (
                    <motion.button
                        key={opt.id}
                        onClick={() => onToggle(opt.id)}
                        whileTap={{ scale: 0.96 }}
                        className={`${styles.switchButton} ${activeId === opt.id ? styles.active : ''}`}
                    >
                        {activeId === opt.id && (
                            <motion.div
                                layoutId="island-surface"
                                className={styles.activeBackground}
                                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                            />
                        )}
                        <span style={{ position: 'relative', zIndex: 10 }}>
                            {opt.label}
                        </span>
                        {activeId === opt.id && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={styles.activeIndicator}
                            />
                        )}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

// =========================================
// 4. MAIN COMPONENT
// =========================================

export const MatrixChoice = () => {
    const [activeSide, setActiveSide] = useState<ChoiceId>('blue'); // Start with Blue (Illusion)

    const currentData = CHOICE_DATA[activeSide];
    const isLeft = activeSide === 'blue'; // Blue is Left, Red/Green is Right

    return (
        <section className={styles.section}>

            <BackgroundGradient isLeft={isLeft} />

            <div className={styles.container}>
                <motion.div
                    layout
                    transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
                    className={`${styles.contentWrapper} ${!isLeft ? styles.reverse : ''}`}
                >
                    {/* Visual Column */}
                    <ChoiceVisual data={currentData} isLeft={isLeft} />

                    {/* Details Column */}
                    <motion.div layout="position" style={{ width: '100%', maxWidth: '28rem' }}>
                        <AnimatePresence mode="wait">
                            <ChoiceDetails
                                key={activeSide}
                                data={currentData}
                                isLeft={isLeft}
                            />
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>

            <Switcher activeId={activeSide} onToggle={setActiveSide} />
        </section>
    );
}
