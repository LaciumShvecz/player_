import { NavLink } from 'react-router-dom'
import cn from 'clsx'

interface Props {
    items: Array<{ name: string; link: string }>
    title: string
    children?: React.ReactNode
}

export function PlaylistMenu({ items, title, children }: Props) {
    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-400 px-4 mb-2">{title}</h3>
            <div className="space-y-1">
                {items.map(item => (
                    <NavLink
                        key={item.name}
                        to={item.link}
                        className={({ isActive }) => cn(
                            'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                            isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        )}
                    >
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>
            {children}
        </div>
    )
}