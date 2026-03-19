import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { authStore } from '@/store/auth.store'
import { apiService } from '@/services/api.service'
import { Plus, Music } from 'lucide-react'

interface Playlist {
    id: string
    name: string
    description?: string
    tracks: any[]
}

export const PlaylistManager = observer(() => {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [showCreate, setShowCreate] = useState(false)
    const [newPlaylistName, setNewPlaylistName] = useState('')
    const [newPlaylistDesc, setNewPlaylistDesc] = useState('')

    useEffect(() => {
        if (authStore.isAuthenticated) {
            loadPlaylists()
        }
    }, [])

    const loadPlaylists = async () => {
        try {
            const response = await apiService.getMyPlaylists()
            setPlaylists(response)
        } catch (error) {
            console.error('Load playlists error:', error)
        }
    }

    const createPlaylist = async () => {
        if (!newPlaylistName.trim()) return

        try {
            await apiService.createPlaylist({
                name: newPlaylistName,
                description: newPlaylistDesc
            })
            setNewPlaylistName('')
            setNewPlaylistDesc('')
            setShowCreate(false)
            loadPlaylists()
        } catch (error) {
            console.error('Create playlist error:', error)
        }
    }

    if (!authStore.isAuthenticated) {
        return (
            <div className="text-center text-gray-400 py-8">
                Войдите, чтобы создавать плейлисты
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Мои плейлисты</h2>
                <button
                    onClick={() => setShowCreate(true)}
                    className="p-2 bg-primary rounded-full hover:scale-105 transition-transform"
                >
                    <Plus size={20} fill="black" />
                </button>
            </div>

            {showCreate && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                    <input
                        type="text"
                        placeholder="Название плейлиста"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="w-full mb-2 px-3 py-2 bg-gray-700 rounded text-white"
                    />
                    <input
                        type="text"
                        placeholder="Описание (необязательно)"
                        value={newPlaylistDesc}
                        onChange={(e) => setNewPlaylistDesc(e.target.value)}
                        className="w-full mb-2 px-3 py-2 bg-gray-700 rounded text-white"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={createPlaylist}
                            className="px-4 py-2 bg-primary rounded text-black font-semibold"
                        >
                            Создать
                        </button>
                        <button
                            onClick={() => setShowCreate(false)}
                            className="px-4 py-2 bg-gray-600 rounded text-white"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {playlists.map(playlist => (
                    <div
                        key={playlist.id}
                        className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                                <Music size={20} className="text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{playlist.name}</h3>
                                <p className="text-sm text-gray-400">
                                    {playlist.tracks.length} треков
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
})