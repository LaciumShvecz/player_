// src/pages/HomePage.tsx
import { Play } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useMemo } from 'react'
import { SearchField } from '@/components/elements/search-field/SearchField'
import { Track } from '@/components/elements/track-item/Track'
import { tracksStore } from '@/store/tracks.store'
import { playerStore } from '@/store/player.store'

export function HomePage() {
    const [searchTerm, setSearchTerm] = useQueryState('q')

    useEffect(() => {
        const loadTracks = async () => {
            console.log('Loading tracks...')
            await tracksStore.fetchTracks()
            console.log('Tracks loaded:', tracksStore.tracks.length)

            playerStore.setTracks(tracksStore.tracks)
            console.log('Tracks set in player:', tracksStore.tracks.length)

            if (tracksStore.tracks.length > 0 && !playerStore.currentTrack) {
                console.log('Setting first track:', tracksStore.tracks[0].name)
                playerStore.setTrack(tracksStore.tracks[0])
            }
        }

        loadTracks()
    }, [])

    const filteredTracks = useMemo(() => {
        if (!tracksStore.tracks.length) return []

        if (!searchTerm) return tracksStore.tracks

        const searchLower = searchTerm.toLowerCase()

        return tracksStore.tracks.filter(track => {
            const matchByName = track.name.toLowerCase().includes(searchLower)
            const matchByArtist = track.artist?.name?.toLowerCase().includes(searchLower)

            let matchByLyrics = false
            if (track.lyrics && track.lyrics.length > 0) {
                matchByLyrics = track.lyrics.some(line =>
                    line.text.toLowerCase().includes(searchLower)
                )
            }

            return matchByName || matchByArtist || matchByLyrics
        })
    }, [searchTerm, tracksStore.tracks])

    const artistsWithTracks = useMemo(() => {
        const artistsMap = new Map()

        tracksStore.tracks.forEach(track => {
            if (!artistsMap.has(track.artist.name)) {
                artistsMap.set(track.artist.name, {
                    ...track.artist,
                    tracks: []
                })
            }
            artistsMap.get(track.artist.name).tracks.push(track)
        })

        return Array.from(artistsMap.values())
    }, [tracksStore.tracks])

    if (tracksStore.isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    if (tracksStore.error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{tracksStore.error}</div>
            </div>
        )
    }

    const mainArtist = artistsWithTracks[0]

    return (
        <div>
            <SearchField
                value={searchTerm || ''}
                onChange={e => setSearchTerm(e.target.value)}
            />

            {mainArtist && (
                <div className="relative mt-4">
                    <img
                        src={'/banner.jpg'}
                        alt={mainArtist.name}
                        className="rounded-xl w-full h-48 object-cover"
                    />

                    <div className="flex items-center justify-between absolute bottom-layout left-0 w-full px-layout">
                        <div>
                            <h1 className="text-2xl font-semibold mb-[0.18rem] text-white">
                                {mainArtist.name}
                            </h1>
                            <h2 className="text-primary font-medium">
                                {mainArtist.listenersCount?.toLocaleString()} listeners
                            </h2>
                        </div>

                        <button
                            onClick={() => {
                                if (filteredTracks.length > 0) {
                                    playerStore.setTrack(filteredTracks[0])
                                    playerStore.togglePlayPause()
                                }
                            }}
                            className="rounded-full bg-gradient-to-r from-[#2F3034] to-[#1F2026] p-5 border border-player-bg border-solid duration-300 hover:translate-y-[-2px] hover:shadow"
                        >
                            <Play
                                className="text-primary"
                                fill="var(--color-primary)"
                            />
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-5">
                {filteredTracks.map(track => (
                    <Track
                        key={track.id || track.name}
                        track={track}
                    />
                ))}
            </div>
        </div>
    )
}