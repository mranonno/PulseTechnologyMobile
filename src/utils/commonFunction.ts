import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const saveToStorage = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
};

export const saveObject = async (key: string, obj: object): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(obj));
    console.log("Object saved successfully!");
  } catch (error) {
    console.error("Error saving object", error);
  }
};

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from storage:", error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    router.dismissAll();
    router.replace("/signin");
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

export const getFromStorage = async (key: string): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error getting from storage:", error);
    return null;
  }
};

interface Item {
  quantity: number;
  price: number;
}

export const calculateTotalStockValue = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
};

export const validateInput = (
  data: Record<string, string>,
  requiredFields: string[]
) => {
  const errors: Record<string, string> = {};
  requiredFields.forEach((field) => {
    if (!data[field] || data[field].trim() === "") {
      errors[field] = `${field} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const uploadImageToCloudinary = async (
  uri: string,
  setIsUploading: (uploading: boolean) => void,
  setUploadedImageUrl: (url: string) => void
): Promise<string | null> => {
  if (!uri) {
    alert("Please select or capture an image first!");
    return null;
  }
  try {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any);
    formData.append("upload_preset", `pulse_tech_preset`);
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dbzdkcxdh/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    setUploadedImageUrl(response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Image upload failed. Please try again.");
    return null;
  } finally {
    setIsUploading(false);
  }
};

export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    const response = await fetch("YOUR_SERVER_ENDPOINT_TO_DELETE_IMAGE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });
    const result = await response.json();
    console.log("Delete response: ", result);
  } catch (error) {
    console.error("Error deleting image: ", error);
  }
};

export const uploadImageInDigitalOcean = async (
  asset: {
    uri: string;
    fileName?: string;
    mimeType?: string;
    type?: string;
  },
  setIsUploading: (uploading: boolean) => void,
  setUploadedImageUrl: (url: string) => void
): Promise<void> => {
  setIsUploading(true);
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName || "uploaded_image",
      type: asset.mimeType || asset.type || "image/jpeg",
    } as any);

    const url = "https://api.bootcampshub.ai/api/document/useranydocument";
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      setUploadedImageUrl(response.data.fileUrl);
    } else {
      setUploadedImageUrl("");
    }
  } catch (error) {
    console.log("error to upload image", JSON.stringify(error, null, 2));
  } finally {
    setIsUploading(false);
  }
};
