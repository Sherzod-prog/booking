type Props = {
    eyebrow?: string;
    title: string;
    description?: string;
};

export default function SectionHeading({
    eyebrow,
    title,
    description,
}: Props) {
    return (
        <div className="mb-8">
            {eyebrow && (
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
                    {eyebrow}
                </p>
            )}
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {title}
            </h2>
            {description && (
                <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
            )}
        </div>
    );
}