let isUpdated = 0;

// Function to set the update status (used after updating a product)
export const setUpdateStatus = (status: number): void => {
  isUpdated = status;
};

// Function to get the current update status
export const getUpdateStatus = (): number => {
  return isUpdated;
};

// Function to fetch products only if the update status is 1
export const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch('https://www.fioriforyou.com/backfiori/get_all_articlesback.php');
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

  // If no update, return an empty array or some default value
  return [];
};
