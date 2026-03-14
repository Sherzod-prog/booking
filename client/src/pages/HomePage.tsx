import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    Building2,
    ShieldCheck,
    CreditCard,
    MapPinned,
} from "lucide-react";

import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";
import StatCard from "../components/ui/StatCard";
import FeatureCard from "../components/ui/FeatureCard";
import ListingCard from "../components/listing/ListingCard";
import { getListings } from "../services/listings.api";

export default function HomePage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["home-featured-listings"],
        queryFn: () =>
            getListings({
                page: 1,
                limit: 6,
                status: "PUBLISHED",
            }),
    });

    const featuredListings = data?.data ?? [];

    return (
        <div className="pb-16">
            <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_20%)]" />

                <Container className="relative">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <p className="mb-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
                                Modern booking platform
                            </p>

                            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                                Find your next stay with comfort, speed, and secure payment
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                                Explore curated listings, check availability, reserve instantly,
                                and complete payment securely through Stripe.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/listings"
                                    className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                                >
                                    Browse listings
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Create account
                                </Link>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-2xl font-bold">100+</p>
                                    <p className="mt-1 text-sm text-slate-300">Happy guests</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-2xl font-bold">24/7</p>
                                    <p className="mt-1 text-sm text-slate-300">Support</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-2xl font-bold">Fast</p>
                                    <p className="mt-1 text-sm text-slate-300">Booking flow</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-4xl bg-white p-4 text-slate-900 shadow-2xl sm:translate-y-8">
                                <img
                                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
                                    alt="Apartment"
                                    className="h-64 w-full rounded-3xl object-cover"
                                />
                                <div className="p-2 pt-4">
                                    <p className="text-lg font-semibold">Premium apartments</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Handpicked stays in the best locations
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-4xl bg-white p-4 text-slate-900 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
                                    alt="Room"
                                    className="h-64 w-full rounded-3xl object-cover"
                                />
                                <div className="p-2 pt-4">
                                    <p className="text-lg font-semibold">Secure checkout</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Smooth payments and protected reservations
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="-mt-8 relative z-10">
                <Container>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            icon={<Building2 className="h-5 w-5" />}
                            value="50+"
                            label="Available listings"
                        />
                        <StatCard
                            icon={<MapPinned className="h-5 w-5" />}
                            value="10+"
                            label="Popular destinations"
                        />
                        <StatCard
                            icon={<ShieldCheck className="h-5 w-5" />}
                            value="100%"
                            label="Secure reservations"
                        />
                        <StatCard
                            icon={<CreditCard className="h-5 w-5" />}
                            value="Stripe"
                            label="Fast payment gateway"
                        />
                    </div>
                </Container>
            </section>

            <section className="pt-20">
                <Container>
                    <SectionHeading
                        eyebrow="Featured"
                        title="Popular stays you can book today"
                        description="Explore a selection of recently published listings from our platform."
                    />

                    {isLoading && (
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-80 animate-pulse rounded-2xl bg-white shadow-sm"
                                />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="rounded-2xl bg-red-50 p-4 text-red-600">
                            Failed to load featured listings.
                        </div>
                    )}

                    {!isLoading && !isError && featuredListings.length > 0 && (
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {featuredListings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !isError && featuredListings.length === 0 && (
                        <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">
                            No featured listings available right now.
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            to="/listings"
                            className="inline-flex rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                            View all listings
                        </Link>
                    </div>
                </Container>
            </section>

            <section className="pt-20">
                <Container>
                    <SectionHeading
                        eyebrow="Why choose us"
                        title="Everything you need for a smooth booking experience"
                        description="Built for speed, simplicity, and trust from search to payment."
                    />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <FeatureCard
                            icon={<MapPinned className="h-5 w-5" />}
                            title="Great locations"
                            description="Browse listings in attractive and convenient destinations."
                        />
                        <FeatureCard
                            icon={<Building2 className="h-5 w-5" />}
                            title="Verified stays"
                            description="Clear details, room information, and image galleries in one place."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-5 w-5" />}
                            title="Safe booking flow"
                            description="Protected authentication and reservation management for users."
                        />
                        <FeatureCard
                            icon={<CreditCard className="h-5 w-5" />}
                            title="Secure payment"
                            description="Complete reservations with Stripe checkout in a fast, modern flow."
                        />
                    </div>
                </Container>
            </section>

            <section className="pt-20">
                <Container>
                    <div className="rounded-4xl bg-slate-900 px-8 py-12 text-white">
                        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
                                    Ready to book?
                                </p>
                                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                    Start exploring listings and reserve your next stay today
                                </h2>
                                <p className="mt-4 max-w-2xl text-slate-300">
                                    Sign up, choose your dates, create a booking, and pay securely
                                    in just a few steps.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 lg:justify-end">
                                <Link
                                    to="/listings"
                                    className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                                >
                                    Explore listings
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Create account
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}