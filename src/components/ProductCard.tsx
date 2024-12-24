import React, { useState } from 'react';
import { Edit, Trash2, Package, Tag, AlertCircle } from 'lucide-react';

export interface Product {
  id_product: number;
  nom_product: string;
  img_product: string;
  price_product: number;
  qnty_product: number;
  status_product: string;
  description_product: string;
  type_product: string;
  category_product: string;
  reference_product: string;
}

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
  onDelete: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = product.img_product.startsWith('http')
    ? product.img_product
    : `https://respizenmedical.com/fiori/${product.img_product}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    }).format(price);
  };

  const getStockStatus = () => {
    if (product.qnty_product > 10) return { color: 'text-green-600', bgColor: 'bg-green-50', text: 'En stock' };
    if (product.qnty_product > 0) return { color: 'text-orange-600', bgColor: 'bg-orange-50', text: 'Stock limité' };
    if (product.status_product === 'En stock') return { color: 'text-green-600', bgColor: 'bg-green-50', text: 'En stock' };
    if (product.status_product === 'Épuisé') return { color: 'text-orange-600', bgColor: 'bg-orange-50', text: 'Stock limité' };
    return { color: 'text-red-600', bgColor: 'bg-red-50', text: 'Épuisé' };
  };

  const getCategoryLabel = (category: string) => {
    return category === 'Men' ? 'Homme' : 'Femme';
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        <div className="relative group h-64">
          <img
            src={imageError ? '/images/default-product.jpg' : imageUrl}
            alt={product.nom_product}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={() => setShowEditForm(true)}
              className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
              title="Modifier le produit"
            >
              <Edit className="w-4 h-4 text-gray-700 group-hover:text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
              title="Supprimer le produit"
            >
              <Trash2 className="w-4 h-4 text-gray-700 group-hover:text-red-600" />
            </button>
          </div>

          {product.qnty_product <= 10 && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg">
              <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-orange-700">Stock limité</span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-xl text-gray-800 line-clamp-2 hover:line-clamp-none transition-all duration-200">
              {product.nom_product}
            </h3>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2 hover:line-clamp-none transition-all duration-200">
              {product.description_product}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5a0c1a] font-bold text-2xl">
              {formatPrice(product.price_product)}
            </span>
            <div className={`px-3 py-1.5 ${getStockStatus().bgColor} rounded-full flex items-center gap-2`}>
              <Package className="w-4 h-4 text-gray-600" />
              <span className={`text-sm font-semibold ${getStockStatus().color}`}>
                {product.qnty_product} {product.qnty_product > 1 ? 'pièces' : 'pièce'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full flex items-center gap-1.5 font-medium">
              <Tag className="w-3.5 h-3.5" />
              {product.type_product}
            </span>
            <span className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
              {getCategoryLabel(product.category_product)}
            </span>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Réf: <span className="font-medium">{product.reference_product}</span>
            </div>
            <div className={`text-sm ${getStockStatus().color} font-medium`}>
              {getStockStatus().text}
            </div>
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
