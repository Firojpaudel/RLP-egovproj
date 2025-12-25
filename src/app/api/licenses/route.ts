import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    try {
        const licenses = await prisma.license.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(licenses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, licenseNo, category } = body;

        console.log('Received Add License Request:', { userId, licenseNo, category });

        if (!userId || !licenseNo) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists first (Prevent FK error if DB was reset)
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            console.error(`User ID ${userId} not found (likely DB reset)`);
            return NextResponse.json({ error: 'User account not found. Please logout and login again.' }, { status: 404 });
        }

        // Check if license already exists
        const existingLicense = await prisma.license.findUnique({
            where: { licenseNo }
        });

        if (existingLicense) {
            return NextResponse.json({ error: 'License number already registered in the system.' }, { status: 409 });
        }

        const newLicense = await prisma.license.create({
            data: {
                userId,
                licenseNo,
                category: category || 'A'
            }
        });

        return NextResponse.json(newLicense, { status: 201 });
    } catch (error: any) {
        console.error('API Error /api/licenses:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
