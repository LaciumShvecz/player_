import type { IMenuItem } from '@/types/menu.types'
import { Compass, Home } from 'lucide-react'
import { PagesConfig } from '../config/pages.config'

export const MENU_ITEMS: IMenuItem[] = [
	{
		icon: Home,
		name: 'Главная',
		link: PagesConfig.HOME
	},
	{
		icon: Compass,
		name: 'Поиск',
		link: PagesConfig.DISCOVER
	}
]

export const LIBRARY_MENU_ITEMS: IMenuItem[] = [
	{
		name: 'Недавно прослушанное',
		link: PagesConfig.RECENTLY_PLAYED
	},
	{
		name: 'Любимые песни',
		link: PagesConfig.LIKED_SONGS
	},
	{
		name: 'Альбомы',
		link: PagesConfig.ALBUMS()
	},
	{
		name: 'Исполнители',
		link: PagesConfig.ARTISTS()
	}
]
