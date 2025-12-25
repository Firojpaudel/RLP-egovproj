"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/applications')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setApplications(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading applications...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Applications Explorer</h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage all license applications.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Filter</Button>
                    <Button variant="outline" size="sm">Export</Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref No</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Type</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                <td className="p-4 text-sm font-medium text-gray-900 font-mono">{app.referenceNo}</td>
                                <td className="p-4 text-sm text-gray-700">
                                    <div className="font-medium">{app.applicantName}</div>
                                    <div className="text-xs text-gray-500">{app.citizenshipNo}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{app.serviceType.replace('_', ' ')}</td>
                                <td className="p-4 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${app.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                                            app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Details</button>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No applications found in the database.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {applications.length} results</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
