import React from 'react';
import { Package } from 'lucide-react';

interface Product {
  id_product: string;
  nom_product: string;
  price_product: string;
  qnty_product: string;
  img_product: string;
  status_product: string;
}

const RecentProducts: React.FC<{ products: Product[] }> = ({ products }) => {
  const getImageUrl = (imagePath: string) => {
    return imagePath.startsWith('http') 
      ? imagePath 
      : `https://www.fioriforyou.com/backfiori/${imagePath}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-[#5a0c1a]/20">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-[#5a0c1a]" />
        <h3 className="text-lg font-semibold">Recent Products</h3>
      </div>

      <div className="space-y-4">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No products available</p>
        ) : (
          products.map((product) => (
            <div 
              key={product.id_product}
              className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ease-in-out"
            >
              <img
                src={getImageUrl(product.img_product)}
                alt={product.nom_product}
                className="w-16 h-16 rounded-lg object-cover border border-[#5a0c1a] shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{product.nom_product}</h4>
                <p className="text-xs text-gray-600">
                  Stock: {product.qnty_product} units
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {parseFloat(product.price_product).toLocaleString()} TND
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.status_product === 'En stock' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status_product}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentProducts;
