// src/types/track.types.ts
import type { ILyrics } from "./lyrics.types";

export interface ITrack {
	id?: number
	name: string
	file: string
	duration: number
	cover: string

	// Вместо полного IArtist - только нужные поля
	artist: {
		id: number
		name: string
		image?: string
		listenersCount?: number
	}

	// Связи
	artistId?: number
	lyrics?: ILyrics[]
}