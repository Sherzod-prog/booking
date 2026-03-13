import { AuthProvider } from "react-admin";

const apiUrl = "http://localhost:3000/api";

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: username,
                password,
            }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const json = await response.json();

        localStorage.setItem("token", json.accessToken);
        localStorage.setItem("user", JSON.stringify(json.user));

        return Promise.resolve();
    },

    logout: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return Promise.resolve();
    },

    checkAuth: async () => {
        const token = localStorage.getItem("token");
        return token ? Promise.resolve() : Promise.reject();
    },

    checkError: async (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: async () => {
        const user = localStorage.getItem("user");
        if (!user) return null;
        return JSON.parse(user).role;
    },

    getIdentity: async () => {
        const user = localStorage.getItem("user");
        if (!user) {
            throw new Error("No identity");
        }

        const parsed = JSON.parse(user);

        return {
            id: parsed.id,
            fullName: parsed.fullName,
        };
    },
};
