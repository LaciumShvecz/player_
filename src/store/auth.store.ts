import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import type { IUser, ILoginRequest, IRegisterRequest } from '@/types/user.types'

const API_URL = 'http://localhost:5000/api'

class AuthStore {
    user: IUser | null = null
    token: string | null = localStorage.getItem('token')
    isLoading: boolean = false

    constructor() {
        makeAutoObservable(this)
        if (this.token) {
            this.loadUser()
        }
    }

    get isAuthenticated() {
        return !!this.user
    }

    get isAdmin() {
        return this.user?.role === 'ADMIN'
    }

    async loadUser() {
        try {
            this.isLoading = true
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
            this.user = response.data
        } catch (error) {
            console.error('Load user error:', error)
            this.logout()
        } finally {
            this.isLoading = false
        }
    }

    async login(data: ILoginRequest) {
        try {
            this.isLoading = true
            const response = await axios.post(`${API_URL}/auth/login`, data)

            this.user = response.data.user
            this.token = response.data.token
            localStorage.setItem('token', this.token)

            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            }
        } finally {
            this.isLoading = false
        }
    }

    async register(data: IRegisterRequest) {
        try {
            this.isLoading = true
            const response = await axios.post(`${API_URL}/auth/register`, data)

            this.user = response.data.user
            this.token = response.data.token
            localStorage.setItem('token', this.token)

            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            }
        } finally {
            this.isLoading = false
        }
    }

    logout() {
        this.user = null
        this.token = null
        localStorage.removeItem('token')
    }
}

export const authStore = new AuthStore()