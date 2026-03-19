export type UserRole = 'USER' | 'ADMIN'

export interface IUser {
    id: string
    email: string
    name?: string
    role: UserRole
}

export interface IAuthResponse {
    user: IUser
    token: string
}

export interface ILoginRequest {
    email: string
    password: string
}

export interface IRegisterRequest {
    email: string
    password: string
    name?: string
}