import { ProgressBar } from '@/components/ui/progress-bar/ProgressBar'
import { TrackInfo } from '@/components/ui/track-info/TrackInfo'
import { playerStore } from '@/store/player.store'
import {
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume,
	Volume1,
	Volume2,
	Repeat,
	Repeat1,
	Shuffle
} from 'lucide-react'
import { useAudioPlayer } from './useAudioPlayer'
import cn from 'clsx'

export function AudioPlayer() {
	const { audioRef, changeTrack, onSeek, setVolume, togglePlayPause } =
		useAudioPlayer()

	if (!playerStore.currentTrack) {
		return null
	}

	const track = playerStore.currentTrack

	const getRepeatIcon = () => {
		switch (playerStore.repeatMode) {
			case 'one':
				return <Repeat1 size={18} />
			case 'all':
				return <Repeat size={18} />
			default:
				return <Repeat size={18} className="opacity-50" />
		}
	}

	const handlePrev = () => {
		changeTrack('prev')
	}

	const handleNext = () => {
		changeTrack('next')
	}

	return (
		<div className="w-full py-1 px-10 bg-player-bg border-t border-white/10 grid grid-cols-[1fr_5fr] fixed bottom-0 left-0">
			<div className="min-w-0 pr-4">
				<TrackInfo
					title={track.name}
					subTitle={track.artist.name}
					image={track.cover}
				/>
			</div>

			<audio
				ref={audioRef}
				onTimeUpdate={e => {
					const currentTime = Math.floor(e.currentTarget.currentTime)
					playerStore.seek(currentTime)
				}}
				onEnded={() => {
					console.log('Track ended')
					handleNext()
				}}
			/>

			<div className="grid grid-cols-[1fr_6.9fr_2fr] gap-8 items-center">
				<div className="flex items-center gap-2.5">
					{/* Кнопка перемешивания */}
					<button
						className={cn(
							'opacity-80 hover:opacity-100 duration-300 transition-colors',
							playerStore.shuffleMode && 'text-primary'
						)}
						onClick={() => playerStore.toggleShuffle()}
						title="Shuffle"
					>
						<Shuffle size={18} />
					</button>

					<button
						className="opacity-80 hover:opacity-100 duration-300"
						onClick={handlePrev}
					>
						<SkipBack size={20} />
					</button>

					<button
						className="rounded-full bg-gradient-to-r from-[#3C3D41] to-[#444549] p-3.5 border border-white/5 border-solid hover:shadow text-primary"
						onClick={togglePlayPause}
					>
						{playerStore.isPlaying ? <Pause size={20} /> : <Play size={20} />}
					</button>

					<button
						className="opacity-80 hover:opacity-100 duration-300"
						onClick={handleNext}
					>
						<SkipForward size={20} />
					</button>

					{/* Кнопка повтора */}
					<button
						className={cn(
							'opacity-80 hover:opacity-100 duration-300 transition-colors',
							playerStore.repeatMode !== 'none' && 'text-primary'
						)}
						onClick={() => playerStore.toggleRepeatMode()}
						title={`Repeat: ${playerStore.repeatMode}`}
					>
						{getRepeatIcon()}
					</button>
				</div>

				<ProgressBar
					currentValue={playerStore.currentTime}
					value={track.duration}
					progress={playerStore.progress}
					onSeek={(time: number) => onSeek(time)}
					isTextDisplayed
				/>

				<div className="pl-6 max-w-36 grid grid-cols-[1fr_8fr] gap-1 items-center">
					<button onClick={() => setVolume(playerStore.volume === 0 ? 85 : 0)}>
						{playerStore.volume === 0 ? (
							<Volume />
						) : playerStore.volume < 60 ? (
							<Volume1 />
						) : (
							<Volume2 />
						)}
					</button>

					<ProgressBar
						currentValue={playerStore.volume}
						value={100}
						progress={playerStore.volume}
						onSeek={(value: number) => setVolume(value)}
						isThumbDisplayed={false}
					/>
				</div>
			</div>
		</div>
	)
}