
import { Card } from '@/components/ui/Card';

export default function ReportsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">System Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 text-gray-800">Application Volume (Last 30 Days)</h3>
                    <div className="h-48 flex items-end justify-between gap-2 px-2 border-b border-l border-gray-200 pb-2">
                        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                            <div key={i} style={{ width: '100%', height: `${h}%`, background: 'var(--color-primary)', opacity: 0.8, borderRadius: '4px 4px 0 0' }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>01 Jan</span>
                        <span>05 Jan</span>
                        <span>10 Jan</span>
                        <span>15 Jan</span>
                        <span>20 Jan</span>
                        <span>25 Jan</span>
                        <span>30 Jan</span>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-semibold mb-4 text-gray-800">Revenue Distribution</h3>
                    <div className="h-48 flex items-center justify-center">
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'conic-gradient(var(--color-primary) 0% 60%, var(--color-secondary) 60% 85%, var(--color-accent) 85% 100%)'
                        }}></div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-600" style={{ background: 'var(--color-primary)' }}></span> Renewal 60%</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-800" style={{ background: 'var(--color-secondary)' }}></span> New 25%</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500" style={{ background: 'var(--color-accent)' }}></span> Tax 15%</div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
