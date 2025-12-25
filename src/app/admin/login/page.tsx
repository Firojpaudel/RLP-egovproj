"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './admin-login.module.css';

import { toast } from 'sonner';

// ...

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();
                localStorage.setItem('user', JSON.stringify(result.user));
                window.dispatchEvent(new Event('auth-change'));
                toast.success('Welcome back, Admin');
                router.push('/admin');
            } else {
                toast.error(t('loginFailed'));
            }
        } catch (error) {
            toast.error('Login Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <div className={styles.iconWrapper}>
                    <ShieldCheck size={48} />
                </div>
                <h1 className={styles.title}>{t('adminPortal')}</h1>
                <p className={styles.subtitle}>{t('restrictedAccess')}</p>

                <form onSubmit={handleLogin} className={styles.form}>
                    <Input
                        name="username"
                        label={t('username')}
                        placeholder="Enter admin username"
                        type="text"
                        required
                    />
                    <Input
                        name="password"
                        label={t('password')}
                        placeholder="••••••••"
                        type="password"
                        required
                    />

                    <Button type="submit" size="lg" className={styles.submitBtn} isLoading={loading}>
                        {t('accessDashboard')}
                    </Button>
                </form>
            </div>
        </div>
    );
}
