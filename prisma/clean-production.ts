import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- MEMBERSIHKAN SELURUH DATA DUMMY & MEMPERSIAPKAN AKUN ADMIN UTAMA ---');

  // 1. Hapus seluruh data dummy relasi
  console.log('1. Menghapus data titik luka & foto luka...');
  await prisma.titikLuka.deleteMany({});
  await prisma.fotoLuka.deleteMany({});

  console.log('2. Menghapus data asesmen luka & CPPT...');
  await prisma.asesmenLuka.deleteMany({});
  await prisma.catatanCPPT.deleteMany({});

  console.log('3. Menghapus data home care & jadwal pelayanan...');
  await prisma.homecareJaga.deleteMany({});
  await prisma.homecareMeal.deleteMany({});
  await prisma.homecareMed.deleteMany({});
  await prisma.homecareParaf.deleteMany({});
  await prisma.jadwalPerawatan.deleteMany({});

  console.log('4. Menghapus data pasien dummy...');
  await prisma.pasien.deleteMany({});

  console.log('5. Membersihkan akun pengguna lama...');
  await prisma.user.deleteMany({});

  // 6. Membuat Akun Admin Utama Resmi
  console.log('6. Membuat Akun Administrator Utama (Real Production Account)...');
  const admin = await prisma.user.create({
    data: {
      id: 'USR-ADMIN',
      nama: 'Administrator Utama',
      username: 'admin',
      password: '123', // Password default awal yang mudah diubah langsung di dashboard
      role: 'Admin',
      strNip: 'ADM-RLB-001',
      noHp: '0812-5544-3321',
      email: 'admin@rumahlukaborneo.id',
      status: 'Aktif',
    },
  });

  console.log('✓ BERHASIL! Akun Administrator Utama telah aktif:');
  console.log(`  - Username : ${admin.username}`);
  console.log(`  - Password : 123 (dapat diganti kapan saja melalui menu Profil Saya)`);
  console.log(`  - Role     : ${admin.role}`);
  console.log('✓ Seluruh data dummy telah bersih total. Database siap untuk operasional riil klinik!');
}

main()
  .catch((e) => {
    console.error('Error saat membersihkan database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
