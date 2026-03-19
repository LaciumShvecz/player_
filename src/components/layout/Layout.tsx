import { LeftSidebar } from './left-sidebar/LeftSidebar'
import { RightSidebar } from './right-sidebar/RightSidebar'
import { AudioPlayer } from '../elements/player/AudioPlayer'

interface Props {
	children: React.ReactNode
}

export function Layout({ children }: Props) {
	return (
		<div className="h-screen flex flex-col">
			<div className="flex-1 flex overflow-hidden pb-17">
				<LeftSidebar />

				<main className="flex-1 overflow-y-auto px-6 py-4 ">
					{children}
				</main>

				<div className="w-80 overflow-y-auto">
					<RightSidebar />
				</div>
			</div>

			<AudioPlayer />
		</div>
	)
}