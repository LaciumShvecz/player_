// src/components/elements/artist-card/ArtistCard.tsx
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { PagesConfig } from '@/config/pages.config'
import type { IArtist } from '@/types/artist.types'

interface Props {
    artist: IArtist
}

export function ArtistCard({ artist }: Props) {
    const navigate = useNavigate()

    console.log('🎵 Artist in card:', {
        name: artist.name,
        tracks: artist.tracks,
        tracksLength: artist.tracks?.length,
        listenersCount: artist.listenersCount
    })

    const handleClick = () => {
        navigate(PagesConfig.ARTISTS(String(artist.id)))
    }

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        console.log('Play artist:', artist.name)
    }

    // Проверяем, есть ли треки
    console.log('Artist tracks:', artist.name, artist.tracks?.length)

    return (
        <div
            onClick={handleClick}
            className="group bg-player-bg rounded-xl p-4 hover:bg-gray-800 transition-colors cursor-pointer"
        >
            <div className="relative mb-4">
                <img
                    src={artist.image || '/default-artist.jpg'}
                    alt={artist.name}
                    className="w-full aspect-square rounded-full object-cover shadow-lg"
                />
                <button
                    onClick={handlePlay}
                    className="absolute bottom-2 right-2 bg-primary rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                >
                    <Play fill="black" size={20} />
                </button>
            </div>

            <h3 className="font-semibold text-white truncate">{artist.name}</h3>
            <p className="text-sm text-gray-400">
                {artist.tracks?.length || 0} треков • {artist.listenersCount?.toLocaleString()} слушателей
            </p>
        </div>
    )
}