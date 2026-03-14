import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "../components/ui/Container";
import ConfirmModal from "../components/ui/ConfirmModal";
import { getMyBookings, cancelMyBooking } from "../services/bookings.api";
import { createStripePayment } from "../services/payments.api";
import StatusBadge from "../components/ui/StatusBadge";
import {
    getBookingStatusVariant,
    getPaymentStatusVariant,
} from "../utils/bookingStatus";

const BASE_URL = "http://localhost:3000";

export default function MyBookingsPage() {
    const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
    const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [actionError, setActionError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["my-bookings"],
        queryFn: () => getMyBookings({ page: 1, limit: 20 }),
        refetchInterval: 5000,
    });

    const handlePayNow = async (bookingId: string) => {
        try {
            setActionError("");
            setSuccessMessage("");
            setPayingBookingId(bookingId);

            const result = await createStripePayment({
                bookingId,
                provider: "STRIPE",
            });

            if (result.checkoutUrl) {
                window.location.href = result.checkoutUrl;
                return;
            }

            throw new Error("Stripe checkout URL not found");
        } catch (err: any) {
            setActionError(
                err?.response?.data?.message || err?.message || "Payment failed"
            );
        } finally {
            setPayingBookingId(null);
        }
    };

    const openCancelModal = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        if (cancellingBookingId) return;
        setIsCancelModalOpen(false);
        setSelectedBookingId(null);
    };

    const handleConfirmCancel = async () => {
        if (!selectedBookingId) return;

        try {
            setActionError("");
            setSuccessMessage("");
            setCancellingBookingId(selectedBookingId);

            await cancelMyBooking(selectedBookingId);
            setSuccessMessage("Booking cancelled successfully.");
            setIsCancelModalOpen(false);
            setSelectedBookingId(null);
            await refetch();
        } catch (err: any) {
            setActionError(
                err?.response?.data?.message || err?.message || "Failed to cancel booking"
            );
        } finally {
            setCancellingBookingId(null);
        }
    };

    return (
        <section className="py-12">
            <Container className="h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                    <p className="mt-2 text-slate-600">
                        Manage and review your reservations.
                    </p>
                </div>

                {
                    actionError && (
                        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-600">
                            {actionError}
                        </div>
                    )
                }

                {
                    successMessage && (
                        <div className="mb-6 rounded-2xl bg-green-50 p-4 text-green-700">
                            {successMessage}
                        </div>
                    )
                }

                {
                    isLoading && (
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-36 animate-pulse rounded-2xl bg-white shadow-sm"
                                />
                            ))}
                        </div>
                    )
                }

                {
                    isError && (
                        <div className="rounded-2xl bg-red-50 p-4 text-red-600">
                            {(error as Error)?.message || "Failed to load bookings"}
                        </div>
                    )
                }

                {
                    !isLoading && !isError && data?.data?.length === 0 && (
                        <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">
                            You don’t have any bookings yet.
                        </div>
                    )
                }

                {
                    !isLoading && !isError && data?.data?.length > 0 && (
                        <div className="space-y-4">
                            {data.data.map((booking: any) => {
                                const imageUrl = booking.listing?.images?.[0]?.url
                                    ? `${BASE_URL}${booking.listing.images[0].url}`
                                    : "https://via.placeholder.com/300x220?text=No+Image";

                                const canPay =
                                    booking.paymentStatus === "UNPAID" &&
                                    booking.status !== "CANCELLED" &&
                                    booking.status !== "COMPLETED";

                                const canCancel =
                                    booking.status !== "CANCELLED" &&
                                    booking.status !== "COMPLETED";

                                const isPaying = payingBookingId === booking.id;
                                const isCancelling = cancellingBookingId === booking.id;

                                return (
                                    <div
                                        key={booking.id}
                                        className="overflow-hidden rounded-2xl bg-white shadow-sm md:flex"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={booking.listing?.title || "Listing"}
                                            className="h-52 w-full object-cover md:w-72"
                                        />

                                        <div className="flex-1 p-5">
                                            <div className="flex flex-wrap items-start justify-between gap-4">
                                                <div>
                                                    <h2 className="text-xl font-semibold text-slate-900">
                                                        {booking.listing?.title}
                                                    </h2>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {booking.listing?.location}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm text-slate-500">Total price</p>
                                                    <p className="text-lg font-bold text-slate-900">
                                                        ${Number(booking.totalPrice)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-3">
                                                <StatusBadge
                                                    label={`Status: ${booking.status}`}
                                                    variant={getBookingStatusVariant(booking.status)}
                                                />
                                                <StatusBadge
                                                    label={`Payment: ${booking.paymentStatus}`}
                                                    variant={getPaymentStatusVariant(booking.paymentStatus)}
                                                />
                                            </div>

                                            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                                <div>
                                                    <p className="font-medium text-slate-900">Check-in</p>
                                                    <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Check-out</p>
                                                    <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-wrap gap-3">
                                                {canPay && (
                                                    <button
                                                        onClick={() => handlePayNow(booking.id)}
                                                        disabled={isPaying || isCancelling}
                                                        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                                                    >
                                                        {isPaying ? "Redirecting..." : "Pay now"}
                                                    </button>
                                                )}

                                                {canCancel && (
                                                    <button
                                                        onClick={() => openCancelModal(booking.id)}
                                                        disabled={isCancelling || isPaying}
                                                        className="rounded-xl border border-red-300 px-5 py-3 text-sm font-medium text-red-600 disabled:opacity-50"
                                                    >
                                                        {isCancelling ? "Cancelling..." : "Cancel booking"}
                                                    </button>
                                                )}

                                                {booking.paymentStatus === "PAID" && (
                                                    <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                                        Payment completed
                                                    </div>
                                                )}

                                                {booking.status === "CANCELLED" && (
                                                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                                        Booking cancelled
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }

                <ConfirmModal
                    open={isCancelModalOpen}
                    title="Cancel booking?"
                    description="This booking will be cancelled. You can continue only if your cancellation policy allows it."
                    confirmText="Yes, cancel booking"
                    cancelText="Keep booking"
                    loading={!!cancellingBookingId}
                    onConfirm={handleConfirmCancel}
                    onCancel={closeCancelModal}
                />
            </Container >
        </section >
    );
}