import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    SelectInput,
    TextInput,
    ShowButton,
} from "react-admin";

const paymentFilters = [
    <SelectInput
        key="status"
        source="status"
        label="Status"
        alwaysOn
        choices={[
            { id: "UNPAID", name: "UNPAID" },
            { id: "PAID", name: "PAID" },
            { id: "REFUNDED", name: "REFUNDED" },
            { id: "FAILED", name: "FAILED" },
        ]}
    />,
    <SelectInput
        key="provider"
        source="provider"
        label="Provider"
        choices={[
            { id: "STRIPE", name: "STRIPE" },
            { id: "CLICK", name: "CLICK" },
            { id: "PAYME", name: "PAYME" },
            { id: "CASH", name: "CASH" },
        ]}
    />,
    <TextInput key="bookingId" source="bookingId" label="Booking ID" />,
    <TextInput key="userId" source="userId" label="User ID" />,
];

export const PaymentList = () => (
    <List
        filters={paymentFilters}
        perPage={10}
        sort={{ field: "createdAt", order: "DESC" }}
    >
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="booking.user.fullName" label="User" />
            <TextField source="booking.listing.title" label="Listing" />
            <TextField source="provider" />
            <NumberField source="amount" />
            <TextField source="currency" />
            <TextField source="status" />
            <TextField source="transactionId" />
            <DateField source="paidAt" showTime />
            <DateField source="createdAt" showTime />
            <ShowButton />
        </Datagrid>
    </List>
);