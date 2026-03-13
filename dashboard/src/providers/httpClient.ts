import { fetchUtils } from "react-admin";

const apiUrl = "http://localhost:3000/api";

export const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const token = localStorage.getItem("token");

    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }

    const headers = options.headers as Headers;

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

export { apiUrl };
