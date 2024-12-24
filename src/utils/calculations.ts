export const calculateTotalRevenue = (products: any[]): number => {
  return products.reduce((total, product) => {
    const price = parseFloat(product.price_product) || 0;
    const quantity = parseInt(product.qnty_product) || 0;
    return total + (price * quantity);
  }, 0);
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};