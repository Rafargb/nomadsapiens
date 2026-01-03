"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import styles from './CorporateHero.module.css';

export const CorporateHero = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {/* Left: Image (Reference has image on left) */}
                    <div className={styles.imageWrapper}>
                        <div className={styles.imageCard}>
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2670&auto=format&fit=crop"
                                alt="Nomad Lifestyle"
                                fill
                                className={styles.heroImage}
                                priority
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className={styles.content}>
                        <h1 className={styles.title}>
                            Garanta a sua Vaga.<br />
                            <span className={styles.highlight}>(O lugar, você escolhe).</span>
                        </h1>

                        <p className={styles.description}>
                            O hub de educação e lifestyle para quem quer o mundo como escritório.
                            Nós fornecemos as ferramentas inovadoras para você construir sua liberdade.
                        </p>

                        <div className={styles.bulletPoints}>
                            <div className={styles.bullet}>
                                <span className={styles.dot}></span>
                                <p>Formação completa em profissões digitais de alta demanda</p>
                            </div>
                            <div className={styles.bullet}>
                                <span className={styles.dot}></span>
                                <p>Networking estratégico com nômades experientes</p>
                            </div>
                            <div className={styles.bullet}>
                                <span className={styles.dot}></span>
                                <p>Consultoria para internacionalização de carreira</p>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button size="lg" variant="primary">Começar Jornada</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
