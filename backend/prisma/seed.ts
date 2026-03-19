// backend/seed.js
const { PrismaClient } = require('@prisma/client@6');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Создаем артиста
    const artist = await prisma.artist.upsert({
        where: { name: 'Daft Punk' },
        update: {},
        create: {
            name: 'Daft Punk',
            image: '/artists/daft-punk.jpg',
            bio: 'Французский электронный дуэт',
            listenersCount: 6800000,
            albums: {
                create: [
                    {
                        name: 'Random Access Memories',
                        cover: '/albums/ram.jpg',
                        releaseDate: new Date('2013-05-17')
                    },
                    {
                        name: 'Discovery',
                        cover: '/albums/discovery.jpg',
                        releaseDate: new Date('2001-03-12')
                    }
                ]
            }
        },
        include: { albums: true }
    });

    console.log('✅ Artist created:', artist.name);

    // Создаем треки
    const track1 = await prisma.track.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Get Lucky',
            file: '/audio/get-lucky.mp3',
            cover: '/covers/get-lucky.jpg',
            duration: 248,
            artistId: artist.id,
            albumId: artist.albums[0].id,
            lyrics: {
                create: [
                    { time: 0, text: 'Like the legend of the phoenix' },
                    { time: 10, text: 'All ends with beginnings' }
                ]
            }
        }
    });

    console.log('✅ Track created:', track1.name);
}

main()
    .catch(e => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });