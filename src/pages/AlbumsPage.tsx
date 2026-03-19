import { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs'
import { apiService } from '@/services/api.service'
import { AlbumCard } from '@/components/elements/album-card/AlbumCard'
import { SearchField } from '@/components/elements/search-field/SearchField'
import type { IAlbum } from '@/types/album.types'

export function AlbumsPage() {
    const [albums, setAlbums] = useState<IAlbum[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useQueryState('q')

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                setIsLoading(true)
                const data = await apiService.getAlbums()
                console.log('Albums loaded:', data)
                setAlbums(data)
            } catch (err) {
                console.error('Error fetching albums:', err)
                setError('Failed to load albums')
            } finally {
                setIsLoading(false)
            }
        }

        fetchAlbums()
    }, [])

    const filteredAlbums = albums.filter(album => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return album.name.toLowerCase().includes(searchLower) ||
            album.artist.name.toLowerCase().includes(searchLower)
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-white">Loading albums...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-4">Альбомы</h1>
                <SearchField
                    value={searchTerm || ''}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredAlbums.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    {searchTerm ? 'No albums found' : 'No albums available'}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredAlbums.map(album => (
                        <AlbumCard key={album.id} album={album} />
                    ))}
                </div>
            )}
        </div>
    )
}