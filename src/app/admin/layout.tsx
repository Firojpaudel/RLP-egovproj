import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.main}>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
