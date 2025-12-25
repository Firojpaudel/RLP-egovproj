"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './admin.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [trendData, setTrendData] = useState<any[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        // Auth Check
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/admin/login');
            return;
        }

        try {
            const userData = JSON.parse(userStr);
            setUser(userData);

            if (userData.role !== 'ADMIN') {
                alert(t('accessDenied'));
                router.push('/dashboard');
                return;
            }
        } catch (e) {
            router.push('/admin/login');
            return;
        }

        fetchData();
        fetchStats();
    }, [router, t]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/applications');
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.statusCounts);
                setTrendData(data.trendData);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchData(); // Refresh list
                fetchStats(); // Refresh stats
            }
        } catch (err) {
            alert(t('updateFailed'));
        }
    };

    if (loading) return <div className="p-10 text-center">{t('portalName')}...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="title-medium" style={{ marginTop: 0 }}>Welcome, {user?.name || 'Admin'}</h1>
                    <p className="text-body" style={{ marginTop: '8px' }}>Manage the system and review applications.</p>
                </div>
            </div>

            {/* Analytics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', marginBottom: '48px', alignItems: 'start' }}>
                <Card style={{ padding: '32px', height: '100%', minHeight: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 className={styles.statLabel} style={{ fontSize: '18px', fontWeight: 600, color: '#1d1d1f' }}>Application Trends</h3>
                        <span style={{ fontSize: '13px', color: '#86868b' }}>Last 7 Days</span>
                    </div>
                    <div style={{ width: '100%', height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f7" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#86868b' }} stroke="transparent" dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: '#86868b' }} stroke="transparent" dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                                    cursor={{ fill: '#f5f5f7' }}
                                />
                                <Bar dataKey="count" fill="#0071e3" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#86868b', fontWeight: 600, textTransform: 'uppercase' }}>Total</p>
                            <p style={{ fontSize: '32px', fontWeight: 700, color: '#1d1d1f', lineHeight: 1 }}>{stats.total}</p>
                        </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase' }}>Pending</p>
                            <p style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>{stats.pending}</p>
                        </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>Approved</p>
                            <p style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', lineHeight: 1 }}>{stats.approved}</p>
                        </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600, textTransform: 'uppercase' }}>Rejected</p>
                            <p style={{ fontSize: '32px', fontWeight: 700, color: '#ef4444', lineHeight: 1 }}>{stats.rejected}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6">{t('Applications')}</h2>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('refNo')}</th>
                            <th>{t('applicant')}</th>
                            <th>{t('service')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td className={styles.refCell}>{app.referenceNo}</td>
                                <td>
                                    <div className={styles.applicantName}>{app.applicantName}</div>
                                    <div className={styles.applicantMeta}>{app.citizenshipNo}</div>
                                </td>
                                <td>{app.serviceType.replace('_', ' ')}</td>
                                <td>
                                    <StatusBadge status={app.status} t={t} />
                                </td>
                                <td>
                                    {app.status === 'PENDING' ? (
                                        <div className={styles.actionButtons}>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                                                className={styles.btnApprove}
                                                title={t('approve')}
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                className={styles.btnReject}
                                                title={t('reject')}
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400">{t('resolved')}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>{t('noApplications')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const StatusBadge = ({ status, t }: { status: string, t: any }) => {
    let style = styles.badgePending;
    let icon = <Clock size={14} />;
    let text = t('pendingReview');

    if (status === 'APPROVED') {
        style = styles.badgeApproved;
        icon = <CheckCircle size={14} />;
        text = t('approved');
    } else if (status === 'REJECTED') {
        style = styles.badgeRejected;
        icon = <XCircle size={14} />;
        text = t('rejected');
    }

    return (
        <span className={`${styles.badge} ${style}`}>
            {icon} {text}
        </span>
    );
};
