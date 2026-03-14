import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

export default function PaymentCancelPage() {
    return (
        <section className="py-12">
            <Container className="max-w-xl">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-red-600">
                        Payment cancelled
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Payment was cancelled. You can return to your bookings and try again.
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Link
                            to="/my-bookings"
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                        >
                            Back to My Bookings
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