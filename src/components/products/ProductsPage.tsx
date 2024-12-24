import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ProductCard from '../ProductCard';
import AddProductForm from './AddProductForm';

interface Product {
  id_product: number;
  reference_product: string;
  nom_product: string;
  img_product: string;
  description_product: string;
  type_product: string;
  category_product: string;
  price_product: number;
  qnty_product: number;
  status_product: string;
}

interface DeleteModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ product, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">Confirmation de suppression</h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le produit "{product.nom_product}" ?
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://respizenmedical.com/fiori/get_all_articles.php');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.status === 'success' && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setError('Invalid data format received from server');
        setProducts([]);
      }
    } catch (err) {
      setError('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    setDeleteProduct(product);
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `https://respizenmedical.com/fiori/delete_product.php?id_product=${deleteProduct.id_product}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        setProducts(products.filter(p => p.id_product !== deleteProduct.id_product));
        setDeleteProduct(null);
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
          onClick={() => setShowAddForm(true)}
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
            <div key={product.id_product} className="relative group">
<ProductCard 
        product={product}
        onUpdate={fetchProducts}
        onDelete={handleDeleteProduct}
      />              <button
                onClick={() => handleDeleteProduct(product)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            fetchProducts();
            setShowAddForm(false);
          }}
        />
      )}

      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ProductsPage;
