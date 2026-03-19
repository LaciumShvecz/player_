// src/types/album.types.ts
import type { ITrack } from './track.types'
import type { IArtist } from './artist.types'

export interface IAlbum {
    id: number
    name: string
    cover?: string
    releaseDate?: string
    artistId: number
    artist: IArtist
    tracks: ITrack[]
    trackCount?: number
    totalDuration?: number
}