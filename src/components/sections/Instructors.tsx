import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import styles from './Instructors.module.css';

const NOMADS = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Escritora Freelance",
        location: "Bali, Indonésia",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
    },
    {
        id: 2,
        name: "Marcus Chen",
        role: "Desenvolvedor de Software",
        location: "Lisboa, Portugal",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        role: "Marketing Digital",
        location: "Medellín, Colômbia",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
    },
];

export const Instructors = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-gradient">Aprenda com Nômades Reais</h2>
                    <p>Pessoas reais, habilidades reais, liberdade real.</p>
                </div>

                <div className={styles.grid}>
                    {NOMADS.map((nomad) => (
                        <Card key={nomad.id} hoverEffect className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={nomad.image}
                                    alt={nomad.name}
                                    fill
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.info}>
                                <h3>{nomad.name}</h3>
                                <p className={styles.role}>{nomad.role}</p>
                                <div className={styles.location}>
                                    <span>📍</span> {nomad.location}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
