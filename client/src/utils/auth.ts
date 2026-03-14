export type StoredUser = {
    id: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "USER";
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function setAuth(token: string, user: StoredUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return !!getToken();
}