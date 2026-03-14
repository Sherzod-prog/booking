import { useState } from "react";
import { useNotify, useRecordContext, useRefresh } from "react-admin";
import { Box, Button, Typography } from "@mui/material";

const API_URL = "http://localhost:3000/api";

export const ListingImageUpload = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !record?.id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      notify("Token topilmadi", { type: "error" });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/uploads/listings/${record.id}/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        throw new Error(errorJson?.message || "Image upload failed");
      }

      notify("Rasm muvaffaqiyatli yuklandi", { type: "success" });
      refresh();
    } catch (error: any) {
      notify(error.message || "Upload xatoligi", { type: "error" });
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  if (!record?.id) {
    return (
      <Typography variant="body2">
        Avval listingni saqlang, keyin rasm yuklaysiz.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" component="label" disabled={loading}>
        {loading ? "Yuklanmoqda..." : "Rasm yuklash"}
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
};