import {
    Show,
    SimpleShowLayout,
    TextField,
    NumberField,
    DateField,
} from "react-admin";

export const PaymentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="provider" />
            <TextField source="status" />
            <NumberField source="amount" />
            <TextField source="currency" />
            <TextField source="transactionId" />
            <TextField source="providerRef" />
            <DateField source="paidAt" showTime />
            <DateField source="createdAt" showTime />
            <DateField source="updatedAt" showTime />

            <TextField source="booking.id" label="Booking ID" />
            <TextField source="booking.status" label="Booking Status" />
            <TextField source="booking.paymentStatus" label="Booking Payment Status" />

            <TextField source="booking.user.fullName" label="User" />
            <TextField source="booking.user.email" label="User Email" />

            <TextField source="booking.listing.title" label="Listing" />
            <TextField source="booking.listing.location" label="Location" />
        </SimpleShowLayout>
    </Show>
);