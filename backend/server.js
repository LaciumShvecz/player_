const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth.routes');
const playlistRoutes = require('./routes/playlist.routes');
const adminRoutes = require('./routes/admin.routes');

const prisma = new PrismaClient();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/tracks', async (req, res) => {
    try {
        const { search } = req.query;

        const tracks = await prisma.track.findMany({
            where: search ? {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            } : {},
            include: {
                artist: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        listenersCount: true
                    }
                },
                album: {
                    select: {
                        id: true,
                        name: true,
                        cover: true
                    }
                },
                lyrics: {
                    orderBy: {
                        time: 'asc'
                    },
                    select: {
                        id: true,
                        time: true,
                        text: true
                    }
                }
            }
        });

        res.json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tracks/:id', async (req, res) => {
    try {
        const trackId = parseInt(req.params.id);
        const track = await prisma.track.findUnique({
            where: { id: trackId },
            include: {
                artist: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        listenersCount: true
                    }
                },
                lyrics: {
                    select: {
                        id: true,
                        time: true,
                        text: true
                    }
                }
            }
        });

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        res.json(track);
    } catch (error) {
        console.error('Error fetching track:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/artists', async (req, res) => {
    try {
        const artists = await prisma.artist.findMany({
            include: {
                tracks: {
                    select: {
                        id: true,
                        name: true,
                        file: true,
                        cover: true,
                        duration: true
                    }
                },
                albums: {
                    select: {
                        id: true,
                        name: true,
                        cover: true,
                        releaseDate: true
                    }
                }
            }
        });
        res.json(artists);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/artists/name/:name', async (req, res) => {
    try {
        const artistName = req.params.name;
        console.log('🔍 Searching for artist by name:', artistName);

        const artist = await prisma.artist.findFirst({
            where: {
                name: {
                    equals: artistName,
                    mode: 'insensitive'
                }
            },
            include: {
                tracks: {
                    include: {
                        lyrics: {
                            select: {
                                id: true,
                                time: true,
                                text: true
                            }
                        }
                    }
                },
                albums: {
                    select: {
                        id: true,
                        name: true,
                        cover: true,
                        releaseDate: true
                    }
                }
            }
        });

        if (!artist) {
            console.log('❌ Artist not found:', artistName);
            return res.status(404).json({ error: 'Artist not found' });
        }

        console.log('✅ Artist found:', artist.name);
        res.json(artist);
    } catch (error) {
        console.error('🔥 Error fetching artist:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/artists/id/:id', async (req, res) => {
    try {
        const artistId = parseInt(req.params.id);
        console.log('🔍 Searching for artist by ID:', artistId);

        const artist = await prisma.artist.findUnique({
            where: { id: artistId },
            include: {
                tracks: {
                    include: {
                        lyrics: {
                            select: {
                                id: true,
                                time: true,
                                text: true
                            }
                        }
                    }
                },
                albums: {
                    include: {
                        tracks: {
                            select: {
                                id: true,
                                name: true,
                                duration: true
                            }
                        }
                    }
                }
            }
        });

        if (!artist) {
            console.log('❌ Artist not found with ID:', artistId);
            return res.status(404).json({ error: 'Artist not found' });
        }

        console.log('✅ Artist found:', artist.name);
        res.json(artist);
    } catch (error) {
        console.error('🔥 Error fetching artist by ID:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/albums', async (req, res) => {
    try {
        const albums = await prisma.album.findMany({
            include: {
                artist: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        listenersCount: true
                    }
                },
                tracks: {
                    select: {
                        id: true,
                        name: true,
                        file: true,
                        cover: true,
                        duration: true
                    }
                }
            }
        });
        res.json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/albums/:id', async (req, res) => {
    try {
        const albumId = parseInt(req.params.id);

        const album = await prisma.album.findUnique({
            where: { id: albumId },
            include: {
                artist: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        listenersCount: true
                    }
                },
                tracks: {
                    include: {
                        lyrics: {
                            select: {
                                id: true,
                                time: true,
                                text: true
                            }
                        }
                    }
                }
            }
        });

        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }

        res.json(album);
    } catch (error) {
        console.error('Error fetching album:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/artists/:id/albums', async (req, res) => {
    try {
        const artistId = parseInt(req.params.id);

        const albums = await prisma.album.findMany({
            where: { artistId: artistId },
            include: {
                artist: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                tracks: {
                    select: {
                        id: true,
                        name: true,
                        duration: true
                    }
                }
            }
        });

        res.json(albums);
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/lyrics/:trackName', async (req, res) => {
    try {
        const trackName = req.params.trackName;

        const track = await prisma.track.findFirst({
            where: {
                name: {
                    equals: trackName,
                    mode: 'insensitive'
                }
            },
            include: {
                lyrics: {
                    orderBy: {
                        time: 'asc'
                    },
                    select: {
                        id: true,
                        time: true,
                        text: true
                    }
                }
            }
        });

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        res.json(track.lyrics);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   - GET /api/health`);
    console.log(`   - GET /api/tracks`);
    console.log(`   - GET /api/tracks/:id`);
    console.log(`   - GET /api/artists`);
    console.log(`   - GET /api/artists/name/:name`);
    console.log(`   - GET /api/artists/id/:id`);
    console.log(`   - GET /api/albums`);
    console.log(`   - GET /api/albums/:id`);
    console.log(`   - GET /api/artists/:id/albums`);
    console.log(`   - GET /api/lyrics/:trackName`);
});

// Тестовый эндпоинт для проверки соединения с БД
app.get('/api/test', async (req, res) => {
    try {
        const artistCount = await prisma.artist.count();
        const trackCount = await prisma.track.count();
        const albumCount = await prisma.album.count();

        res.json({
            status: 'Database connected',
            counts: {
                artists: artistCount,
                tracks: trackCount,
                albums: albumCount
            }
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});