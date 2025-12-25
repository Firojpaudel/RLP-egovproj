import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nid, fullName, dob, mobile, password } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { nid }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this NID already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                nid,
                fullName,
                dob,
                mobile,
                citizenshipNo: body.citizenshipNo,
                district: body.district,
                password: hashedPassword,
                licenses: {
                    create: body.licenses?.map((l: any) => ({
                        licenseNo: l.licenseNo,
                        category: l.category || 'A'
                    })) || []
                }
            }
        });

        return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
