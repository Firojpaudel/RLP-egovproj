"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';
import { Upload, CreditCard, Wallet, Banknote } from 'lucide-react';

const steps = [
    { id: 1, label: 'Personal Details' },
    { id: 2, label: 'Citizenship/NID' },
    { id: 3, label: 'Review & Pay' }
];

export default function RenewalPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        licenseNo: '', mobile: '', applicantName: '', dob: '',
        citizenshipNo: '', district: '', nid: ''
    });

    const [licenses, setLicenses] = useState<any[]>([]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);

                // Fetch full profile (licenses + details)
                fetch(`/api/licenses?userId=${user.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            setLicenses(data);
                            // Auto-select first license
                            if (data.length > 0) {
                                setFormData(prev => ({ ...prev, licenseNo: data[0].licenseNo }));
                            }
                        }
                    });

                setFormData(prev => ({
                    ...prev,
                    applicantName: user.name || user.fullName || '',
                    mobile: user.mobile || '',
                    dob: user.dob || '',
                    nid: user.nid || '',
                    citizenshipNo: user.citizenshipNo || '', // If stored in local storage
                    district: user.district || ''
                }));
            } catch (e) {
                console.error("Failed to parse user data for autofill");
            }
        }
    }, []);

    const handleNext = async () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsLoading(true);

            // Retrieve user from local storage (Simple Auth)
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (!user) {
                alert('Please Login First');
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/applications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        serviceType: 'LICENSE_RENEWAL',
                        ...formData
                    })
                });

                if (res.ok) {
                    const result = await res.json();
                    alert(`Application Submitted! Ref: ${result.application.referenceNo}`);
                } else {
                    alert('Submission Failed');
                }
            } catch (error) {
                alert('Error submitting application');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>License Renewal Application</h1>
                <p className={styles.subtitle}>Complete the form below to renew your driving license</p>
            </div>

            <div className={styles.stepper}>
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`${styles.step} ${currentStep === step.id ? styles.stepActive : ''} ${currentStep > step.id ? styles.stepCompleted : ''}`}
                    >
                        <div className={styles.stepNumber}>
                            {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <span className={styles.stepLabel}>{step.label}</span>
                    </div>
                ))}
            </div>

            <div className={styles.formSection}>
                {currentStep === 1 && (
                    <div>
                        <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                        <div className={styles.detailsGrid}>
                            {licenses.length > 0 ? (
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-main)', marginBottom: '8px' }}>Select License to Renew</label>
                                    <select
                                        name="licenseNo"
                                        value={formData.licenseNo}
                                        onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}
                                    >
                                        {licenses.map(l => (
                                            <option key={l.id} value={l.licenseNo}>{l.licenseNo} ({l.category})</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <Input name="licenseNo" value={formData.licenseNo} onChange={handleChange} label="License Number" placeholder="XX-XX-XXXXXXX" readOnly />
                            )}
                            <Input name="mobile" value={formData.mobile} onChange={handleChange} label="Mobile Number" readOnly />
                            <Input name="applicantName" value={formData.applicantName} onChange={handleChange} label="Applicant Name" readOnly />
                            <Input name="dob" value={formData.dob} onChange={handleChange} label="Date of Birth (BS)" readOnly />
                            <Input name="bloodGroup" onChange={handleChange} label="Blood Group" placeholder="Select..." />
                            <Input name="guardian" onChange={handleChange} label="Guardian Name" placeholder="Father/Husband Name" />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <h2 className="text-xl font-bold mb-6">Identity Verification</h2>
                        <div className={styles.detailsGrid}>
                            <Input name="citizenshipNo" value={formData.citizenshipNo} onChange={handleChange} label="Citizenship No" readOnly />
                            <Input name="district" value={formData.district} onChange={handleChange} label="Issue District" readOnly />
                            <Input name="nid" value={formData.nid} onChange={handleChange} label="National ID (NID)" readOnly />
                        </div>

                        <div className="mt-6 mb-6">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)', marginBottom: '0.5rem', display: 'block' }}>Upload Scanned Citizenship (Both Sides)</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: '2px dashed var(--color-border)',
                                    padding: '2rem',
                                    borderRadius: '0.5rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'var(--color-background)',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: file ? '#f0f9ff' : 'var(--color-background)',
                                    borderColor: file ? '#0071e3' : 'var(--color-border)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: file ? '#0071e3' : '#9CA3AF' }}>
                                    <Upload size={32} />
                                </div>
                                <p style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>
                                    {file ? file.name : 'Click to upload or drag and drop'}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                    {file ? 'File selected' : 'PDF, JPG, PNG up to 2MB'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-200" style={{ background: '#EFF6FF', color: '#1E40AF', padding: '1rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                            Note: Your biometrics will be verified against the National ID database.
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        <h2 className="text-xl font-bold mb-6">Review & Payment</h2>
                        <div className="bg-gray-50 p-6 rounded-lg mb-6" style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                            <h3 className="font-semibold mb-4">Summary</h3>
                            <p className="mb-2"><span className="text-gray-500">Service:</span> Class A, B License Renewal</p>
                            <p className="mb-2"><span className="text-gray-500">Fee:</span> NPR 1500.00</p>
                            <p className="mb-2"><span className="text-gray-500">Tax:</span> NPR 0.00</p>
                            <p className="font-bold mt-4 border-t pt-4">Total: NPR 1500.00</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h3 className="font-semibold mb-3">Select Payment Method</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>

                                {/* ConnectIPS */}
                                <div
                                    onClick={() => setSelectedPayment('connectips')}
                                    style={{
                                        border: selectedPayment === 'connectips' ? '2px solid #0071e3' : '1px solid var(--color-border)',
                                        padding: '1.5rem',
                                        borderRadius: '0.75rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: selectedPayment === 'connectips' ? '#f0f9ff' : 'white',
                                        transition: 'all 0.2s ease',
                                        boxShadow: selectedPayment === 'connectips' ? '0 4px 12px rgba(0,113,227,0.15)' : 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '140px'
                                    }}
                                >
                                    <div style={{ marginBottom: '12px', height: '40px', display: 'flex', alignItems: 'center' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/payment/connectips.png" alt="ConnectIPS" style={{ height: '40px', objectFit: 'contain' }} />
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: '15px', marginTop: 'auto' }}>ConnectIPS</span>
                                </div>

                                {/* eSewa */}
                                <div
                                    onClick={() => setSelectedPayment('esewa')}
                                    style={{
                                        border: selectedPayment === 'esewa' ? '2px solid #60BB46' : '1px solid var(--color-border)',
                                        padding: '1.5rem',
                                        borderRadius: '0.75rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: selectedPayment === 'esewa' ? '#f0fdf4' : 'white',
                                        transition: 'all 0.2s ease',
                                        boxShadow: selectedPayment === 'esewa' ? '0 4px 12px rgba(96,187,70,0.15)' : 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '140px'
                                    }}
                                >
                                    <div style={{ marginBottom: '12px', height: '40px', display: 'flex', alignItems: 'center' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/payment/esewa.png" alt="eSewa" style={{ height: '40px', objectFit: 'contain' }} />
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: '15px', marginTop: 'auto' }}>eSewa</span>
                                </div>

                                {/* IME Pay */}
                                <div
                                    onClick={() => setSelectedPayment('imepay')}
                                    style={{
                                        border: selectedPayment === 'imepay' ? '2px solid #D91C22' : '1px solid var(--color-border)',
                                        padding: '1.5rem',
                                        borderRadius: '0.75rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: selectedPayment === 'imepay' ? '#fef2f2' : 'white',
                                        transition: 'all 0.2s ease',
                                        boxShadow: selectedPayment === 'imepay' ? '0 4px 12px rgba(217,28,34,0.15)' : 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '140px'
                                    }}
                                >
                                    <div style={{ marginBottom: '12px', height: '40px', display: 'flex', alignItems: 'center' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/payment/imepay.png" alt="IME Pay" style={{ height: '40px', objectFit: 'contain' }} />
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: '15px', marginTop: 'auto' }}>IME Pay</span>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        Back
                    </Button>
                    <Button onClick={handleNext} isLoading={isLoading}>
                        {currentStep === steps.length ? 'Confirm & Pay' : 'Next Step'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
