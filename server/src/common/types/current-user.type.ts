export type CurrentUserType = {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'MANAGER' | string;
};