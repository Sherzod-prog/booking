type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

export function getBookingStatusVariant(status: string): BadgeVariant {
    switch (status) {
        case "PENDING":
            return "warning";
        case "CONFIRMED":
            return "success";
        case "CANCELLED":
            return "danger";
        case "COMPLETED":
            return "info";
        default:
            return "default";
    }
}

export function getPaymentStatusVariant(status: string): BadgeVariant {
    switch (status) {
        case "UNPAID":
            return "warning";
        case "PAID":
            return "success";
        case "REFUNDED":
            return "info";
        case "FAILED":
            return "danger";
        default:
            return "default";
    }
}