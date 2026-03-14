import { useQuery } from "@tanstack/react-query";
import Container from "../components/ui/Container";
import { getMyProfile } from "../services/users.api";

export default function ProfilePage() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["my-profile"],
        queryFn: getMyProfile,
    });

    return (
        <section className="py-12">
            <Container className="max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="mt-2 text-slate-600">
                        View your personal account information.
                    </p>
                </div>

                {isLoading && (
                    <div className="h-64 animate-pulse rounded-3xl bg-white shadow-sm" />
                )}

                {isError && (
                    <div className="rounded-2xl bg-red-50 p-4 text-red-600">
                        {(error as Error)?.message || "Failed to load profile"}
                    </div>
                )}

                {data && (
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4 border-b pb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
                                {data.fullName.slice(0, 1).toUpperCase()}
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    {data.fullName}
                                </h2>
                                <p className="mt-1 text-slate-600">{data.email}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Role</p>
                                <p className="mt-1 font-semibold text-slate-900">{data.role}</p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Phone</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {data.phone || "Not provided"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Created At</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {new Date(data.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Last Updated</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {new Date(data.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </section>
    );
}