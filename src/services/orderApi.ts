// features/order/apiOrder.ts
import axios from "axios";

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
    const response = await axios.get(`${API_BASE_URL}/product-options/product/${productId}`);
    const options: ProductOption[] = response.data.data;
    
    // 添加调试输出
    console.log("API返回的所有选项:", options);
    console.log("选项名称列表:", options.map(opt => opt.name));
    
    // 根据选项名称分类
    const sizes: SizeOption[] = [];
    const iceLevels: IceLevel[] = [];
    const sugarLevels: SugarLevel[] = [];

    options.forEach(option => {
      const lowerName = option.name.toLowerCase();
      
      // 更宽松的分类条件
      if (lowerName.includes('size') || lowerName.includes('ml') || lowerName.includes('容量') ||
          lowerName.includes('oz') || lowerName.includes('升') ||
          lowerName.includes('杯') || lowerName.includes('大') ||
          lowerName.includes('小') || lowerName.includes('中')) {
        sizes.push({
          id: option.optionId,
          name: option.name,
          price: option.amount
        });
      } else if (lowerName.includes('冰') || lowerName.includes('ice') || lowerName.includes('ais') ||
                lowerName.includes('冷') || lowerName.includes('hot') ||
                lowerName.includes('热') || lowerName.includes('温度')) {
        iceLevels.push({
          id: option.optionId,
          name: option.name
        });
      } else if (lowerName.includes('糖') || lowerName.includes('sugar') ||
                lowerName.includes('甜') || lowerName.includes('甜度')) {
        sugarLevels.push({
          id: option.optionId,
          name: option.name
        });
      } else {
        // 未知类型的选项，也输出到控制台
        console.log("未分类的选项:", option.name);
      }
    });

    // 调试输出分类结果
    console.log("分类结果 - 尺寸:", sizes);
    console.log("分类结果 - 冰量:", iceLevels);
    console.log("分类结果 - 甜度:", sugarLevels);

    return {
      sizes,
      iceLevels,
      sugarLevels
    };

  } catch (error) {
    console.error("获取产品选项出错:", error);
    
    return {
      sizes: [],
      iceLevels: [],
      sugarLevels: []
    };
  }
}