import { Pause, Play } from 'lucide-react';
import cn from 'clsx';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { playerStore } from '../../../store/player.store';
import { type ITrack } from '../../../types/track.types';
import { transformDuration } from '../../../utils/transform-duration';
import { AddToPlaylist } from './AddToPlaylist';

interface Props {
	track: ITrack;
}

export const Track = ({ track }: Props) => {
	const isActive = playerStore.currentTrack?.id === track.id;

	return (
		<div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg group">
			<div className="flex items-center gap-3">
				<button
					onClick={() => {
						playerStore.setTrack(track)
					}}
					className="block relative group/btn w-12 h-12"
				>
					{isActive && (
						<CircularProgressbar
							value={playerStore.progress}
							className="absolute inset-0"
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
					)}

					<div
						className={cn(
							'absolute inset-0 flex items-center justify-center group-hover/btn:opacity-100',
							isActive ? 'opacity-100' : 'opacity-0 duration-300'
						)}
					>
						{!isActive ? (
							<Play size={20} />
						) : playerStore.isPlaying ? (
							<Pause size={20} />
						) : (
							<Play size={20} />
						)}
					</div>

					<img
						src={track.cover || '/default-track.jpg'}
						alt={track.name}
						className="w-12 h-12 rounded-full object-cover"
					/>
				</button>

				<div>
					<div className="text-white text-lg font-medium">
						{track.name}
					</div>
					<div className="text-gray-400 text-sm">
						{track.artist?.name}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<AddToPlaylist track={track} />

				<span className="text-gray-400 text-sm">
          {transformDuration(track.duration)}
        </span>
			</div>
		</div>
	);
};