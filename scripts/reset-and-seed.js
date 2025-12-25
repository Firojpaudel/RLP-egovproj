const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('⚠️  Starting Database Reset & Seed...');

    // 1. Clean Database
    console.log('Cleaning existing data...');
    // Delete in order of constraints (Applications depend on Users)
    await prisma.licenseApplication.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Database cleared.');

    // 2. Seed Admins
    console.log('Seeding Admins...');
    const adminPasswordRam = await bcrypt.hash('rampassword123', 10);
    const adminPasswordHari = await bcrypt.hash('haripassword123', 10);

    const admins = [
        {
            nid: 'admin-ram',
            fullName: 'Ram Admin',
            role: 'ADMIN',
            password: adminPasswordRam,
            dob: '1985-05-15',
            mobile: '9841000001'
        },
        {
            nid: 'admin-hari',
            fullName: 'Hari Admin',
            role: 'ADMIN',
            password: adminPasswordHari,
            dob: '1988-08-22',
            mobile: '9841000002'
        }
    ];

    for (const admin of admins) {
        await prisma.user.create({ data: admin });
    }
    console.log(`✅ Created ${admins.length} Admins (Ram & Hari).`);

    // 3. Seed Dummy Users & Applications
    console.log('Seeding Users & Applications...');
    const userPassword = await bcrypt.hash('password123', 10); // Standard password for all dummy users

    const dummyUsers = [
        {
            nid: '111-222-333',
            fullName: 'Sita Sharma',
            dob: '1995-03-10',
            mobile: '9801111111',
            district: 'Kathmandu',
            citizenshipNo: '27-01-70-12345',
            appStatus: 'APPROVED'
        },
        {
            nid: '444-555-666',
            fullName: 'Gita Rai',
            dob: '1998-11-25',
            mobile: '9802222222',
            district: 'Lalitpur',
            citizenshipNo: '28-01-71-67890',
            appStatus: 'PENDING'
        },
        {
            nid: '777-888-999',
            fullName: 'Shyam KC',
            dob: '1992-07-07',
            mobile: '9803333333',
            district: 'Bhaktapur',
            citizenshipNo: '29-01-72-11111',
            appStatus: 'REJECTED'
        },
        {
            nid: '123-456-789',
            fullName: 'Rita Thapa',
            dob: '2000-01-01',
            mobile: '9804444444',
            district: 'Chitwan',
            citizenshipNo: '30-01-73-22222',
            appStatus: 'PENDING'
        }
    ];

    for (const u of dummyUsers) {
        // Create User
        const user = await prisma.user.create({
            data: {
                nid: u.nid,
                fullName: u.fullName,
                dob: u.dob,
                mobile: u.mobile,
                password: userPassword,
                role: 'USER',
                citizenshipNo: u.citizenshipNo,
                district: u.district
            }
        });

        // Create Application for User
        const refNo = `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        await prisma.licenseApplication.create({
            data: {
                referenceNo: refNo,
                userId: user.id,
                serviceType: 'LICENSE_RENEWAL',
                status: u.appStatus,
                applicantName: u.fullName,
                citizenshipNo: `CTZ-${Math.floor(Math.random() * 10000)}`,
                paymentStatus: 'PAID',
                amount: 1500.00,
                district: 'Kathmandu'
            }
        });
    }

    // Seed Licenses for Dummy Users
    for (const u of dummyUsers) {
        const user = await prisma.user.findUnique({ where: { nid: u.nid } });
        if (user) {
            await prisma.license.create({
                data: {
                    userId: user.id,
                    licenseNo: `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
                    category: 'A'
                }
            });
            // Add a second license for some variety
            if (Math.random() > 0.5) {
                await prisma.license.create({
                    data: {
                        userId: user.id,
                        licenseNo: `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
                        category: 'B'
                    }
                });
            }
        }
    }

    console.log(`✅ Created ${dummyUsers.length} Dummy Users with Applications.`);
    console.log('🎉 Reset & Seed Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
