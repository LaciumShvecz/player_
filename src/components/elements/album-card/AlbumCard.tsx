import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { PagesConfig } from '@/config/pages.config'
import type { IAlbum } from '@/types/album.types'

interface Props {
    album: IAlbum
}

export function AlbumCard({ album }: Props) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(PagesConfig.ALBUMS(String(album.id)))
    }

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        console.log('Play album:', album.name)
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return (
        <div
            onClick={handleClick}
            className="group bg-player-bg rounded-xl p-4 hover:bg-gray-800 transition-colors cursor-pointer"
        >
            <div className="relative mb-4">
                <img
                    src={album.cover || '/default-album.jpg'}
                    alt={album.name}
                    className="w-full aspect-square rounded-lg object-cover shadow-lg"
                />
                <button
                    onClick={handlePlay}
                    className="absolute bottom-2 right-2 bg-primary rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                >
                    <Play fill="black" size={20} />
                </button>
            </div>

            <h3 className="font-semibold text-white truncate">{album.name}</h3>
            <p className="text-sm text-gray-400 truncate">{album.artist.name}</p>
            <p className="text-xs text-gray-500 mt-1">
                {album.trackCount || album.tracks.length} треков • {formatDuration(album.totalDuration || 0)}
            </p>
        </div>
    )
}