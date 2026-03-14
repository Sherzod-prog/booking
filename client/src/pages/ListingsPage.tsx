import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "../components/ui/Container";
import ListingCard from "../components/listing/ListingCard";
import ListingFilters from "../components/listing/ListingFilters";
import { getListings } from "../services/listings.api";

export default function ListingsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");

    const queryParams = useMemo(
        () => ({
            page,
            limit: 9,
            search: search || undefined,
            location: location || undefined,
            status: "PUBLISHED",
        }),
        [page, search, location]
    );

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["listings", queryParams],
        queryFn: () => getListings(queryParams),
    });

    return (
        <section className="py-12">
            <Container className="h-screen">
                <div className="mb-8 ">
                    <h1 className="text-3xl font-bold">Listings</h1>
                    <p className="mt-2 text-slate-600">
                        Find available places and choose the best option for your stay.
                    </p>
                </div>

                <ListingFilters
                    search={search}
                    location={location}
                    onSearchChange={(value) => {
                        setPage(1);
                        setSearch(value);
                    }}
                    onLocationChange={(value) => {
                        setPage(1);
                        setLocation(value);
                    }}
                />

                {isLoading && (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-80 animate-pulse rounded-2xl bg-white shadow-sm"
                            />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="mt-8 rounded-2xl bg-red-50 p-4 text-red-600">
                        {(error as Error)?.message || "Failed to load listings"}
                    </div>
                )}

                {!isLoading && !isError && data?.data?.length === 0 && (
                    <div className="mt-8 rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">
                        No listings found.
                    </div>
                )}

                {!isLoading && !isError && data?.data?.length ? (
                    <>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {data.data.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-3">
                            <button
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-slate-600">
                                Page {data.meta.page} of {Math.max(1, data.meta.totalPages)}
                            </span>

                            <button
                                onClick={() => setPage((prev) => prev + 1)}
                                disabled={page >= data.meta.totalPages}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : null}
            </Container>
        </section>
    );
}