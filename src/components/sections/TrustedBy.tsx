import Image from 'next/image';
import styles from './TrustedBy.module.css';

export const TrustedBy = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <p className={styles.text}>Mais de 15.000 empresas e milhões de alunos confiam no Nomad Academy</p>
                <div className={styles.logos}>
                    {/* Using text placeholders styled as logos for MVP speed, or generic SVG shapes */}
                    <span className={styles.logo}>VOLKSWAGEN</span>
                    <span className={styles.logo}>SAMSUNG</span>
                    <span className={styles.logo}>CISCO</span>
                    <span className={styles.logo}>AT&T</span>
                    <span className={styles.logo}>PROCTER & GAMBLE</span>
                    <span className={styles.logo}>HEWLETT PACKARD</span>
                    <span className={styles.logo}>CITI</span>
                    <span className={styles.logo}>ERICSSON</span>
                </div>
            </div>
        </section>
    );
};
