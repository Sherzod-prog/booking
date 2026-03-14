import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotify, useRecordContext, useRefresh } from "react-admin";

const BASE_URL = "http://localhost:3000";

export const ListingImagesGallery = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleDelete = async (imageId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            notify("Token topilmadi", { type: "error" });
            return;
        }

        try {
            const response = await fetch(
                `${BASE_URL}/api/uploads/images/${imageId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorJson = await response.json().catch(() => null);
                throw new Error(errorJson?.message || "Image delete failed");
            }

            notify("Rasm o‘chirildi", { type: "success" });
            refresh();
        } catch (error: any) {
            notify(error.message || "Delete xatoligi", { type: "error" });
        }
    };

    const images = record?.images ?? [];

    if (!images.length) {
        return <Typography variant="body2">Hozircha rasm yo‘q.</Typography>;
    }

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 2, mt: 2 }}>
            {images.map((image: any) => (
                <Card key={image.id}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`${BASE_URL}${image.url}`}
                        alt={image.filename || "listing image"}
                    />
                    <CardContent
                        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}
                    >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                            {image.filename || "image"}
                        </Typography>
                        <IconButton color="error" onClick={() => handleDelete(image.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};