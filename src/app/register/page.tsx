"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '../auth.module.css';

import { toast } from 'sonner';

// ...

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [licenses, setLicenses] = useState<string[]>(['']);
    const router = useRouter();
    const { t } = useLanguage();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            ...data,
            licenses: licenses.filter(l => l.trim() !== '').map(l => ({ licenseNo: l }))
        };

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('Registration Successful! Please Login.');
                router.push('/login');
            } else {
                const err = await res.json();
                toast.error(err.error || 'Registration Failed');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h1 className={styles.title}>{t('createAccount')}</h1>
                <p className={styles.subtitle}>{t('registerSubtitle')}</p>

                <form className={styles.form} onSubmit={handleRegister}>
                    <Input
                        name="fullName"
                        label={t('fullName')}
                        placeholder={t('fullNamePlaceholder')}
                        type="text"
                        required
                    />
                    <Input
                        name="nid"
                        label={t('nidLabel')}
                        placeholder={t('nidPlaceholder')}
                        type="text"
                        required
                    />
                    <Input
                        name="dob"
                        label={t('dobLabel')}
                        placeholder={t('dobPlaceholder')}
                        type="text"
                        required
                    />
                    <Input
                        name="citizenshipNo"
                        label="Citizenship No"
                        placeholder="XX-XX-XX-XXXXX"
                        type="text"
                    />
                    <Input
                        name="district"
                        label="Issue District"
                        placeholder="e.g. Kathmandu"
                        type="text"
                    />

                    {/* License Section */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                            Your License Numbers
                        </label>
                        {licenses.map((license, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <Input
                                    containerStyle={{ marginBottom: 0, flex: 1 }}
                                    value={license}
                                    onChange={(e) => {
                                        const newLicenses = [...licenses];
                                        newLicenses[index] = e.target.value;
                                        setLicenses(newLicenses);
                                    }}
                                    placeholder={`License No. ${index + 1}`}
                                />
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            const newLicenses = licenses.filter((_, i) => i !== index);
                                            setLicenses(newLicenses);
                                        }}
                                        style={{ height: '42px', padding: '0 12px' }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setLicenses([...licenses, ''])}
                            style={{ width: '100%' }}
                        >
                            + Add Another License
                        </Button>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            Add all license numbers for your varied vehicles.
                        </p>
                    </div>
                    <Input
                        name="mobile"
                        label={t('mobile')}
                        placeholder={t('mobilePlaceholder')}
                        type="tel"
                        required
                    />
                    <Input
                        name="password"
                        label={t('Password') || "Password"}
                        placeholder="Create a strong password"
                        type="password"
                        required
                    />

                    <Button type="submit" size="lg" style={{ marginTop: '0.5rem' }} isLoading={loading}>
                        {t('registerAccount')}
                    </Button>
                </form>

                <div className={styles.footer}>
                    {t('alreadyHaveAccount')}
                    <Link href="/login" className={styles.link}>{t('loginHere')}</Link>
                </div>
            </div>
        </div>
    );
}
