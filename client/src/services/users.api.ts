import { api } from "./api";

export type MeResponse = {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    role: "ADMIN" | "MANAGER" | "USER";
    createdAt: string;
    updatedAt: string;
};

export async function getMyProfile() {
    const response = await api.get<MeResponse>("/users/me/profile");
    return response.data;
}