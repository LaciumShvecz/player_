// src/store/player.store.ts
import type { ITrack } from '@/types/track.types'
import { makeAutoObservable } from 'mobx'

export type RepeatMode = 'none' | 'one' | 'all'
export type ShuffleMode = boolean

class MusicPlayerStore {
	isPlaying: boolean = false
	currentTrack: ITrack | null = null
	volume: number = 85
	currentTime: number = 0
	progress: number = 0
	private tracks: ITrack[] = []
	private isSettingTrack: boolean = false // Флаг для защиты от рекурсии

	// Новые режимы
	repeatMode: RepeatMode = 'none'
	shuffleMode: ShuffleMode = false
	private shuffledTracks: ITrack[] = []

	constructor() {
		makeAutoObservable(this)
	}

	setTracks(tracks: ITrack[]) {
		this.tracks = tracks
		this.updateShuffledTracks()
	}

	// Обновление перемешанного списка
	private updateShuffledTracks() {
		this.shuffledTracks = [...this.tracks].sort(() => Math.random() - 0.5)
	}

	// Переключение режима повтора
	toggleRepeatMode() {
		const modes: RepeatMode[] = ['none', 'all', 'one']
		const currentIndex = modes.indexOf(this.repeatMode)
		const nextIndex = (currentIndex + 1) % modes.length
		this.repeatMode = modes[nextIndex]
		console.log('Repeat mode:', this.repeatMode)
	}

	// Переключение перемешивания
	toggleShuffle() {
		this.shuffleMode = !this.shuffleMode
		if (this.shuffleMode) {
			this.updateShuffledTracks()
		}
		console.log('Shuffle mode:', this.shuffleMode)
	}

	// Получение текущего списка треков (с учетом перемешивания)
	private getCurrentPlaylist(): ITrack[] {
		return this.shuffleMode ? this.shuffledTracks : this.tracks
	}

	setTrack(track: ITrack | null) {
		// Защита от рекурсии
		if (this.isSettingTrack) return

		if (!track) return

		// Если это тот же трек, просто переключаем воспроизведение
		if (this.currentTrack?.id === track.id) {
			this.togglePlayPause()
			return
		}

		this.isSettingTrack = true

		console.log('Setting track:', track.name)
		this.currentTrack = track
		this.currentTime = 0
		this.progress = 0
		this.isPlaying = true

		// Сбрасываем флаг через микротаск, чтобы избежать рекурсии
		setTimeout(() => {
			this.isSettingTrack = false
		}, 0)
	}

	togglePlayPause() {
		this.isPlaying = !this.isPlaying
	}

	play() {
		this.isPlaying = true
	}

	pause() {
		this.isPlaying = false
	}

	seek(time: number) {
		this.currentTime = time
		this.progress = (time / (this.currentTrack?.duration || 1)) * 100
	}

	setVolume(volume: number) {
		this.volume = volume
	}

	changeTrack(type: 'prev' | 'next') {
		if (!this.currentTrack) return

		const playlist = this.getCurrentPlaylist()
		if (playlist.length === 0) return

		const currentIndex = playlist.findIndex(
			track => track.id === this.currentTrack?.id
		)

		if (currentIndex === -1) return

		let nextIndex: number

		if (type === 'next') {
			// Обработка повтора одного трека
			if (this.repeatMode === 'one') {
				// Просто продолжаем играть тот же трек
				this.seek(0)
				return
			}

			nextIndex = currentIndex + 1

			// Если дошли до конца
			if (nextIndex >= playlist.length) {
				if (this.repeatMode === 'all') {
					nextIndex = 0 // Начинаем сначала
				} else {
					// Останавливаем воспроизведение
					this.pause()
					return
				}
			}
		} else { // prev
			nextIndex = currentIndex - 1
			if (nextIndex < 0) {
				if (this.repeatMode === 'all') {
					nextIndex = playlist.length - 1 // Идем в конец
				} else {
					// Останавливаем воспроизведение
					this.pause()
					return
				}
			}
		}

		const nextTrack = playlist[nextIndex]
		this.setTrack(nextTrack)
	}
}

export const playerStore = new MusicPlayerStore()