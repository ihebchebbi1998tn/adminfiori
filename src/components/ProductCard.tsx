import React, { useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight, X, Calendar, Package, Tag, Layers, Edit,ImageIcon } from 'lucide-react';
import { Product } from '../../types/products';
import EditProductForm from './EditProductForm';
import ProductImageManager from './ProductImageManager';

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
  onDelete: (product: Product) => void;
}

// Product Size Table Component
const ProductSizeTable: React.FC<{ product: Product }> = ({ product }) => {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL','3XL'];
  const CostumeSizes = ['48', '50', '52', '54', '56', '58'];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {sizes.map(size => (
              <th key={size} className="px-3 py-2 text-xs font-medium text-gray-500 text-center">
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            {sizes.map(size => (
              <td key={size} className="px-3 py-2 text-sm text-gray-900 text-center">
                {product[`${size.toLowerCase()}_size` as keyof Product]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Product Gallery Component
const ProductGallery: React.FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="space-y-2">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img
          src={`https://www.fioriforyou.com/backfiori/${images[currentImage]}?format=webp&quality=80&w=800`}
          alt={`${productName} - Image ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <button
              onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`aspect-square rounded-md overflow-hidden ${
                currentImage === index ? 'ring-2 ring-[#5a0c1a]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={`https://www.fioriforyou.com/backfiori/${image}?format=webp&quality=80&w=800`}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Detail Modal Component
const ProductDetailModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const images = [
    product.img_product,
    product.img2_product,
    product.img3_product,
    product.img4_product
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ProductGallery images={images} productName={product.nom_product} />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Reference: {product.reference_product}</p>
                <h3 className="text-2xl font-bold text-gray-900">{product.nom_product}</h3>
                <p className="text-xl font-semibold text-[#5a0c1a] mt-2">
                  {new Intl.NumberFormat('fr-TN', {
                    style: 'currency',
                    currency: 'TND'
                  }).format(Number(product.price_product))}
                </p>
              </div>

              <p className="text-gray-600">{product.description_product}</p>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>{product.type_product}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span>{product.category_product}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Layers className="w-4 h-4 text-gray-400" />
                  <span>{product.itemgroup_product}</span>
                </div>
                {product.discount_product && product.discount_product !== "" && (
  <div className="flex items-center gap-1 text-sm">
    <Layers className="w-4 h-4 text-gray-400" />
    <span>{product.discount_product}</span>
  </div>
)}
               
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(product.createdate_product).toLocaleDateString()}</span>
                </div>
              </div>

              <ProductSizeTable product={product} />

              <div className="p-3 rounded-lg bg-gray-50">
                <h4 className="font-medium mb-2">Stock Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Available Quantity</p>
                    <p className="font-medium">{product.qnty_product} pieces</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{product.status_product}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const images = [product.img_product, product.img2_product, product.img3_product, product.img4_product].filter(Boolean);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const stockStatus = parseInt(product.qnty_product);
  const stockDisplay = stockStatus > 10 
    ? { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' }
    : stockStatus > 0 
    ? { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-50' }
    : { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all w-[280px] cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative h-40 bg-gray-50">
          <img
            src={`https://www.fioriforyou.com/backfiori/${images[currentImage]}?format=webp&quality=80&w=800`}
            alt={product.nom_product}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage((prev) => (prev + 1) % images.length);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">REF: {product.reference_product}</p>
              <h3 className="font-medium text-sm text-gray-900 truncate">{product.nom_product}</h3>
            </div>
            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full ${stockDisplay.bg} ${stockDisplay.color}`}>
              {stockDisplay.text}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 text-[10px]">
            {product.type_product && (
              <span className="px-1.5 py-0.5 bg-gray-100 rounded-full">{product.type_product}</span>
            )}
            {product.category_product && (
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">{product.category_product}</span>
            )}
          </div>

          <div className="grid grid-cols-6 gap-0.5 text-[10px] bg-gray-50 p-1 rounded">
  {['cravates', 'portefeuilles', 'mallettes', 'porte-cles', 'porte-cartes', 'porte-passport'].includes(product.itemgroup_product) ? (
    // For these product groups, show a message instead of sizes
    <div className="col-span-6 text-center">
      <p>Quantité : {product.qnty_product}</p>
    </div>
  ) : product.itemgroup_product === 'costumes' ? (
    // Render costume sizes
    ['48', '50', '52', '54', '56', '58'].map((size) => (
      <div key={size} className="text-center">
        <div className="font-medium text-gray-600">{size}</div>
        <div className="bg-white rounded">
          {product[`${size}_size` as keyof Product]}
        </div>
      </div>
    ))
  ) : product.itemgroup_product === 'vestes' ? (
    // Render veste sizes
    ['38', '40', '42', '44', '46', '48'].map((size) => (
      <div key={size} className="text-center">
        <div className="font-medium text-gray-600">{size}</div>
        <div className="bg-white rounded">
          {product[`${size}_size` as keyof Product]}
        </div>
      </div>
    ))
  ) : product.itemgroup_product === 'ceintures' ? (
    // Render veste sizes
    ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL' , '4XL'].map((size) => (
      <div key={size} className="text-center">
        <div className="font-medium text-gray-600">{size}</div>
        <div className="bg-white rounded">
          {product[`${size}_size` as keyof Product]}
        </div>
      </div>
    ))
  ) : (
    // Render standard sizes for other products
    ['S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
      <div key={size} className="text-center">
        <div className="font-medium text-gray-600">{size}</div>
        <div className="bg-white rounded">
          {product[`${size.toLowerCase()}_size` as keyof Product]}
        </div>
      </div>
    ))
  )}
</div>


      

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="font-semibold text-sm text-[#5a0c1a]">
              {new Intl.NumberFormat('fr-TN', {
                style: 'currency',
                currency: 'TND'
              }).format(Number(product.price_product))} 
            </span>
            <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowImageManager(true);
              }}
              className="p-1 text-purple-500 hover:bg-purple-50 rounded transition-colors"
              title="Gérer les images"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditForm(true);
              }}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <ProductDetailModal
          product={product}
          onClose={() => setShowDetails(false)}
        />
      )}

{showEditForm && (
        <EditProductForm
          product={product}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            onUpdate();
          }}
        />
      )}


{showImageManager && (
        <ProductImageManager
          product={product}
          onClose={() => setShowImageManager(false)}
          onSuccess={() => {
            setShowImageManager(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
