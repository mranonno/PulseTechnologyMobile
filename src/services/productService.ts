import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAllProductsResponse, Product } from "../types/types";

const API_BASE = "http://192.168.1.21:5000";

const getAuthHeaders = async () => {
  //   const token = await AsyncStorage.getItem("authToken");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTcwNzA3NGJmNzRkZDhlOGM5YjY2ZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDkwMzExOSwiZXhwIjoxNzcwNDU1MTE5fQ.cnoDIOjdSXLGG1wZx9AUSGfrz-ZpcW1FJ951rCeQ3xM";
  if (!token) throw new Error("No authentication token found.");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAllProducts = async (): Promise<GetAllProductsResponse> => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${API_BASE}/api/products`, { headers });
  return data;
};

export const addProduct = async (product: Product): Promise<Product> => {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "multipart/form-data",
  };
  const formData = buildFormData(product);
  const { data } = await axios.post(`${API_BASE}/api/products`, formData, {
    headers,
  });
  return data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  if (!product.id) throw new Error("Product ID required for update.");
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "multipart/form-data",
  };
  const formData = buildFormData(product);
  const { data } = await axios.put(
    `${API_BASE}/api/products/${product.id}`,
    formData,
    { headers }
  );
  return data;
};

export const deleteProduct = async (id: string) => {
  const headers = await getAuthHeaders();
  await axios.delete(`${API_BASE}/api/products/${id}`, { headers });
};

// helper
const buildFormData = (product: Product) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("productModel", product.productModel);
  formData.append("productOrigin", product.productOrigin);
  formData.append("price", String(product.price));
  formData.append("quantity", String(product.quantity));
  formData.append(
    "description",
    product.description.trim() || "No description provided"
  );

  if (
    typeof product.image === "object" &&
    product.image.uri &&
    !product.image.uri.startsWith("http")
  ) {
    const localUri = product.image.uri;
    const filename =
      product.image.name || localUri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = product.image.type || `image/${match ? match[1] : "jpeg"}`;
    formData.append("image", { uri: localUri, name: filename, type } as any);
  }
  return formData;
};
