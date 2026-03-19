import { useRef, useEffect, useCallback } from 'react'
import { playerStore } from '@/store/player.store'

export const useAudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		if (audioRef.current && playerStore.currentTrack) {
			audioRef.current.src = playerStore.currentTrack.file
			audioRef.current.load()

			if (playerStore.isPlaying) {
				audioRef.current.play().catch(console.error)
			}
		}
	}, [playerStore.currentTrack])

	useEffect(() => {
		if (!audioRef.current) return

		if (playerStore.isPlaying) {
			audioRef.current.play().catch(error => {
				console.error('Playback failed:', error)
				playerStore.pause()
			})
		} else {
			audioRef.current.pause()
		}
	}, [playerStore.isPlaying])

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = playerStore.volume / 100
		}
	}, [playerStore.volume])

	const togglePlayPause = useCallback(() => {
		playerStore.togglePlayPause()
	}, [])

	const onSeek = useCallback((time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time
			playerStore.seek(time)
		}
	}, [])

	const setVolume = useCallback((volume: number) => {
		playerStore.setVolume(volume)
	}, [])

	const changeTrack = useCallback((type: 'prev' | 'next') => {
		playerStore.changeTrack(type)
	}, [])

	return {
		audioRef,
		changeTrack,
		onSeek,
		setVolume,
		togglePlayPause
	}
}