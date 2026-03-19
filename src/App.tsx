// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ArtistsPage } from './pages/ArtistsPage'
import { ArtistPage } from './pages/ArtistPage'
import { AlbumsPage } from './pages/AlbumsPage'
import { AlbumPage } from './pages/AlbumPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AdminPage } from './pages/AdminPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PagesConfig } from './config/pages.config'

function App() {
	return (
		<Layout>
			<Routes>
				{/* Публичные маршруты */}
				<Route path={PagesConfig.HOME} element={<HomePage />} />
				<Route path={PagesConfig.ARTISTS()} element={<ArtistsPage />} />
				<Route path={PagesConfig.ARTISTS(':id')} element={<ArtistPage />} />
				<Route path={PagesConfig.ALBUMS()} element={<AlbumsPage />} />
				<Route path={PagesConfig.ALBUMS(':id')} element={<AlbumPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />

				{/* Защищенные маршруты (только для авторизованных) */}
				<Route path="/playlists" element={
					<ProtectedRoute>
						<div>Мои плейлисты</div>
					</ProtectedRoute>
				} />

				{/* Админские маршруты (только для админов) */}
				<Route path="/admin" element={
					<ProtectedRoute adminOnly>
						<AdminPage />
					</ProtectedRoute>
				} />
				<Route path="/admin/tracks/new" element={
					<ProtectedRoute adminOnly>
						<div>Добавить трек</div>
					</ProtectedRoute>
				} />
			</Routes>
		</Layout>
	)
}

export default App