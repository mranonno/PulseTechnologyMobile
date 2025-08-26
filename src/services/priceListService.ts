import axios from "axios";
import { PriceListProduct } from "../types/types";

const API_BASE = "https://pulse-technology-server.vercel.app";

const getAuthHeaders = async () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTcwNzA3NGJmNzRkZDhlOGM5YjY2ZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDkwMzExOSwiZXhwIjoxNzcwNDU1MTE5fQ.cnoDIOjdSXLGG1wZx9AUSGfrz-ZpcW1FJ951rCeQ3xM";
  if (!token) throw new Error("No authentication token found.");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Get all price list products
export const getAllPriceListProducts = async (): Promise<
  PriceListProduct[]
> => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${API_BASE}/api/price-list`, { headers });
  return data.products || data;
};

// ✅ Add price list product
export const addPriceListProduct = async (product: PriceListProduct) => {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
  };
  const { data } = await axios.post(`${API_BASE}/api/price-list`, product, {
    headers,
  });
  return data;
};

// ✅ Update price list product
export const updatePriceListProduct = async (product: PriceListProduct) => {
  if (!product._id) throw new Error("Product ID required for update.");
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
  };
  const { data } = await axios.put(
    `${API_BASE}/api/price-list/${product._id}`,
    product,
    { headers }
  );
  return data;
};

// ✅ Delete price list product
export const deletePriceListProduct = async (id: string) => {
  const headers = await getAuthHeaders();
  await axios.delete(`${API_BASE}/api/price-list/${id}`, { headers });
};
