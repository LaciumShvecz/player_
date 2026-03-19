import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authStore } from '@/store/auth.store'
import { observer } from 'mobx-react-lite'

export const RegisterPage = observer(() => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await authStore.register({ email, password, name })

        if (result.success) {
            navigate('/')
        } else {
            setError(result.error || 'Registration failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
            <div className="bg-gray-800 p-8 rounded-xl w-96">
                <h1 className="text-2xl font-bold text-white mb-6">Регистрация</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Имя</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-primary rounded text-black font-semibold hover:bg-primary/80"
                    >
                        Зарегистрироваться
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    )
})