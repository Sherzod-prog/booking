import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../ui/Container";
import { clearAuth, getUser, isAuthenticated } from "../../utils/auth";

export default function Header() {
    const navigate = useNavigate();
    const user = getUser();
    const loggedIn = isAuthenticated();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
        window.location.reload();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="border-b bg-white">
            <Container className="flex h-16 items-center justify-between">
                <Link to="/" className="text-xl font-bold text-slate-900">
                    Booking
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
                    <Link to="/">Home</Link>
                    <Link to="/listings">Listings</Link>

                    {loggedIn ? (
                        <>
                            <Link to="/my-bookings">My Bookings</Link>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setOpen((prev) => !prev)}
                                    className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2"
                                >
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                        {user?.fullName?.slice(0, 1)?.toUpperCase() || "U"}
                                    </span>
                                    <span>{user?.fullName}</span>
                                </button>

                                {open && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                                        <div className="border-b px-3 py-3">
                                            <p className="font-semibold text-slate-900">{user?.fullName}</p>
                                            <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
                                        </div>

                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setOpen(false)}
                                                className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-100"
                                            >
                                                Profile
                                            </Link>

                                            <Link
                                                to="/my-bookings"
                                                onClick={() => setOpen(false)}
                                                className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-100"
                                            >
                                                My Bookings
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </Container>
        </header>
    );
}