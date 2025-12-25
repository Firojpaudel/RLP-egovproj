"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Navbar.module.css';
import { Sun, Moon, Globe, LogOut, User, Menu, X } from 'lucide-react';

export const Navbar = () => {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();

    useEffect(() => {
        const checkUser = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) setUser(JSON.parse(userStr));
            else setUser(null);
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        window.addEventListener('auth-change', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('auth-change', checkUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('auth-change'));
        setUser(null);
        router.push('/login');
        setIsMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#0071e3',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '14px',
                        letterSpacing: '-0.02em',
                        boxShadow: '0 2px 5px rgba(0,113,227,0.3)',
                        marginRight: '12px'
                    }}>
                        RLP
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em' }}>
                        {t('portalName')}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.nav}>
                    {user?.role === 'ADMIN' ? null : (
                        <>
                            <Link href="/" className={styles.link}>{t('home')}</Link>
                            <Link href="/services" className={styles.link}>{t('services')}</Link>
                            <Link href="/status" className={styles.link}>{t('checkStatus')}</Link>
                        </>
                    )}
                </nav>

                <div className={styles.actions}>
                    <button onClick={toggleLanguage} className={styles.iconBtn} title="Switch Language">
                        <Globe size={20} />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{language.toUpperCase()}</span>
                    </button>

                    {user ? (
                        <div className={styles.desktopAuth}>
                            <Button size="sm" variant="secondary" onClick={handleLogout} title={t('logout')} style={{ display: 'flex', gap: '6px' }}>
                                <LogOut size={16} /> {t('logout')}
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.desktopAuth} style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/login">
                                <Button variant="outline" size="sm">{t('login')}</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">{t('register')}</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    {user?.role !== 'ADMIN' && (
                        <>
                            <Link href="/" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>{t('home')}</Link>
                            <Link href="/services" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>{t('services')}</Link>
                            <Link href="/status" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>{t('checkStatus')}</Link>
                            <hr style={{ borderColor: 'rgba(0,0,0,0.05)', margin: '8px 0' }} />
                        </>
                    )}

                    {user ? (
                        <button onClick={handleLogout} className={styles.mobileLink} style={{ color: '#ef4444' }}>
                            {t('logout')}
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>{t('login')}</Link>
                            <Link href="/register" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>{t('register')}</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};
