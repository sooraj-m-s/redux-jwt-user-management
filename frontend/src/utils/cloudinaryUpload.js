import axios from 'axios';
import { toast } from 'react-toastify';


const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

    if (!file) {
        toast.error('No file selected for upload');
        return null;
    }
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', uploadPreset);
    uploadData.append('cloud_name', cloudName);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            uploadData
    );
    return response.data.secure_url;
    } catch (err) {
        const errorMessage =
            err.response?.data?.error?.message || 'Image upload failed';
        toast.error(errorMessage);
        console.error('Image upload failed:', err);
        return null;
    }
};

export default uploadImageToCloudinary;
