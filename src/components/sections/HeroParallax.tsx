"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"
import { Play } from "lucide-react"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { Button } from "@/components/ui/Button"
import styles from './HeroParallax.module.css';

const videos = [
    {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
        title: "Mindset Nômade",
        duration: "12:45"
    },
    {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2670&auto=format&fit=crop",
        title: "Networking Global",
        duration: "08:30"
    },
    {
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
        title: "Gestão Financeira",
        duration: "15:20"
    },
    {
        url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop",
        title: "Freelancing 101",
        duration: "10:15"
    },
    {
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2670&auto=format&fit=crop",
        title: "Inglês para Negócios",
        duration: "20:00"
    },
    {
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2670&auto=format&fit=crop",
        title: "Vendas B2B",
        duration: "18:45"
    }
]

export const HeroParallax = () => {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        // Target the video card class from modules
        // Since we can't easily query selectors with hash modules, we can add a global helper class or just target 'div' inside if specific enough, or drag in a ref. 
        // Easier: add the hashed class, but finding it is hard in `animate`. 
        // Alternative: Just animate ALL video cards by adding a data attribute.
        animate(`[data-video-card]`, { opacity: [0, 1], scale: [0.8, 1] }, { duration: 0.5, delay: stagger(0.1) })
    }, [])

    return (
        <div className={styles.section} ref={scope}>
            {/* Central Content */}
            <motion.div
                className={styles.centerContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <span className={styles.badge}>
                    NOMAD ACADEMY
                </span>
                <h1 className={styles.title}>
                    Garanta a sua Vaga.
                    <br />
                    <span className={styles.highlight}>(O lugar, você escolhe).</span>
                </h1>
                <p className={styles.description}>
                    O hub de educação e lifestyle para quem quer o mundo como escritório.
                </p>
                <div className={styles.actions}>
                    <Button size="lg" variant="primary">Começar Jornada</Button>
                    <Button size="lg" variant="ghost">Ver Depoimentos</Button>
                </div>
            </motion.div>

            {/* Floating Elements */}
            <Floating sensitivity={-0.5}>

                {/* Top Left */}
                <FloatingElement depth={0.5} top="10%" left="5%">
                    <VideoCard video={videos[0]} width={200} />
                </FloatingElement>

                {/* Top Right */}
                <FloatingElement depth={1} top="15%" right="5%">
                    <VideoCard video={videos[1]} width={180} />
                </FloatingElement>

                {/* Middle Left */}
                <FloatingElement depth={0.3} top="40%" left="2%">
                    <VideoCard video={videos[2]} width={160} />
                </FloatingElement>

                {/* Middle Right */}
                <FloatingElement depth={0.8} top="45%" right="2%">
                    <VideoCard video={videos[3]} width={190} />
                </FloatingElement>

                {/* Bottom Left */}
                <FloatingElement depth={0.6} bottom="10%" left="15%">
                    <VideoCard video={videos[4]} width={170} />
                </FloatingElement>

                {/* Bottom Right */}
                <FloatingElement depth={0.4} bottom="15%" right="15%">
                    <VideoCard video={videos[5]} width={160} />
                </FloatingElement>

            </Floating>
        </div>
    )
}

const VideoCard = ({ video, width }: { video: any, width: number }) => (
    <motion.div
        className={styles.videoCard}
        style={{ width: `${width}px` }}
        initial={{ opacity: 0 }}
        whileHover={{ scale: 1.05, zIndex: 20 }}
        data-video-card // Marker for animation
    >
        <div className={styles.aspectWrapper}>
            <img src={video.url} alt={video.title} className={styles.thumbnail} />
            <div className={styles.playOverlay}>
                <div className={styles.playButton}>
                    <Play size={16} fill="white" className="text-white ml-0.5" />
                </div>
            </div>
            <div className={styles.duration}>
                {video.duration}
            </div>
        </div>
        <div className={styles.cardContent}>
            <div className={styles.liveIndicator}>
                <div className={styles.dot}></div>
                <span className={styles.liveText}>AO VIVO</span>
            </div>
            <h3 className={styles.cardTitle}>{video.title}</h3>
        </div>
    </motion.div>
)
