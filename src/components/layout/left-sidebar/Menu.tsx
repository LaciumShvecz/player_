import { NavLink } from 'react-router-dom'
import { Home, Compass, Mic2, Heart, Clock, Album } from 'lucide-react'
import { PagesConfig } from '@/config/pages.config'
import cn from 'clsx'

export function Menu() {
	console.log('Menu rendered')
	return (
		<nav className="space-y-2">
			<NavLink
				to={PagesConfig.HOME}
				className={({ isActive }) => cn(
					'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
					isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
				)}
			>
				<Home size={20} />
				<span>Главная</span>
			</NavLink>

			<NavLink
				to={PagesConfig.DISCOVER}
				className={({ isActive }) => cn(
					'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
					isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
				)}
			>
				<Compass size={20} />
				<span>Обзор</span>
			</NavLink>

			<div className="border-t border-white/10 my-4"></div>

			<NavLink
				to={PagesConfig.RECENTLY_PLAYED}
				className={({ isActive }) => cn(
					'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
					isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
				)}
			>
				<Clock size={20} />
				<span>Недавние</span>
			</NavLink>

			<NavLink
				to={PagesConfig.LIKED_SONGS}
				className={({ isActive }) => cn(
					'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
					isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
				)}
			>
				<Heart size={20} />
				<span>Любимые треки</span>
			</NavLink>

			<div className="border-t border-white/10 my-4"></div>

			<NavLink
				to={PagesConfig.ARTISTS()}
				className={({ isActive }) => cn(
					'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
					isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
				)}
			>
				<Mic2 size={20} />
				<span>Исполнители</span>
			</NavLink>

			<NavLink
				to={PagesConfig.ALBUMS()}
				className={({ isActive }) => cn(
					'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
					isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
				)}
			>
				<Album size={20} />
				<span>Альбомы</span>
			</NavLink>

		</nav>
	)
}