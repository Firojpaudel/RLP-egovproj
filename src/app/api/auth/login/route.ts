import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nid, dob } = body;

        // Find user by NID
        const user = await prisma.user.findUnique({
            where: { nid }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify Password
        const isValid = await bcrypt.compare(body.password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid Credentials' }, { status: 401 });
        }

        // Type assertion to handle potential type inference delay
        const responseUser: any = user;

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.fullName,
                nid: user.nid,
                role: user.role,
                dob: user.dob,
                mobile: user.mobile,
                citizenshipNo: responseUser.citizenshipNo,
                district: responseUser.district
            }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
