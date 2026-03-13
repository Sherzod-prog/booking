import {
    List,
    Datagrid,
    TextField,
    NumberField,
    EditButton,
    TextInput,
    SelectInput,
} from "react-admin";

const listingFilters = [
    <TextInput key="search" source = "search" label = "Search" alwaysOn />,
    <TextInput key="location" source = "location" label = "Location" />,
    <SelectInput
    key="status"
    source = "status"
    label = "Status"
    choices = {
        [
        { id: "DRAFT", name: "DRAFT" },
        { id: "PUBLISHED", name: "PUBLISHED" },
        { id: "ARCHIVED", name: "ARCHIVED" },
    ]}
    />,
];

export const ListingList = () => (
    <List
    filters= { listingFilters }
perPage = { 10}
sort = {{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="edit" >
        <TextField source="id" />
            <TextField source="title" />
                <TextField source="location" />
                    <NumberField source="pricePerNight" />
                        <TextField source="guests" />
                            <TextField source="bedrooms" />
                                <TextField source="bathrooms" />
                                    <TextField source="status" />
                                        <EditButton />
                                        </Datagrid>
                                        </List>
);
