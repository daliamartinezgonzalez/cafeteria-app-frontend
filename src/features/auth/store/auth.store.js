import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            permissions: [],
            isAuthenticated: false,
            isLoading: true,

            setToken: (token) => {
                set({
                    token,
                    isAuthenticated: true
                })
            },

            setUser: (user) => {
                set({ user })
            },

            setPermissions: (permissions) => {
                set({ permissions })
            },

            setLoading: (value) => {
                set({ isLoading: value })
            },

            logout: () => {
                set({
                    token: null,
                    user: null,
                    permissions: [],
                    isAuthenticated: false,
                    isLoading: false
                })
            }
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setLoading(false)
            }
        }
    )
)