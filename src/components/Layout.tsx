import { NavLink, Outlet } from 'react-router-dom';
import { Home, Camera, Mic, BookOpen, AlertTriangle, Activity } from 'lucide-react';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Activity size={40} />
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            <Home className={styles.navIcon} />
            <span className={styles.navLabel}>DASHBOARD</span>
          </NavLink>

          <NavLink
            to="/interpreter"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            <Camera className={styles.navIcon} />
            <span className={styles.navLabel}>INTERPRETER</span>
          </NavLink>

          <NavLink
            to="/avatar"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            <Mic className={styles.navIcon} />
            <span className={styles.navLabel}>AVATAR SPEAK</span>
          </NavLink>

          <NavLink
            to="/learn"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            <BookOpen className={styles.navIcon} />
            <span className={styles.navLabel}>ACADEMY</span>
          </NavLink>

          <NavLink
            to="/sos"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            <AlertTriangle className={styles.navIcon} color="var(--color-error)" />
            <span className={styles.navLabel} style={{ color: 'var(--color-error)' }}>EMERGENCY</span>
          </NavLink>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.background3d}>
          {/* Placeholder for 3D background effect */}
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
