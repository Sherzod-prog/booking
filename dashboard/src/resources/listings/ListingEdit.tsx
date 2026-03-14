import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput,
    required,
    minValue,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import { ListingImageUpload } from "./ListingImageUpload";
import { ListingImagesGallery } from "./ListingImagesGallery";

export const ListingEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled fullWidth />
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
            />

            <Box sx={{ width: "100%", mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Listing rasmlari
                </Typography>
                <ListingImageUpload />
                <ListingImagesGallery />
            </Box>
        </SimpleForm>
    </Edit>
);