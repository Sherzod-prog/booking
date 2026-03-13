import { DataProvider, fetchUtils } from "react-admin";
import { apiUrl, httpClient } from "./httpClient";

const getListUrl = (resource: string, params: any) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: "id", order: "ASC" };

    const query: Record<string, any> = {
        page,
        limit: perPage,
        sortBy: field,
        sortOrder: order.toLowerCase(),
        ...params.filter,
    };

    const queryString = new URLSearchParams(query).toString();
    return `${apiUrl}/${resource}?${queryString}`;
};

export const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const url = getListUrl(resource, params);
        const { json } = await httpClient(url);

        return {
            data: json.data,
            total: json.meta?.total ?? json.data.length,
        };
    },

    getOne: async (resource, params) => {
        const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`);
        return { data: json };
    },

    getMany: async (resource, params) => {
        const results = await Promise.all(
            params.ids.map((id) => httpClient(`${apiUrl}/${resource}/${id}`))
        );

        return {
            data: results.map((r) => r.json),
        };
    },

    getManyReference: async (resource, params) => {
        const query = {
            page: params.pagination.page,
            limit: params.pagination.perPage,
            ...params.filter,
            [params.target]: params.id,
        };

        const queryString = new URLSearchParams(query as any).toString();
        const { json } = await httpClient(`${apiUrl}/${resource}?${queryString}`);

        return {
            data: json.data,
            total: json.meta?.total ?? json.data.length,
        };
    },

    create: async (resource, params) => {
        const { json } = await httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            headers: new Headers({ "Content-Type": "application/json" }),
        });

        return { data: json };
    },

    update: async (resource, params) => {
        const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PATCH",
            body: JSON.stringify(params.data),
            headers: new Headers({ "Content-Type": "application/json" }),
        });

        return { data: json };
    },

    updateMany: async () => {
        throw new Error("updateMany not implemented");
    },

    delete: async (resource, params) => {
        const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "DELETE",
        });

        return { data: json };
    },

    deleteMany: async () => {
        throw new Error("deleteMany not implemented");
    },
};
