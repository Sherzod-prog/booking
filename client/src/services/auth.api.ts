import { api } from "./api";

export type RegisterPayload = {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type AuthResponse = {
    message: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        role: "ADMIN" | "MANAGER" | "USER";
    };
    accessToken: string;
};

export async function registerUser(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
}

export async function loginUser(payload: LoginPayload) {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
}