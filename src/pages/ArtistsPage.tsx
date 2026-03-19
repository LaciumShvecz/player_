// src/pages/ArtistsPage.tsx
import { useEffect, useState } from 'react'
import { apiService } from '@/services/api.service'
import { ArtistCard } from '@/components/elements/artist-card/ArtistCard'
import { SearchField } from '@/components/elements/search-field/SearchField'
import { useQueryState } from 'nuqs'
import type { IArtist } from '@/types/artist.types'

export function ArtistsPage() {
    const [artists, setArtists] = useState<IArtist[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useQueryState('q')

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setIsLoading(true)
                const data = await apiService.getArtists()
                console.log('Artists loaded:', data)
                setArtists(data)
            } catch (err) {
                console.error('Error in fetchArtists:', err)
                setError('Failed to load artists')
            } finally {
                setIsLoading(false)
            }
        }

        fetchArtists()
    }, [])

    const filteredArtists = artists.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    )

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-white">Loading artists...</div>
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

    if (artists.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">No artists found</div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-4">Исполнители</h1>
                <SearchField
                    value={searchTerm || ''}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredArtists.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    No artists found matching "{searchTerm}"
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredArtists.map(artist => (
                        <ArtistCard key={artist.id} artist={artist} />
                    ))}
                </div>
            )}
        </div>
    )
}