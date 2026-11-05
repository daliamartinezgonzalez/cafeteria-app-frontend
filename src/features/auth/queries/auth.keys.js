export const authKeys = {
    all: ['auth'],

    profile: () => [...authKeys.all, 'profile'],

    permissions: () => [...authKeys.all, 'permissions']
}