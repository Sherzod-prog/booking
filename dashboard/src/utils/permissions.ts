export type UserRole = "ADMIN" | "MANAGER" | "USER";

export const getStoredUser = () => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const getStoredRole = (): UserRole | null => {
    const user = getStoredUser();
    return user?.role ?? null;
};

export const isAdmin = (role: UserRole | null) => role === "ADMIN";

export const isManager = (role: UserRole | null) => role === "MANAGER";

export const isAdminOrManager = (role: UserRole | null) =>
    role === "ADMIN" || role === "MANAGER";
