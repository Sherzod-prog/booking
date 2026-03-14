import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Container from "../components/ui/Container";
import { getListingById } from "../services/listings.api";
import BookingForm from "../components/booking/BookingForm";

const BASE_URL = "http://localhost:3000";

export default function ListingDetailPage() {
    const { id } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["listing", id],
        queryFn: () => getListingById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <section className="py-12">
                <Container>
                    <div className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
                </Container>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-12">
                <Container>
                    <div className="rounded-2xl bg-red-50 p-4 text-red-600">
                        {(error as Error)?.message || "Failed to load listing"}
                    </div>
                </Container>
            </section>
        );
    }

    if (!data) {
        return (
            <section className="py-12">
                <Container>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        Listing not found.
                    </div>
                </Container>
            </section>
        );
    }

    const images = data.images?.length
        ? data.images
        : [{ id: "fallback", url: "/placeholder", filename: "No image" }];

    return (
        <section className="py-12">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
                    <div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {images.map((image, index) => {
                                const src =
                                    image.url === "/placeholder"
                                        ? "https://via.placeholder.com/800x600?text=No+Image"
                                        : `${BASE_URL}${image.url}`;

                                return (
                                    <img
                                        key={image.id ?? index}
                                        src={src}
                                        alt={data.title}
                                        className={`w-full rounded-2xl object-cover shadow-sm ${index === 0 ? "md:col-span-2 `h-[420px]`" : "h-52"
                                            }`}
                                    />
                                );
                            })}
                        </div>

                        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">
                                        {data.title}
                                    </h1>
                                    <p className="mt-2 text-slate-600">{data.location}</p>
                                    {data.address && (
                                        <p className="mt-1 text-sm text-slate-500">{data.address}</p>
                                    )}
                                </div>

                                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
                                    <p className="text-sm text-slate-500">Per night</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        ${Number(data.pricePerNight)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                                <span className="rounded-full bg-slate-100 px-3 py-2">
                                    {data.guests} guests
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-2">
                                    {data.bedrooms} bedrooms
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-2">
                                    {data.bathrooms} bathrooms
                                </span>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold">Description</h2>
                                <p className="mt-3 leading-7 text-slate-600">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <aside>
                        <div className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold">Book this listing</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Select your dates and create your booking.
                            </p>

                            <BookingForm
                                listingId={data.id}
                                pricePerNight={Number(data.pricePerNight)}
                            />

                            {data.owner && (
                                <div className="mt-8 border-t pt-6">
                                    <p className="text-sm text-slate-500">Host</p>
                                    <p className="mt-1 font-semibold text-slate-900">
                                        {data.owner.fullName}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {data.owner.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </Container>
        </section>
    );
}