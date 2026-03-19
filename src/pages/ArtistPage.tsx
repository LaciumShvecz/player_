// src/pages/ArtistPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Play, Users, Music } from 'lucide-react'
import { apiService } from '@/services/api.service'
import { Track } from '@/components/elements/track-item/Track'
import { playerStore } from '@/store/player.store'
import type { IArtist } from '@/types/artist.types'
import type { ITrack } from '@/types/track.types'

interface IArtistWithTracks extends IArtist {
    tracks: ITrack[]
}

export function ArtistPage() {
    const { id } = useParams<{ id: string }>()
    const [artist, setArtist] = useState<IArtistWithTracks | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showFullBio, setShowFullBio] = useState(false) // Вернули

    useEffect(() => {
        const fetchArtist = async () => {
            if (!id) return

            try {
                setIsLoading(true)
                const artistId = parseInt(id)
                if (isNaN(artistId)) {
                    setError('Invalid artist ID')
                    return
                }

                const data = await apiService.getArtistById(artistId)
                console.log('📊 Artist data:', data)
                console.log('🎵 Tracks:', data.tracks)
                console.log('📀 Tracks count:', data.tracks?.length)

                setArtist(data as IArtistWithTracks)
            } catch (err) {
                console.error('Error fetching artist:', err)
                setError('Failed to load artist')
            } finally {
                setIsLoading(false)
            }
        }

        fetchArtist()
    }, [id])

    const handlePlayAll = () => {
        if (artist?.tracks && artist.tracks.length > 0) {
            playerStore.setTracks(artist.tracks)
            playerStore.setTrack(artist.tracks[0])
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-white">Loading artist...</div>
            </div>
        )
    }

    if (error || !artist) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-red-500">{error || 'Artist not found'}</div>
            </div>
        )
    }

    const bioPreview = artist.bio && artist.bio.length > 300
        ? artist.bio.substring(0, 300) + '...'
        : artist.bio

    return (
        <div className="pb-10">
            <div className="relative mb-8">
                <div className="h-72 w-full rounded-xl overflow-hidden">
                    {artist.image ? (
                        <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover opacity-50"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="absolute bottom-6 left-6 flex items-end gap-6">
                    <img
                        src={artist.image || '/default-artist.jpg'}
                        alt={artist.name}
                        className="w-40 h-40 rounded-full shadow-2xl border-4 border-white object-cover"
                    />

                    <div className="mb-2">
                        <p className="text-sm font-medium text-gray-300 mb-2">ИСПОЛНИТЕЛЬ</p>
                        <h1 className="text-5xl font-bold text-white mb-4">{artist.name}</h1>

                        <div className="flex items-center gap-6 text-gray-300">
                            <div className="flex items-center gap-2">
                                <Music size={18} />
                                <span>{artist.tracks?.length || 0} треков</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={18} />
                                <span>{artist.listenersCount?.toLocaleString()} слушателей</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePlayAll}
                    className="absolute bottom-6 right-6 bg-primary rounded-full p-4 hover:scale-105 transition-transform shadow-lg"
                >
                    <Play fill="black" size={24} />
                </button>
            </div>

            {artist.bio && (
                <div className="px-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Об исполнителе</h2>
                    <div className="bg-gray-800/50 rounded-xl p-6">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {showFullBio ? artist.bio : bioPreview}
                        </p>
                        {artist.bio.length > 300 && (
                            <button
                                onClick={() => setShowFullBio(!showFullBio)}
                                className="mt-4 text-primary hover:underline font-medium"
                            >
                                {showFullBio ? 'Скрыть' : 'Читать далее'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="px-6">
                <h2 className="text-2xl font-bold text-white mb-4">Популярные треки</h2>
                <div className="space-y-1">
                    {artist.tracks?.map((track, index) => (
                        <div key={track.id} className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg group">
                            <span className="text-gray-400 w-8 text-center">{index + 1}</span>
                            <Track track={track} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}