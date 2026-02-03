import styles from './dashboard.module.css';
import {
    Home,
    ShoppingBag,
    Wallet,
    BarChart2,
    Clock,
    Gift,
    Settings
} from 'lucide-react';

export default function AdminSidebar() {
    return (
        <aside className={styles.sidebar}>


            <nav className={styles.nav}>
                <a href="/admin" className={`${styles.navItem} ${styles.active}`} title="Dashboard" data-label="Dashboard">
                    <Home size={22} />
                </a>
                <a href="/admin/courses" className={styles.navItem} title="Meus Cursos" data-label="Meus Cursos">
                    <ShoppingBag size={22} />
                </a>
                <a href="/admin/finance" className={styles.navItem} title="Financeiro" data-label="Financeiro">
                    <Wallet size={22} />
                </a>
                <a href="/admin/analytics" className={styles.navItem} title="Estatísticas" data-label="Estatísticas">
                    <BarChart2 size={22} />
                </a>
                <a href="/admin/history" className={styles.navItem} title="Histórico" data-label="Histórico">
                    <Clock size={22} />
                </a>
                <a href="/admin/offers" className={styles.navItem} title="Ofertas" data-label="Ofertas">
                    <Gift size={22} />
                </a>
                <a href="/admin/settings" className={styles.navItem} title="Configurações" data-label="Configurações">
                    <Settings size={22} />
                </a>
            </nav>

            <div className={styles.userAvatar}>
                <span>RG</span>
            </div>
        </aside>
    );
}
