"use client";

import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { RotateCw, FileText, Banknote, FileCheck, Users, BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';



export default function ServicesPage() {
    const { t } = useLanguage();

    const servicesList = [
        { id: 1, title: t('svcLicenseRenewal'), desc: t('svcDescRenewal'), icon: <RotateCw size={40} color="#0071e3" />, href: '/services/renewal' },
        { id: 2, title: t('svcNewApp'), desc: t('svcDescNewApp'), icon: <FileText size={40} color="#F56300" />, href: '#' },
        { id: 3, title: t('svcVehicleTax'), desc: t('svcDescTax'), icon: <Banknote size={40} color="#009900" />, href: '#' },
        { id: 4, title: t('svcBlueBook'), desc: t('svcDescBlueBook'), icon: <FileCheck size={40} color="#666666" />, href: '#' },
        { id: 5, title: t('svcOwnershipTransfer'), desc: t('svcDescTransfer'), icon: <Users size={40} color="#9933CC" />, href: '#' },
        { id: 6, title: t('svcExamStatus'), desc: t('svcDescExam'), icon: <BarChart size={40} color="#FF3366" />, href: '#' },
    ];

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
            <h1 className="title-medium" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                {t('allServices')}
            </h1>
            <p className="text-body" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem' }}>
                {t('allServicesDesc')}
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {servicesList.map((s) => (
                    <Link href={s.href} key={s.id}>
                        <Card hoverable className="glass" style={{ height: '100%', padding: '32px', border: 'none', background: 'var(--color-surface)' }}>
                            <span style={{ marginBottom: '24px', display: 'block' }}>{s.icon}</span>
                            <h3 style={{ fontSize: '21px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-main)' }}>{s.title}</h3>
                            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{s.desc}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
