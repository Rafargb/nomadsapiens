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
            <div className={styles.logoArea}>
                <div className={styles.logoIcon}>
                    <div className={styles.gridIcon}></div>
                </div>
                <span className={styles.brandName}>greenn</span>
            </div>

            <nav className={styles.nav}>
                <a href="/admin-dashboard" className={`${styles.navItem} ${styles.active}`} title="Dashboard">
                    <Home size={22} />
                </a>
                <a href="/admin/courses" className={styles.navItem} title="Meus Cursos">
                    <ShoppingBag size={22} />
                </a>
                <a href="/admin/finance" className={styles.navItem} title="Financeiro">
                    <Wallet size={22} />
                </a>
                <a href="#" className={styles.navItem} title="Estatísticas">
                    <BarChart2 size={22} />
                </a>
                <a href="#" className={styles.navItem}>
                    <Clock size={22} />
                </a>
                <a href="/offer" className={styles.navItem} title="Ofertas">
                    <Gift size={22} />
                </a>
                <a href="/admin/settings" className={styles.navItem} title="Configurações">
                    <Settings size={22} />
                </a>
            </nav>

            <div className={styles.userAvatar}>
                <span>RG</span>
            </div>
        </aside>
    );
}
