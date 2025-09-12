import api from "./api";

const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

export interface Category {
  id: number;
  cateId: string;
  name: string;
  image: string;
  formation: number;
  isStatus: number;
  createdBy: string;
  createdAt: string;
  modifyAt: string;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  desc: string;
  image: string;
  category: string;
  price?: number; // 
  description?: string; 
}

export interface ProductList {
  id: number;
  productId: string;
  listId: string;
  name: string;
  desc: string;
  image: string;
  amount: number;
}

export interface ProductWithLists {
  product: Product;
  productLists: ProductList[];
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await api.get(`${API_BASE_URL}/categories`);
    return response.data.data as Category[];
  } catch (error) {
    console.error("获取分类列表出错:", error);
    return [];
  }
}

export async function fetchProductsByCategory(categoryId: string): Promise<ProductWithLists[]> {
  try {
    const response = await api.get(`${API_BASE_URL}/products/category/${categoryId}/with-lists`);
    return response.data.data as ProductWithLists[];
  } catch (error) {
    console.error(`获取分类 ${categoryId} 的产品列表出错:`, error);
    return [];
  }
}