import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import { registerUser } from "../services/auth.api";
import { setAuth } from "../utils/auth";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const data = await registerUser({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                phone: form.phone || undefined,
            });

            setAuth(data.accessToken, data.user);
            navigate("/");
            window.location.reload();
        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-12">
            <Container className="max-w-md">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold">Register</h1>
                    <p className="mt-2 text-slate-600">
                        Create a new account.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Full name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-slate-900">
                            Login
                        </Link>
                    </p>
                </div>
            </Container>
        </section>
    );
}