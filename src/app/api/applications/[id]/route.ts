import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const { status } = await req.json();

        const updated = await prisma.licenseApplication.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ message: 'Status Updated', application: updated });

    } catch (error) {
        return NextResponse.json({ error: 'Application Not Found or Error' }, { status: 404 });
    }
}
