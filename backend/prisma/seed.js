const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.cartItem.deleteMany().catch(() => {});
  await prisma.receipt.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});

  const products = [
    { name: 'Vibe Tee', price: 19.99, image: '/images/t-shirt-1976334_1280.png' },
    { name: 'Vibe Hoodie', price: 39.99, image: '/images/hoodie-8029137_1280.png' },
    { name: 'Vibe Cap', price: 14.99, image: '/images/hat-25758_1280.png' },
    { name: 'Vibe Mug', price: 9.99, image: '/images/beer-5572082_1280.png' },
    { name: 'Vibe Sticker Pack', price: 4.99, image: '/images/bubble-4912703_1280.png' },
    { name: 'Vibe BackPack', price: 49.99, image: '/images/backpack-2459934_1280.png' },
    { name: 'Vibe WaterBottle', price: 12.50, image: '/images/bottledwater-4127009_1280.png' }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
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