import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../services/bookings.api";
import { isAuthenticated } from "../../utils/auth";

type Props = {
    listingId: string;
    pricePerNight: number;
};

function calculateNights(checkIn: string, checkOut: string) {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function BookingForm({ listingId, pricePerNight }: Props) {
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = nights > 0 ? nights * pricePerNight : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            navigate("/login");
            return;
        }

        if (!checkIn || !checkOut) {
            setError("Please select check-in and check-out dates.");
            return;
        }

        if (nights < 1) {
            setError("Check-out must be after check-in.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await createBooking({
                listingId,
                checkIn: new Date(checkIn).toISOString(),
                checkOut: new Date(checkOut).toISOString(),
            });

            setSuccess("Booking created successfully.");
            setTimeout(() => {
                navigate("/my-bookings");
            }, 700);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
                    {success}
                </div>
            )}

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Check-in
                </label>
                <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Check-out
                </label>
                <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                    <span>Price per night</span>
                    <span>${pricePerNight}</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span>Nights</span>
                    <span>{nights}</span>
                </div>

                <div className="mt-3 border-t pt-3 text-base font-semibold text-slate-900">
                    <div className="flex items-center justify-between">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
                {loading ? "Creating booking..." : "Reserve now"}
            </button>
        </form>
    );
}