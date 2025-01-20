export const NO_SIZE_PRODUCTS = [
    'cravates',
    'portefeuilles',
    'porte-cles',
    'porte-cartes',
    'mallettes'
  ];
  
  export const needsSizeSelection = (itemGroup: string): boolean => {
    return !NO_SIZE_PRODUCTS.includes(itemGroup);
  };
  
  export const getDefaultSize = (itemGroup: string): string => {
    return needsSizeSelection(itemGroup) ? '' : 'unique';
  };