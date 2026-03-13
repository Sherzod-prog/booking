import {
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput,
    required,
    minValue,
} from "react-admin";

export const ListingCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} fullWidth />
            <TextInput
                source="description"
                validate={[required()]}
                fullWidth
                multiline
            />
            <TextInput source="location" validate={[required()]} fullWidth />
            <TextInput source="address" fullWidth />
            <NumberInput source="pricePerNight" validate={[required(), minValue(1)]} />
            <NumberInput source="guests" validate={[required(), minValue(1)]} />
            <NumberInput source="bedrooms" validate={[required(), minValue(1)]} />
            <NumberInput source="bathrooms" validate={[required(), minValue(1)]} />
            <SelectInput
                source="status"
                choices={[
                    { id: "DRAFT", name: "DRAFT" },
                    { id: "PUBLISHED", name: "PUBLISHED" },
                    { id: "ARCHIVED", name: "ARCHIVED" },
                ]}
                defaultValue="DRAFT"
            />
        </SimpleForm>
    </Create>
);
