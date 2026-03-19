const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, isPublic } = req.body;

        const playlist = await prisma.playlist.create({
            data: {
                name,
                description,
                isPublic: isPublic ?? true,
                userId: req.user.id
            }
        });

        res.json(playlist);
    } catch (error) {
        console.error('Create playlist error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/my', authMiddleware, async (req, res) => {
    try {
        const playlists = await prisma.playlist.findMany({
            where: { userId: req.user.id },
            include: {
                tracks: {
                    include: {
                        track: {
                            include: { artist: true }
                        }
                    }
                }
            }
        });

        res.json(playlists);
    } catch (error) {
        console.error('Get playlists error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:playlistId/tracks/:trackId', authMiddleware, async (req, res) => {
    try {
        const { playlistId, trackId } = req.params;
        const trackIdNum = parseInt(trackId);

        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                userId: req.user.id
            }
        });

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const playlistTrack = await prisma.playlistTrack.create({
            data: {
                playlistId,
                trackId: trackIdNum
            }
        });

        res.json(playlistTrack);
    } catch (error) {
        console.error('Add to playlist error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:playlistId/tracks/:trackId', authMiddleware, async (req, res) => {
    try {
        const { playlistId, trackId } = req.params;
        const trackIdNum = parseInt(trackId);

        await prisma.playlistTrack.deleteMany({
            where: {
                playlistId,
                trackId: trackIdNum,
                playlist: {
                    userId: req.user.id
                }
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Remove from playlist error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:playlistId', authMiddleware, async (req, res) => {
    try {
        const { playlistId } = req.params;

        await prisma.playlist.deleteMany({
            where: {
                id: playlistId,
                userId: req.user.id
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete playlist error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;