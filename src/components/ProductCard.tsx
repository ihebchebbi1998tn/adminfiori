import React, { useState } from 'react';
import { Edit, Trash2, Package, Tag, AlertCircle } from 'lucide-react';
import EditProductForm from './EditProductForm';

// Define a single Product interface to be used across components
export interface Product {
  id_product: number;
  nom_product: string;
  img_product: string;
  price_product: number;
  qnty_product: number;
  status_product: string;
  description_product: string;  // Remove optional
  type_product: string;         // Remove optional
  category_product: string;     // Remove optional
  reference_product: string;    // Remove optional
}

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
  onDelete: (product: Product) => void;  // Remove Promise
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = product.img_product.startsWith('http')
    ? product.img_product
    : `https://respizenmedical.com/fiori/${product.img_product}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getStockStatus = () => {
    if (product.qnty_product > 10) return { color: 'text-green-600', text: 'En stock' };
    if (product.qnty_product > 0) return { color: 'text-orange-600', text: 'Stock faible' };
    if (product.status_product === 'En stock') return { color: 'text-green-600', text: 'En stock' };
    if (product.status_product === 'Épuisé') return { color: 'text-orange-600', text: 'Stock faible' };
    return { color: 'text-red-600', text: 'Épuisé' };
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative group h-48">
          <img
            src={imageError ? '/default-product.jpg' : imageUrl}
            alt={product.nom_product}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
            <button
              onClick={() => setShowEditForm(true)}
              className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200"
              title="Modifier le produit"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-all duration-200"
              title="Supprimer le produit"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>

          {product.qnty_product <= 10 && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-orange-500" />
              <span className="text-orange-700">Stock faible</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">

        <div className="flex justify-between items-center pt-2">
            <span className="text-[#5a0c1a] font-bold text-lg">
            
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getStockStatus().color}`}>
                {product.status_product}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 hover:line-clamp-none transition-all duration-200">
              {product.nom_product}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2 hover:line-clamp-none transition-all duration-200">
              {product.description_product}
            </p>
          </div>
         

          <div className="flex justify-between items-center pt-2">
            <span className="text-[#5a0c1a] font-bold text-lg">
              {formatPrice(product.price_product)}
            </span>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className={`text-sm font-medium ${getStockStatus().color}`}>
                {product.qnty_product} unités
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {product.type_product}
            </span>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
              {product.category_product}
            </span>
          </div>

          <div className="text-xs text-gray-400 pt-2">
            Réf: {product.reference_product}
          </div>
        </div>
      </div>

      {showEditForm && (
        <EditProductForm
          product={product}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            onUpdate();
            setShowEditForm(false);
          }}
        />
      )}
    </>
  );
};

export default ProductCard;