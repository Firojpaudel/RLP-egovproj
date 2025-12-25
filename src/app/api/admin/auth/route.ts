import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Find user 
        // Note: For now, assuming username matches 'fullName' or 'nid'.
        // Since Schema doesn't have 'username', we'll check against NID or a specific field.
        // Actually, the previous hardcoded admin was 'admin'.
        // If the DB has an admin user, they probably signed up with NID.
        // Let's assume the Admin uses NID as username for now, or we check 'nid' field.

        const user = await prisma.user.findFirst({
            where: {
                nid: username, // Treating username input as NID for login
                role: 'ADMIN'  // Must be admin
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid Credentials' }, { status: 401 });
        }

        // Verify Password with Bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid Credentials' }, { status: 401 });
        }

        // Return user info (excluding password)
        const { password: _, ...userInfo } = user;
        return NextResponse.json({ user: userInfo });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
