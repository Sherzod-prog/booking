import type { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    value: string;
    label: string;
};

export default function StatCard({ icon, value, label }: Props) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                {icon}
            </div>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{label}</p>
        </div>
    );
}