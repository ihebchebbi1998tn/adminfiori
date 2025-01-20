let isUpdated = 0;

export const setUpdateStatus = (status: number): void => {
  isUpdated = status;
};

export const getUpdateStatus = (): number => {
  return isUpdated;
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `https://www.fioriforyou.com/backfiori/get_all_articlesback.php`,
      {
        headers: {
          'Expires': '0'
        },
        // Force cache refresh
        cache: 'no-store'
      }
    );

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
