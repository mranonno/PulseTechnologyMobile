export interface Product {
  _id?: string;
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
  _id?: string;
  name: string;
  price1?: number;
  price2?: number;
  price3?: number;
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
