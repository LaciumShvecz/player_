import type {ITrack} from "@/types/track.types.ts";

export interface IArtist {
	id: number
	name: string
	image?: string
	bio?: string
	listenersCount: number
	tracks?: ITrack[]
}

export interface IArtistWithTracks extends IArtist {
	tracks: import('./track.types').ITrack[]
}