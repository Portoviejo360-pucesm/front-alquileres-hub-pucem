import { api } from "@/lib/api/client";

export const uploadApi = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await api<{ data: { url: string, filename: string } }>('/uploads/image', {
            method: 'POST',
            body: formData
        });

        return response.data;
    }
};
