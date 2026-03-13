import {
    Edit,
    SimpleForm,
    TextField,
    DateInput,
    NumberInput,
    SelectInput,
} from "react-admin";

export const BookingEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" />
            <TextField source="user.fullName" label="User" />
            <TextField source="listing.title" label="Listing" />
            <DateInput source="checkIn" />
            <DateInput source="checkOut" />
            <NumberInput source="totalPrice" />
            <SelectInput
                source="status"
                choices={[
                    { id: "PENDING", name: "PENDING" },
                    { id: "CONFIRMED", name: "CONFIRMED" },
                    { id: "CANCELLED", name: "CANCELLED" },
                    { id: "COMPLETED", name: "COMPLETED" },
                ]}
            />
            <SelectInput
                source="paymentStatus"
                choices={[
                    { id: "UNPAID", name: "UNPAID" },
                    { id: "PAID", name: "PAID" },
                    { id: "REFUNDED", name: "REFUNDED" },
                ]}
            />
        </SimpleForm>
    </Edit>
);
