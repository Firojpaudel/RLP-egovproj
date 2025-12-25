import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <h3>Department</h3>
                        <ul>
                            <li><Link href="#">About RLP</Link></li>
                            <li><Link href="#">Leadership</Link></li>
                            <li><Link href="#">Contact Us</Link></li>
                            <li><Link href="#">Notices</Link></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h3>Services</h3>
                        <ul>
                            <li><Link href="#">License Renewal</Link></li>
                            <li><Link href="#">New License</Link></li>
                            <li><Link href="#">Vehicle Registration</Link></li>
                            <li><Link href="#">Tax Payment</Link></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h3>Support</h3>
                        <ul>
                            <li><Link href="#">Help Center</Link></li>
                            <li><Link href="#">FAQs</Link></li>
                            <li><Link href="#">Report Issue</Link></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h3>Connect</h3>
                        <ul>
                            <li><Link href="#">Facebook</Link></li>
                            <li><Link href="#">Twitter</Link></li>
                            <li><Link href="#">Government Portal</Link></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.copyright}>
                    <p>© {new Date().getFullYear()} Department of Transport Management. Government of Nepal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
