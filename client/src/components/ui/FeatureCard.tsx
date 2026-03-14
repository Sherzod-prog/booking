import type { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    title: string;
    description: string;
};

export default function FeatureCard({ icon, title, description }: Props) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    );
}