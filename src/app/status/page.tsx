"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';

import { toast } from 'sonner';

export default function StatusPage() {
    const [refNo, setRefNo] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refNo) return;

        setLoading(true);
        try {
            // In a real app, query by Ref No. Here fetching all and filtering for demo
            const res = await fetch('/api/applications');
            if (res.ok) {
                const apps = await res.json();
                const found = apps.find((a: any) => a.referenceNo === refNo || a.applicantName.includes(refNo));

                if (found) {
                    setResult({
                        ref: found.referenceNo,
                        applicant: found.applicantName,
                        service: found.serviceType,
                        date: new Date(found.createdAt).toISOString().split('T')[0],
                        status: found.status
                    });
                    toast.success('Application Found');
                } else {
                    toast.error(t('appNotFound'));
                    setResult(null);
                }
            }
        } catch (error) {
            toast.error('Error fetching status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchCard}>
                <h1 className={styles.title}>{t('trackStatusTitle')}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    {t('trackStatusDesc')}
                </p>

                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder={t('enterRefPlaceholder')}
                            value={refNo}
                            onChange={(e) => setRefNo(e.target.value)}
                        />
                    </div>
                    <Button type="submit" isLoading={loading}>{t('trackBtn')}</Button>
                </form>
            </div>

            {result && (
                <div className={styles.result}>
                    <div className={styles.resultHeader}>
                        <span style={{ fontWeight: 600 }}>Application #{result.ref}</span>
                        <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                            {result.status}
                        </span>
                    </div>
                    <div className={styles.resultBody}>
                        <div className={styles.row}>
                            <span className={styles.label}>{t('applicant')}</span>
                            <span className={styles.value}>{result.applicant}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.label}>{t('service')}</span>
                            <span className={styles.value}>{result.service}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.label}>Submission Date</span>
                            <span className={styles.value}>{result.date}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
