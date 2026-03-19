import { useEffect, useRef, useState } from 'react'
import { playerStore } from '@/store/player.store'
import { useLyrics } from '@/data/lyrics.data'
import { Play } from 'lucide-react'
import styles from './Lyrics.module.scss'

export function Lyrics() {
	const currentTrack = playerStore.currentTrack
	const { lyrics, isLoading, error } = useLyrics(currentTrack?.name || '')
	const [currentTime, setCurrentTime] = useState(0)
	const lyricsContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (currentTrack?.duration) {
			const timeInSeconds = (playerStore.progress / 100) * currentTrack.duration
			setCurrentTime(timeInSeconds)
		}
	}, [playerStore.progress, currentTrack?.duration])

	useEffect(() => {
		if (lyrics.length > 0 && lyricsContainerRef.current) {
			const activeIndex = lyrics.findIndex((line, index) => {
				const nextLine = lyrics[index + 1]
				return currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
			})

			if (activeIndex !== -1) {
				const activeElement = lyricsContainerRef.current.children[activeIndex] as HTMLElement
				if (activeElement) {
					activeElement.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					})
				}
			}
		}
	}, [currentTime, lyrics])

	if (!currentTrack) {
		return (
			<div className={styles.lyrics}>
				<div className={styles.noTrack}>Select a track to see lyrics</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className={styles.lyrics}>
				<div className={styles.loading}>Loading lyrics...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.lyrics}>
				<div className={styles.error}>{error}</div>
			</div>
		)
	}

	if (lyrics.length === 0) {
		return (
			<div className={styles.lyrics}>
				<div className={styles.noLyrics}>No lyrics available for this track</div>
			</div>
		)
	}

	const activeLineIndex = lyrics.findIndex((line, index) => {
		const nextLine = lyrics[index + 1]
		return currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
	})

	return (
		<div className={styles.lyrics} ref={lyricsContainerRef}>
			{lyrics.map((line, index) => {
				const isActive = index === activeLineIndex

				return (
					<button
						key={line.id || index}
						className={`${styles.line} ${isActive ? styles.active : ''}`}
						onClick={() => {
							const seekPercent = (line.time / (currentTrack.duration || 1)) * 100
							playerStore.seek(seekPercent)
						}}
					>
						<p>
							{isActive && (
								<Play
									fill="var(--color-primary)"
									className={styles.icon}
									size={10}
								/>
							)}
							{line.text}
						</p>
					</button>
				)
			})}
		</div>
	)
}