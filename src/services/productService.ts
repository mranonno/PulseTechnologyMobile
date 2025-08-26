import axios from "axios";
import {
  GetAllProductsResponse,
  PriceListProduct,
  Product,
} from "../types/types";

const API_BASE = "https://pulse-technology-server.vercel.app";
console.log(API_BASE);

const buildPriceListFormData = (product: PriceListProduct) => {
  const formData = new FormData();
  formData.append("name", product.name);
  if (product.price1 !== undefined)
    formData.append("price1", String(product.price1));
  if (product.price2 !== undefined)
    formData.append("price2", String(product.price2));
  if (product.price3 !== undefined)
    formData.append("price3", String(product.price3));
  if (product.vendorName) formData.append("vendorName", product.vendorName);
  return formData;
};

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
  console.log(formData);
  const { data } = await axios.post(`${API_BASE}/api/products`, formData, {
    headers,
  });
  return data;
};

export const addPriceListProduct = async (product: PriceListProduct) => {
  const headers = { ...(await getAuthHeaders()) };
  const formData = buildPriceListFormData(product);
  const { data } = await axios.post(
    `${API_BASE}/api/price-list-products`,
    formData,
    {
      headers,
    }
  );
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
export const updatePriceListProduct = async (product: PriceListProduct) => {
  if (!product.id) throw new Error("Product ID required for update.");
  const headers = { ...(await getAuthHeaders()) };
  const formData = buildPriceListFormData(product);
  const { data } = await axios.put(
    `${API_BASE}/api/price-list-products/${product.id}`,
    formData,
    { headers }
  );
  return data;
};

export const deleteProduct = async (id: string) => {
  const headers = await getAuthHeaders();
  await axios.delete(`${API_BASE}/api/products/${id}`, { headers });
};
const buildFormData = (product: Product) => {
  const formData = new FormData();

  // Required field
  formData.append("name", product.name);

  // Optional fields
  if (product.productModel)
    formData.append("productModel", product.productModel);
  if (product.productOrigin)
    formData.append("productOrigin", product.productOrigin);
  if (product.price !== undefined && product.price !== null)
    formData.append("price", String(product.price));
  if (product.quantity !== undefined && product.quantity !== null)
    formData.append("quantity", String(product.quantity));
  if (product.description?.trim())
    formData.append("description", product.description.trim());

  // Optional image
  if (
    product.image &&
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
