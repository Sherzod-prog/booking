import { api } from "./api";

export type CreateBookingPayload = {
    listingId: string;
    checkIn: string;
    checkOut: string;
};

export type BookingResponse = {
    id: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number | string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    paymentStatus: "UNPAID" | "PAID" | "REFUNDED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    listingId: string;
    userId: string;
};

export async function createBooking(payload: CreateBookingPayload) {
    const response = await api.post<BookingResponse>("/bookings", payload);
    return response.data;
}

export async function getMyBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
}) {
    const response = await api.get("/bookings/my", { params });
    return response.data;
}

export async function cancelMyBooking(bookingId: string) {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
}