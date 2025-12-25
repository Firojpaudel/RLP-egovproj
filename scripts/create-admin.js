const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Admin User...');

    const admin = await prisma.user.upsert({
        where: { nid: 'admin' },
        update: {},
        create: {
            nid: 'admin',
            fullName: 'System Administrator',
            dob: '2000-01-01',
            mobile: '9800000000',
            password: 'admin', // In a real app we would hash this, but our API currently checks exact string for 'admin' based on previous logic, OR checks against hash. 
            // Wait, the API I wrote checks `user.password !== password`.
            // So plain text 'admin' is fine for this specific "Revert" logic unless I added bcrypt to the Admin API.
            // Let's double check Admin API.
            // It does: `if (user.password !== password)`. No bcrypt compare.
            // So I will store plain text 'admin' or 'admin123'. 
            // The prompt asked for 'admin / admin123', so let's set password to 'admin123'.
            password: 'admin123',
            role: 'ADMIN'
        },
    });

    console.log('Admin user created/found:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
