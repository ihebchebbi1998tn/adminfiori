import React, { useState } from 'react';
import { Edit, Trash2, Package, Tag, AlertCircle } from 'lucide-react';

export interface Product {
  id_product: string;
  reference_product: string;
  nom_product: string;
  img_product: string;
  img2_product: string;
  img3_product: string;
  img4_product: string;
  description_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  price_product: string;
  qnty_product: string;
  xs_size: string;
  s_size: string;
  m_size: string;
  l_size: string;
  xl_size: string;
  xxl_size: string;
  status_product: string;
  related_products: string;
  color_product: string;
  createdate_product: string;
}

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
  onDelete: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    product.img_product,
    product.img2_product,
    product.img3_product,
    product.img4_product,
  ];

  const stockMessage =
    parseInt(product.qnty_product) > 10
      ? { text: 'En stock', color: 'text-green-600', bgColor: 'bg-green-50' }
      : parseInt(product.qnty_product) > 0
      ? { text: 'Stock limité', color: 'text-orange-600', bgColor: 'bg-orange-50' }
      : { text: 'Épuisé', color: 'text-red-600', bgColor: 'bg-red-50' };

  const formatPrice = (price: string) =>
    new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
    }).format(Number(price));

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Carousel Section: Images */}
      <div className="relative">
        <img
          src={`https://respizenmedical.com/fiori/${images[currentImage]}`}
          alt={`Product: ${product.nom_product}`}
          className="w-full h-64 object-cover transition-transform duration-300"
        />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full ${
                currentImage === index ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Product Information Section */}
      <div className="p-6 space-y-4">
        <div>
        <p className="text-sm text-gray-600">ref = {product.reference_product} </p>
          <h2 className="text-xl font-bold text-gray-800">{product.nom_product} </h2>
          <p className="text-sm text-gray-600">{product.description_product}</p>
        </div>

        {/* Price and Stock Status */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-[#5a0c1a]">{formatPrice(product.price_product)}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${stockMessage.color} ${stockMessage.bgColor}`}
          >
            {product.qnty_product} {parseInt(product.qnty_product) > 1 ? 'pièces' : 'pièce'}{' '}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="px-2 py-1.5 bg-gray-100 text-xs font-small text-gray-700 rounded-full">
            {product.type_product}
          </span>
          <span className="px-2 py-1.5 bg-blue-50 text-xs font-small text-blue-700 rounded-full">
            {product.category_product}
          </span>
          <span className="px-2 py-1.5 bg-orange-50 text-xs font-small text-orange-700 rounded-full">
            {product.itemgroup_product}
          </span>
        </div>

        {/* Sizes */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            XS: <span>{product.xs_size}</span>
          </div>
          <div>
            S: <span>{product.s_size}</span>
          </div>
          <div>
            M: <span>{product.m_size}</span>
          </div>
          <div>
            L: <span>{product.l_size}</span>
          </div>
          <div>
            XL: <span>{product.xl_size}</span>
          </div>
          <div>
            XXL: <span>{product.xxl_size}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-6 py-4 border-t">
        {/* <button
          onClick={() => onUpdate()}
          className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
        >
          <Edit className="w-4 h-4 mr-2" /> Modifier
        </button> */}
        <button
          onClick={() => onDelete(product)}
          className="flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
        ><Trash2 className="w-4 h-4 mr-2" /></button>
      </div>
    </div>
  );
};

export default ProductCard;
