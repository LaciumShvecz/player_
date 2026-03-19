import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import { apiService } from '@/services/api.service'
import { Track } from '@/components/elements/track-item/Track'
import { playerStore } from '@/store/player.store'
import { PagesConfig } from '@/config/pages.config'
import type { IAlbum } from '@/types/album.types'

export function AlbumPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [album, setAlbum] = useState<IAlbum | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!id) return

            try {
                setIsLoading(true)
                const albumId = parseInt(id)
                if (isNaN(albumId)) {
                    setError('Invalid album ID')
                    return
                }

                const data = await apiService.getAlbumById(albumId)
                console.log('Album loaded:', data)
                setAlbum(data)
            } catch (err) {
                console.error('Error fetching album:', err)
                setError('Failed to load album')
            } finally {
                setIsLoading(false)
            }
        }

        fetchAlbum()
    }, [id])

    const handlePlayAll = () => {
        if (album?.tracks && album.tracks.length > 0) {
            playerStore.setTracks(album.tracks)
            playerStore.setTrack(album.tracks[0])
        }
    }

    const handleArtistClick = () => {
        if (album?.artist) {
            navigate(PagesConfig.ARTISTS(String(album.artist.id)))
        }
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-white">Loading album...</div>
            </div>
        )
    }

    if (error || !album) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-red-500">{error || 'Album not found'}</div>
            </div>
        )
    }

    return (
        <div>
            <div className="relative mb-8">
                <div className="flex gap-6 items-end">
                    <img
                        src={album.cover || '/default-album.jpg'}
                        alt={album.name}
                        className="w-48 h-48 rounded-lg shadow-2xl"
                    />

                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-300 mb-2">АЛЬБОМ</p>
                        <h1 className="text-5xl font-bold text-white mb-4">{album.name}</h1>

                        <div className="flex items-center gap-4 text-gray-300">
                            <button
                                onClick={handleArtistClick}
                                className="hover:underline hover:text-primary"
                            >
                                {album.artist.name}
                            </button>
                            <span>•</span>
                            <span>{album.trackCount || album.tracks.length} треков</span>
                            {album.totalDuration && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={16} />
                                        {formatDuration(album.totalDuration)}
                                    </span>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handlePlayAll}
                            className="mt-6 bg-primary rounded-full px-8 py-3 text-black font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Play fill="black" size={20} />
                            Слушать всё
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6">
                <div className="border-b border-gray-800 pb-2 mb-4 flex items-center text-gray-400 text-sm">
                    <span className="w-8 text-center">#</span>
                    <span className="flex-1">НАЗВАНИЕ</span>
                    <span className="w-20 text-right">ДЛИТЕЛЬНОСТЬ</span>
                </div>

                <div className="space-y-1">
                    {album.tracks.map((track, index) => (
                        <div key={track.id} className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg group">
                            <span className="text-gray-400 w-8 text-center">{index + 1}</span>
                            <div className="flex-1">
                                <Track track={track} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}