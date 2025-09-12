import api from "./api";

const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

export interface ProductOption {
  id: number;
  optionId: string;
  productId: string;
  listId: string;
  name: string;
  cost: number;
  amount: number;
  kg?: number;
  createdAt: string;
}

export interface SizeOption {
  id: string;
  name: string;
  volume?: string;
  price: number;
}

export interface IceLevel {
  id: string;
  name: string;
}

export interface SugarLevel {
  id: string;
  name: string;
}

export interface ProductOptionsResponse {
  sizes: SizeOption[];
  iceLevels: IceLevel[];
  sugarLevels: SugarLevel[];
}

export async function fetchProductOptions(
  productId: string
): Promise<ProductOptionsResponse> {
  try {
    const response = await api.get(`${API_BASE_URL}/product-options/product/${productId}`);
    const options: ProductOption[] = response.data.data;
    
    // 根据选项名称分类
    const sizes: SizeOption[] = [];
    const iceLevels: IceLevel[] = [];
    const sugarLevels: SugarLevel[] = [];

    options.forEach(option => {
      // 根据选项名称判断类型
      if (option.name.includes('尺寸') || option.name.includes('大小') || option.name.includes('ml')) {
        sizes.push({
          id: option.optionId,
          name: option.name,
          price: option.amount
        });
      } else if (option.name.includes('冰') || option.name.toLowerCase().includes('ice')) {
        iceLevels.push({
          id: option.optionId,
          name: option.name
        });
      } else if (option.name.includes('糖') || option.name.toLowerCase().includes('sugar')) {
        sugarLevels.push({
          id: option.optionId,
          name: option.name
        });
      }
    });

    // 如果没有选项，返回空数组
    return {
      sizes: sizes.length > 0 ? sizes : [],
      iceLevels: iceLevels.length > 0 ? iceLevels : [],
      sugarLevels: sugarLevels.length > 0 ? sugarLevels : []
    };

  } catch (error) {
    console.error("获取产品选项出错:", error);
    
    // 返回空选项表示无法加糖等
    return {
      sizes: [],
      iceLevels: [],
      sugarLevels: []
    };
  }
}