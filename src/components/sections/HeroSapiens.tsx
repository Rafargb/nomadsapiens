import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSapiens.module.css';

export const HeroSapiens = () => {
    return (
        <section className={styles.section}>
            <div className={styles.background}>
                <Image
                    src="/hero-nomad-v2.jpg"
                    alt="Nomad Sapiens in nature"
                    fill
                    className={styles.backgroundImage}
                    priority
                    quality={90}
                />
                <div className={styles.overlay}></div>
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Volte para a<br />
                        sua natureza.
                    </h1>
                    <p className={styles.subtitle}>
                        Não somos feitos para escritórios fechados. O Nomad Sapiens usa a tecnologia para recuperar a liberdade geográfica que está no nosso DNA.
                    </p>
                    <Link href="/register">
                        <button className={styles.ctaButton}>
                            Começar Evolução
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
