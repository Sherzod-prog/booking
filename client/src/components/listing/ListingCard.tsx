import { Link } from "react-router-dom";
import type { Listing } from "../../types/listing";

const BASE_URL = "http://localhost:3000";

type Props = {
    listing: Listing;
};

export default function ListingCard({ listing }: Props) {
    const imageUrl = listing.images?.[0]?.url
        ? `${BASE_URL}${listing.images[0].url}`
        : "https://via.placeholder.com/600x400?text=No+Image";

    return (
        <Link
            to={`/listings/${listing.id}`}
            className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <img
                src={imageUrl}
                alt={listing.title}
                className="h-56 w-full object-cover"
            />

            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
                        {listing.title}
                    </h3>
                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                        ${Number(listing.pricePerNight)}
                    </p>
                </div>

                <p className="mt-1 text-sm text-slate-500">{listing.location}</p>

                <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                    {listing.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                        {listing.guests} guests
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                        {listing.bedrooms} bedrooms
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                        {listing.bathrooms} bathrooms
                    </span>
                </div>
            </div>
        </Link>
    );
}