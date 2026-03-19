import { playerStore } from '@/store/player.store'
import { Pause, Play } from 'lucide-react'
import cn from 'clsx'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { MarqueeText } from '../marquee-text/MarqueeText'

interface Props {
	image: string
	title: string
	subTitle: string
}

export function TrackInfo({ image, title, subTitle }: Props) {
	if (!title || !subTitle || !image) {
		return null
	}

	return (
		<div className="flex items-center gap-3 min-w-0"> {/* Добавлен min-w-0 */}
			<div className="block relative group flex-shrink-0">
				<CircularProgressbar
					value={playerStore.progress}
					className="absolute"
					strokeWidth={5}
					styles={{
						trail: { stroke: '#2E3235' },
						path: {
							stroke: 'var(--color-primary)',
							transition: 'stroke-dashoffset 0.5s ease 0s'
						}
					}}
					counterClockwise
				/>

				<div
					className={cn(
						'absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-100'
					)}
				>
					{playerStore.isPlaying ? <Pause size={20} /> : <Play size={20} />}
				</div>

				<img
					src={image}
					alt={title}
					className="w-12 h-12 rounded-full m-1.5 object-cover"
				/>
			</div>

			<div className="flex flex-col min-w-0 flex-1">
				<div className="text-white text-lg font-medium w-full">
					<MarqueeText text={title} speed={7} />
				</div>
				<div className="text-gray-400 w-full">
					<MarqueeText text={subTitle} speed={7} />
				</div>
			</div>
		</div>
	)
}