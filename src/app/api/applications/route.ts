import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, serviceType, applicantName, citizenshipNo, district, nid } = body;

        // Generate Reference Number
        const year = new Date().getFullYear();
        const count = await prisma.licenseApplication.count() + 1;
        const referenceNo = `REF-${year}-${count.toString().padStart(4, '0')}`;

        const application = await prisma.licenseApplication.create({
            data: {
                referenceNo,
                userId,
                serviceType,
                applicantName,
                citizenshipNo,
                district,
                status: 'PENDING'
            }
        });

        return NextResponse.json({
            message: 'Application Submitted',
            application: { referenceNo: application.referenceNo, id: application.id }
        }, { status: 201 });

    } catch (error) {
        console.error("App Submit Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const whereClause = userId ? { userId } : {};

        const applications = await prisma.licenseApplication.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
