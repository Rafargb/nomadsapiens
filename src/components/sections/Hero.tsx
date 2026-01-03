import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import styles from './Hero.module.css';

export const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.imageContainer}>
                <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2670&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    className={styles.bgImage}
                    priority
                />
            </div>

            <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                <div className={styles.floatingCard}>
                    <h1>Aprenda sem limites</h1>
                    <p>
                        Comece, troque ou avance de carreira com mais de 600 cursos.
                        Preços a partir de R$ 22,90 até hoje.
                    </p>
                    <div className={styles.actions}>
                        <Button size="lg" fullWidth>Ver Promoções</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
