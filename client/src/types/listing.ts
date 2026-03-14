export type ListingImage = {
    id: string;
    url: string;
    filename?: string | null;
    mimetype?: string | null;
    size?: number | null;
    createdAt?: string;
};

export type ListingOwner = {
    id: string;
    fullName: string;
    email: string;
};

export type Listing = {
    id: string;
    title: string;
    description: string;
    location: string;
    address?: string | null;
    pricePerNight: number | string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdAt: string;
    updatedAt: string;
    ownerId?: string;
    owner?: ListingOwner;
    images: ListingImage[];
};

export type ListingsResponse = {
    data: Listing[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};