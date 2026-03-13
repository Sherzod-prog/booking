import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    SelectInput,
    EditButton,
} from "react-admin";
import { getStoredRole, isAdmin } from "../../utils/permissions";

const bookingFilters = [
    <SelectInput
        key="status"
        source="status"
        label="Status"
        alwaysOn
        choices={[
            { id: "PENDING", name: "PENDING" },
            { id: "CONFIRMED", name: "CONFIRMED" },
            { id: "CANCELLED", name: "CANCELLED" },
            { id: "COMPLETED", name: "COMPLETED" },
        ]}
    />,
];

export const BookingList = () => {
    const role = getStoredRole();

    return (
        <List
            filters={bookingFilters}
            perPage={10}
            sort={{ field: "createdAt", order: "DESC" }}
        >
            <Datagrid rowClick={isAdmin(role) ? "edit" : false}>
                <TextField source="id" />
                <TextField source="user.fullName" label="User" />
                <TextField source="listing.title" label="Listing" />
                <DateField source="checkIn" />
                <DateField source="checkOut" />
                <NumberField source="totalPrice" />
                <TextField source="status" />
                <TextField source="paymentStatus" />
                {isAdmin(role) && <EditButton />}
            </Datagrid>
        </List>
    );
};
