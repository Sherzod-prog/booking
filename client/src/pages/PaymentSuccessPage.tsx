import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "../components/ui/Container";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get("session_id");
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const countdown = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    navigate("/my-bookings");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [navigate]);

    return (
        <section className="py-12">
            <Container className="max-w-xl">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-green-600">
                        Payment successful
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Your payment was completed successfully. Your booking status is being
                        updated automatically.
                    </p>

                    {sessionId && (
                        <p className="mt-3 text-xs text-slate-500">
                            Session ID: {sessionId}
                        </p>
                    )}

                    <p className="mt-4 text-sm text-slate-600">
                        Redirecting to My Bookings in {seconds} second{seconds !== 1 ? "s" : ""}...
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Link
                            to="/my-bookings"
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                        >
                            Go now
                        </Link>

                        <Link
                            to="/listings"
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-900"
                        >
                            Browse listings
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}