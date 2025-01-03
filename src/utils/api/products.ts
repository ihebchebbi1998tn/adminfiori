import { Product } from '../../types/products';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://respizenmedical.com/fiori/get_all_articles.php');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    } else if (data.status === 'success' && Array.isArray(data.products)) {
      return data.products;
    }
    throw new Error('Invalid data format received from server');
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};