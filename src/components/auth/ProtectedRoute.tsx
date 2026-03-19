import { Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/store/auth.store'

interface Props {
    children: React.ReactNode
    adminOnly?: boolean
}

export const ProtectedRoute = observer(({ children, adminOnly }: Props) => {
    if (authStore.isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!authStore.isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && !authStore.isAdmin) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
})