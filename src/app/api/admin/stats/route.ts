
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 1. Status Counts
        const total = await prisma.licenseApplication.count();
        const pending = await prisma.licenseApplication.count({ where: { status: 'PENDING' } });
        const approved = await prisma.licenseApplication.count({ where: { status: 'APPROVED' } });
        const rejected = await prisma.licenseApplication.count({ where: { status: 'REJECTED' } });

        // 2. Trend Data (Last 7 days)
        // Note: Prisma groupBy for dates can be tricky across DBs, doing basic JS aggregation for simplicity/compatibility
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentApps = await prisma.licenseApplication.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                createdAt: true,
                status: true
            }
        });

        // Group by Date (YYYY-MM-DD)
        const trendMap: Record<string, number> = {};
        recentApps.forEach(app => {
            const date = app.createdAt.toISOString().split('T')[0];
            trendMap[date] = (trendMap[date] || 0) + 1;
        });

        const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

        // Sort by date
        trendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json({
            statusCounts: { total, pending, approved, rejected },
            trendData
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
