"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';
import { FileText, RotateCw, Search, ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main>
      {/* Hero Section */}
      <section className={`${styles.hero} mesh-bg`}>
        <div className="container">
          <div className={`${styles.heroContent} animate-enter`}>
            <h1 className={styles.title}>
              {t('heroTitle')}
            </h1>
            <p className={styles.subtitle}>
              {t('heroSubtitle')}
            </p>
            <div className={styles.heroActions}>
              <Link href="/login">
                <Button size="lg" className={styles.heroBtnPrimary}>{t('login') || 'Citizen Login'}</Button>
              </Link>
              <Link href="/admin/login">
                <Button size="lg" className={styles.heroBtnSecondary}>{t('adminLogin') || 'Admin Login'}</Button>
              </Link>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/services/renewal" style={{ fontSize: '14px', color: '#0071e3', textDecoration: 'underline' }}>
                {t('renewLicense')}
              </Link>
              <Link href="/status" style={{ fontSize: '14px', color: '#0071e3', textDecoration: 'underline' }}>
                {t('checkStatus')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t('ourServices')}</h2>
          <p className={styles.sectionDesc}>
            {t('servicesDesc')}
          </p>

          <div className={styles.grid}>
            <Card hoverable className={styles.featureCard}>
              <span className={styles.featureIcon} style={{ background: '#0071e3' }}>
                <RotateCw size={32} />
              </span>
              <h3 className={styles.featureTitle}>{t('onlineRenewal')}</h3>
              <p className={styles.featureText}>
                {t('onlineRenewalDesc')}
              </p>
            </Card>

            <Card hoverable className={styles.featureCard}>
              <span className={styles.featureIcon} style={{ background: '#F56300' }}>
                <FileText size={32} />
              </span>
              <h3 className={styles.featureTitle}>{t('newApplication')}</h3>
              <p className={styles.featureText}>
                {t('newApplicationDesc')}
              </p>
            </Card>

            <Card hoverable className={styles.featureCard}>
              <span className={styles.featureIcon} style={{ background: '#30b0b0' }}>
                <FileText size={32} />
              </span>
              <h3 className={styles.featureTitle}>{t('appTracking')}</h3>
              <p className={styles.featureText}>
                {t('appTrackingDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
