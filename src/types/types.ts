// types.ts
export interface Product {
  id?: string;
  name: string;
  model: string;
  description: string;
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
