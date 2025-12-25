"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './dashboard.module.css';
import { FileText, User, RefreshCw, LogOut } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [applications, setApplications] = useState<any[]>([]);
    const [licenses, setLicenses] = useState<any[]>([]);
    const [newLicense, setNewLicense] = useState('');
    const [addingLicense, setAddingLicense] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);

        // Fetch User's Applications and Licenses
        Promise.all([
            fetch(`/api/applications?userId=${userData.id}`).then(res => res.json()),
            fetch(`/api/licenses?userId=${userData.id}`).then(res => res.json())
        ]).then(([appsData, licensesData]) => {
            if (Array.isArray(appsData)) setApplications(appsData);
            if (Array.isArray(licensesData)) setLicenses(licensesData);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
        router.push('/login');
    };

    const handleAddLicense = async () => {
        if (!newLicense.trim()) return;
        setAddingLicense(true);
        try {
            const res = await fetch('/api/licenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, licenseNo: newLicense, category: 'A' })
            });

            if (res.status === 404) {
                // Session invalid (User ID not found in DB)
                alert('Your session has expired or is invalid. Please login again.');
                handleLogout();
                return;
            }

            if (res.ok) {
                const added = await res.json();
                setLicenses([added, ...licenses]);
                setNewLicense('');
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to add license');
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setAddingLicense(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
            <div style={{ marginBottom: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="title-medium">Welcome, {user.name.split(' ')[0]}</h1>
                    <p className="text-body" style={{ marginTop: '8px' }}>Here is what's happening with your profile today.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                    <span>System Operational</span>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', alignItems: 'start' }}>
                {/* 1. Profile Overview (Spans 4 columns on large, 12 on small) */}
                <div className="apple-card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f5f5f7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d1d1f', marginBottom: '16px' }}>
                        <User size={32} />
                    </div>
                    <h3 className="title-small">{user.name}</h3>
                    <p className="text-body" style={{ fontSize: '14px', marginTop: '4px' }}>NID: {user.nid}</p>
                    <span style={{
                        marginTop: '16px',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        background: '#e8f2ff',
                        color: '#0071e3',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.02em'
                    }}>
                        {user.role || 'CITIZEN'}
                    </span>
                </div>

                {/* 2. License Management & Actions (Spans 8 columns) */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* License List */}
                    <div className="apple-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 className="title-small">My Licenses</h3>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{licenses.length} Active</span>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            {licenses.length > 0 ? (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {licenses.map((lic) => (
                                        <div key={lic.id} style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: '#f5f5f7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '8px', color: '#0071e3' }}>
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f' }}>{lic.licenseNo}</div>
                                                    <div style={{ fontSize: '11px', color: '#86868b' }}>Class {lic.category}</div>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>Valid</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#86868b', fontSize: '14px', background: '#f5f5f7', borderRadius: '12px', border: '1px dashed #d2d2d7' }}>
                                    No licenses linked yet.
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Add existing License No."
                                value={newLicense}
                                onChange={(e) => setNewLicense(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    background: 'transparent'
                                }}
                            />
                            <Button size="sm" onClick={handleAddLicense} isLoading={addingLicense} disabled={!newLicense.trim()}>Link License</Button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="apple-card" style={{ background: '#eef2ff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0071e3', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <RefreshCw size={24} />
                            </div>
                            <div>
                                <h3 className="title-small" style={{ color: '#0071e3', fontSize: '18px' }}>Renew License</h3>
                                <p className="text-body" style={{ fontSize: '13px', marginTop: '2px', color: '#5b7db1' }}>Expiring soon? Start your application.</p>
                            </div>
                        </div>
                        <Link href="/services/renewal">
                            <Button style={{ borderRadius: '12px', padding: '10px 24px', boxShadow: '0 4px 12px rgba(0, 113, 227, 0.2)' }}>Apply Now</Button>
                        </Link>
                    </div>
                </div>

                {/* 4. Application History (Spans 12 columns - Full Width) */}
                <div className="apple-card" style={{ gridColumn: 'span 12', padding: '0', overflow: 'hidden', marginTop: '16px' }}>
                    <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--color-border)' }}>
                        <h3 className="title-small">Application History</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#fafafa' }}>
                                <tr>
                                    <th style={{ padding: '16px 30px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference</th>
                                    <th style={{ padding: '16px 30px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</th>
                                    <th style={{ padding: '16px 30px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                    <th style={{ padding: '16px 30px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length > 0 ? applications.map((app) => (
                                    <tr key={app.id} style={{ borderBottom: '1px solid #f5f5f7' }}>
                                        <td style={{ padding: '16px 30px', fontSize: '14px', fontFamily: 'monospace', color: '#1d1d1f' }}>{app.referenceNo}</td>
                                        <td style={{ padding: '16px 30px', fontSize: '14px', fontWeight: 500 }}>{app.serviceType.replace('_', ' ')}</td>
                                        <td style={{ padding: '16px 30px', fontSize: '14px', color: '#86868b' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px 30px', textAlign: 'right' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                letterSpacing: '0.02em',
                                                background: app.status === 'APPROVED' ? '#dcfce7' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                                                color: app.status === 'APPROVED' ? '#166534' : app.status === 'REJECTED' ? '#991b1b' : '#92400e'
                                            }}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#86868b', fontSize: '14px' }}>
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
}
