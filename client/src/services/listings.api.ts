import { api } from "./api";
import type { Listing, ListingsResponse } from "../types/listing";

export type GetListingsParams = {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    status?: string;
};

export async function getListings(
    params: GetListingsParams = {}
): Promise<ListingsResponse> {
    const response = await api.get<ListingsResponse>("/listings", {
        params,
    });

    return response.data;
}

export async function getListingById(id: string): Promise<Listing> {
    const response = await api.get<Listing>(`/listings/${id}`);
    return response.data;
}