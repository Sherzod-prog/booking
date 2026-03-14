type Variant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info";

type Props = {
    label: string;
    variant?: Variant;
};

const styles: Record<Variant, string> = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-sky-100 text-sky-700",
};

export default function StatusBadge({
    label,
    variant = "default",
}: Props) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-2 text-sm font-medium ${styles[variant]}`}
        >
            {label}
        </span>
    );
}