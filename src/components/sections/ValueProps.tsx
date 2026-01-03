import { Globe, DollarSign, Users } from 'lucide-react';
import styles from './ValueProps.module.css';

export const ValueProps = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={`${styles.item} animate-fade-in`}>
                        <div className={styles.iconWrapper}>
                            <Globe className={styles.icon} size={32} />
                        </div>
                        <h3>Trabalhe de Qualquer Lugar</h3>
                        <p>Bali, Lisboa, Medellín. Seu escritório é onde você abrir o laptop.</p>
                    </div>
                    <div className={`${styles.item} animate-fade-in`}>
                        <div className={styles.iconWrapper}>
                            <DollarSign className={styles.icon} size={32} />
                        </div>
                        <h3>Ganhe em Moeda Forte</h3>
                        <p>Pare de ganhar em moeda local. Aprenda habilidades que pagam em USD e EUR.</p>
                    </div>
                    <div className={`${styles.item} animate-fade-in`}>
                        <div className={styles.iconWrapper}>
                            <Users className={styles.icon} size={32} />
                        </div>
                        <h3>Junte-se à Tribo</h3>
                        <p>Conecte-se com milhares de nômades na mesma jornada que você.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
