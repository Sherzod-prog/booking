import { api } from "./api";

export type CreatePaymentPayload = {
    bookingId: string;
    provider: "STRIPE";
};

export type CreatePaymentResponse = {
    message: string;
    checkoutUrl: string;
    sessionId: string;
    paymentId: string;
};

export async function createStripePayment(payload: CreatePaymentPayload) {
    const response = await api.post<CreatePaymentResponse>("/payments", payload);
    return response.data;
}