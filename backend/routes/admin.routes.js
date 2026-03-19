const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/tracks', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, file, cover, duration, artistId, albumId, lyrics } = req.body;

        const track = await prisma.track.create({
            data: {
                name,
                file,
                cover,
                duration,
                artistId,
                albumId,
                lyrics: lyrics ? {
                    create: lyrics
                } : undefined
            },
            include: {
                artist: true,
                lyrics: true
            }
        });

        res.json(track);
    } catch (error) {
        console.error('Create track error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/tracks/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, file, cover, duration, artistId, albumId } = req.body;

        const track = await prisma.track.update({
            where: { id },
            data: {
                name,
                file,
                cover,
                duration,
                artistId,
                albumId
            }
        });

        res.json(track);
    } catch (error) {
        console.error('Update track error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/tracks/:trackId/lyrics', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const trackId = parseInt(req.params.trackId);
        const { time, text } = req.body;

        const lyric = await prisma.lyrics.create({
            data: {
                trackId,
                time,
                text
            }
        });

        res.json(lyric);
    } catch (error) {
        console.error('Add lyrics error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/artists', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, image, bio, listenersCount } = req.body;

        const artist = await prisma.artist.create({
            data: {
                name,
                image,
                bio,
                listenersCount: listenersCount || 0
            }
        });

        res.json(artist);
    } catch (error) {
        console.error('Create artist error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;