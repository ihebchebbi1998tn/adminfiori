import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductCard from '../ProductCard';
import AddProductPage from './AddProductPage';
import DeleteProductModal from './DeleteProductModal';
import { fetchProducts } from '../../utils/api/products';
import { Product } from '../../types/products';

// Configuration Constants
const PRODUCT_OPTIONS = {
  'le-monde-fiori': {
    label: 'Le Monde Fiori',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['histoire', 'collection', 'dna'],
      },
    },
  },
  'pret-a-porter': {
    label: 'Prêt à Porter',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['costumes', 'blazers', 'chemises', 'pantalons', 'pollo'],
      },
      femme: {
        label: 'Femme',
        itemGroups: ['chemises', 'robes', 'vestes'],
      },
    },
  },
  'accessoires': {
    label: 'Accessoires',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['portefeuilles', 'ceintures', 'cravates', 'mallettes', 'porte-cartes', 'porte-cles'],
      },
      femme: {
        label: 'Femme',
        itemGroups: ['sacs-a-main'],
      },
    },
  },
  'sur-mesure': {
    label: 'Sur Mesure',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['portefeuilles', 'ceintures'],
      },
      femme: {
        label: 'Femme',
        itemGroups: ['sacs-a-main'],
      },
    },
  },
  'outlet': {
    label: 'Outlet',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['costumes', 'blazers', 'chemises', 'pantalons', 'pollo'],
      },
      femme: {
        label: 'Femme',
        itemGroups: ['chemises', 'robes', 'vestes'],
      },
    },
  },
} as const;

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemGroup, setSelectedItemGroup] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products, selectedType, selectedCategory, selectedItemGroup]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.nom_product.toLowerCase().includes(lowercasedSearchTerm) ||
        product.reference_product.toLowerCase().includes(lowercasedSearchTerm) ||
        product.category_product.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    if (selectedType) {
      filtered = filtered.filter(product => product.type_product === selectedType);
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_product === selectedCategory);
    }

    if (selectedItemGroup) {
      filtered = filtered.filter(product => product.itemgroup_product === selectedItemGroup);
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteProduct(product);
  };

  const getCategories = () => {
    if (!selectedType) return [];
    return Object.entries(PRODUCT_OPTIONS[selectedType].categories);
  };

  const getItemGroups = () => {
    if (!selectedType || !selectedCategory) return [];
    return PRODUCT_OPTIONS[selectedType].categories[selectedCategory]?.itemGroups || [];
  };

  if (showAddPage) {
    return (
      <AddProductPage
        onBack={() => {
          setShowAddPage(false);
          loadProducts();
        }}
      />
    );
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

      <div className="mt-4 space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setSelectedCategory('');
              setSelectedItemGroup('');
            }}
            className="p-2 border rounded-lg"
          >
            <option value="">Select Type</option>
            {Object.entries(PRODUCT_OPTIONS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedItemGroup('');
            }}
            className="p-2 border rounded-lg"
            disabled={!selectedType}
          >
            <option value="">Select Category</option>
            {getCategories().map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>

          <select
            value={selectedItemGroup}
            onChange={(e) => setSelectedItemGroup(e.target.value)}
            className="p-2 border rounded-lg"
            disabled={!selectedCategory}
          >
            <option value="">Select Item Group</option>
            {getItemGroups().map(itemGroup => (
              <option key={itemGroup} value={itemGroup}>
                {itemGroup}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">{error}</div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-[#5a0c1a]/20">
          <p className="text-gray-600">No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
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
