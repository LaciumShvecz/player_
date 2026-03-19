import { observer } from 'mobx-react-lite'
import { authStore } from '@/store/auth.store'

export const AdminPage = observer(() => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Админ панель</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Карточка для управления треками */}
                <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Треки</h2>
                    <p className="text-gray-400 mb-4">Добавление, редактирование и удаление треков</p>
                    <button className="px-4 py-2 bg-primary rounded text-black font-semibold hover:bg-primary/80">
                        Управлять
                    </button>
                </div>

                {/* Карточка для управления артистами */}
                <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Артисты</h2>
                    <p className="text-gray-400 mb-4">Добавление и редактирование информации об артистах</p>
                    <button className="px-4 py-2 bg-primary rounded text-black font-semibold hover:bg-primary/80">
                        Управлять
                    </button>
                </div>

                {/* Карточка для управления альбомами */}
                <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Альбомы</h2>
                    <p className="text-gray-400 mb-4">Управление альбомами и обложками</p>
                    <button className="px-4 py-2 bg-primary rounded text-black font-semibold hover:bg-primary/80">
                        Управлять
                    </button>
                </div>

                {/* Карточка для управления текстами */}
                <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Тексты песен</h2>
                    <p className="text-gray-400 mb-4">Добавление и редактирование текстов</p>
                    <button className="px-4 py-2 bg-primary rounded text-black font-semibold hover:bg-primary/80">
                        Управлять
                    </button>
                </div>

                {/* Карточка для управления пользователями */}
                <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Пользователи</h2>
                    <p className="text-gray-400 mb-4">Управление пользователями и ролями</p>
                    <button className="px-4 py-2 bg-primary rounded text-black font-semibold hover:bg-primary/80">
                        Управлять
                    </button>
                </div>
            </div>
        </div>
    )
})