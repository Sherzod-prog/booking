type Props = {
    search: string;
    location: string;
    onSearchChange: (value: string) => void;
    onLocationChange: (value: string) => void;
};

export default function ListingFilters({
    search,
    location,
    onSearchChange,
    onLocationChange,
}: Props) {
    return (
        <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2">
            <input
                type="text"
                placeholder="Search listings..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
            />

            <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-400"
            />
        </div>
    );
}