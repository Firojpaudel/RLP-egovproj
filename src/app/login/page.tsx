"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '../auth.module.css';

import { toast } from 'sonner';

// ... (imports remain)

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();
                localStorage.setItem('user', JSON.stringify(result.user));
                window.dispatchEvent(new Event('auth-change'));
                toast.success(t('loginSuccess') || 'Login Successful');
                router.push('/dashboard');
            } else {
                toast.error(t('invalidCredentials') || 'Invalid Credentials');
            }
        } catch (err) {
            toast.error(t('loginFailed') || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h1 className={styles.title}>{t('welcomeBack')}</h1>
                <p className={styles.subtitle}>{t('loginSubtitle')}</p>

                <form className={styles.form} onSubmit={handleLogin}>
                    <Input
                        name="nid"
                        label={t('nidLabel')}
                        placeholder={t('nidPlaceholder')}
                        type="text"
                        required
                    />
                    <Input
                        name="password"
                        label={t('Password') || 'Password'}
                        placeholder="Enter your password"
                        type="password"
                        required
                    />

                    <Button type="submit" size="lg" style={{ marginTop: '0.5rem' }} isLoading={loading}>
                        {t('loginSecurely')}
                    </Button>
                </form>

                <div className={styles.footer}>
                    {t('noAccount')}
                    <Link href="/register" className={styles.link}>{t('registerNow')}</Link>
                </div>
            </div>
        </div>
    );
}
