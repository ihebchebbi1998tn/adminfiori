import React, { useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types/products';

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
  onDelete: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [product.img_product, product.img2_product, product.img3_product, product.img4_product].filter(Boolean);

  const stockStatus = parseInt(product.qnty_product);
  const stockDisplay = stockStatus > 10 
    ? { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' }
    : stockStatus > 0 
    ? { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-50' }
    : { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all w-[280px]">
      {/* Image Gallery */}
      <div className="relative h-40 bg-gray-50">
        <img
          src={`https://respizenmedical.com/fiori/${images[currentImage]}`}
          alt={product.nom_product}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <button
              onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">REF: {product.reference_product}</p>
            <h3 className="font-medium text-sm text-gray-900 truncate">{product.nom_product}</h3>
          </div>
          <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full ${stockDisplay.bg} ${stockDisplay.color}`}>
            {stockDisplay.text}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 text-[10px]">
          {product.type_product && (
            <span className="px-1.5 py-0.5 bg-gray-100 rounded-full">{product.type_product}</span>
          )}
          {product.category_product && (
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">{product.category_product}</span>
          )}
        </div>

        {/* Sizes Grid */}
        <div className="grid grid-cols-6 gap-0.5 text-[10px] bg-gray-50 p-1 rounded">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} className="text-center">
              <div className="font-medium text-gray-600">{size}</div>
              <div className="bg-white rounded">{product[`${size.toLowerCase()}_size` as keyof Product]}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="font-semibold text-sm text-[#5a0c1a]">
            {new Intl.NumberFormat('fr-TN', {
              style: 'currency',
              currency: 'TND'
            }).format(Number(product.price_product))}
          </span>
          <button
            onClick={() => onDelete(product)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;