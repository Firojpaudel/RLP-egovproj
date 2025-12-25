const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding admins...');

    const admins = [
        {
            nid: 'admin-ram',
            fullName: 'Ram Admin',
            password: 'rampassword123', // User can change this
            role: 'ADMIN',
            dob: '1990-01-01',
            mobile: '9800000001'
        },
        {
            nid: 'admin-hari',
            fullName: 'Hari Admin',
            password: 'haripassword123', // User can change this
            role: 'ADMIN',
            dob: '1992-02-02',
            mobile: '9800000002'
        }
    ];

    for (const admin of admins) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);

        const upsertedAdmin = await prisma.user.upsert({
            where: { nid: admin.nid },
            update: {
                password: hashedPassword,
                fullName: admin.fullName,
                role: 'ADMIN' // Ensure role is ADMIN
            },
            create: {
                nid: admin.nid,
                fullName: admin.fullName,
                password: hashedPassword,
                role: 'ADMIN',
                dob: admin.dob,
                mobile: admin.mobile
            },
        });

        console.log(`Upserted admin: ${upsertedAdmin.fullName} (NID: ${upsertedAdmin.nid})`);
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
