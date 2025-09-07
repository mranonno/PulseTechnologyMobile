export interface Product {
  _id?: string;
  name: string;
  productBrand: string;
  productModel: string;
  productOrigin: string;
  description: string;
  price: number;
  quantity: number;
  image?: string | { uri: string; name?: string; type?: string };
  createdAt?: string;
}

export interface PriceListProduct {
  _id?: string;
  name: string;
  price1?: string;
  price2?: string;
  price3?: string;
  vendorName: string;
}

export interface SoldProduct {
  _id?: string;
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

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | { uri: string; name?: string; type?: string };
  role: "admin" | "user";
  createdAt: string;
}
