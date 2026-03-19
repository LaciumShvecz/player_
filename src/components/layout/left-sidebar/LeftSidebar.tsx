import { Menu } from './Menu'
import { SidebarPlaylists } from './SidebarPlaylists'

export function LeftSidebar() {
	console.log('LeftSidebar rendered')
	return (
		<div className="w-64 bg-sidebar-bg flex flex-col h-full">
			<div className="p-4">
				<h1 className="text-2xl font-bold text-primary">Player</h1>
			</div>
			<div className="flex-1 overflow-y-auto px-4 py-4">
				<Menu />
				<SidebarPlaylists />
			</div>
		</div>
	)
}