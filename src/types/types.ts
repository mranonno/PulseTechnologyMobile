// types.ts
export interface Product {
  id?: string;
  name: string;
  productModel: string;
  productOrigin: string;
  description: string;
  price: number;
  quantity: number;
  image?: string | { uri: string; name?: string; type?: string };
  createdAt?: string;
}
export interface PriceListProduct {
  id: string; // Unique identifier for the product
  name: string; // Product name
  price1?: number; // Optional first price
  price2?: number; // Optional second price
  price3?: number; // Optional third price
  vendorName: string; // Vendor name (required)
}

export interface SoldProduct {
  id?: string;
  name: string;
  productModel: string;
  price: number;
  quantity: number;
  image?: string | { uri: string; name?: string; type?: string };
  createdAt?: string;
}
export interface GetAllProductsResponse {
  message: string;
  products: Product[];
  total: number;
}
