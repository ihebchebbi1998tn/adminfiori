import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductCard from '../ProductCard';
import AddProductPage from './AddProductPage';
import DeleteProductModal from './DeleteProductModal';
import { fetchProducts } from '../../utils/api/products';
import { Product } from '../../types/products';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteProduct(product);
  };

  if (showAddPage) {
    return <AddProductPage onBack={() => {
      setShowAddPage(false);
      loadProducts(); // Refresh products after adding
    }} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5a0c1a] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#5a0c1a]">Products</h2>
        <button
          onClick={() => setShowAddPage(true)}
          className="px-4 py-2 bg-[#5a0c1a] text-white rounded-lg hover:bg-[#5a0c1a]/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-[#5a0c1a]/20">
          <p className="text-gray-600">No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id_product}
              product={product}
              onUpdate={loadProducts}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onSuccess={() => {
            loadProducts();
            setDeleteProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;