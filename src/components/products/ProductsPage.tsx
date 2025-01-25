import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductCard from '../ProductCard';
import AddProductPage from './AddProductPage';
import DeleteProductModal from './DeleteProductModal';
import { getUpdateStatus, fetchProducts, setUpdateStatus } from '../../utils/api/products';
import { Product } from '../../types/products';

const PRODUCT_OPTIONS = {
  'pret-a-porter': {
    label: 'Prêt à Porter',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['costumes', 'blazers', 'chemises', 'pantalons', 'polo']
      },
      femme: {
        label: 'Femme',
        itemGroups: ['chemises', 'robes', 'vestes']
      }
    }
  },
  'accessoires': {
    label: 'Accessoires',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['portefeuilles', 'ceintures', 'cravates', 'mallettes', 'porte-cartes', 'porte-cles' , 'porte-passport']
      },
      femme: {
        label: 'Femme',
        itemGroups: ['sacs-a-main']
      }
    }
  },
  'sur-mesure': {
    label: 'Sur Mesure',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['portefeuilles', 'ceintures']
      },
      femme: {
        label: 'Femme',
        itemGroups: ['sacs-a-main']
      }
    }
  },
  'outlet': {
    label: 'Outlet',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['costumes', 'blazers', 'chemises', 'pantalons', 'polo']
      },
      femme: {
        label: 'Femme',
        itemGroups: ['chemises', 'robes', 'vestes']
      }
    }
  }
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
  const [hasDiscount, setHasDiscount] = useState('');
  const [inStock, setInStock] = useState('');
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    loadProducts();
    const intervalId = setInterval(refetchIfNeeded, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedType, selectedCategory, selectedItemGroup, hasDiscount, inStock, products]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(prevProducts => {
        // Only update if data is different
        if (JSON.stringify(prevProducts) !== JSON.stringify(data)) {
          return data;
        }
        return prevProducts;
      });
      setError('');
    } catch (err) {
      setError('Échec du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const refetchIfNeeded = async () => {
    const updateStatus = await getUpdateStatus();
    if (updateStatus === 1 && !isRefetching) {
      setIsRefetching(true);
      try {
        const data = await fetchProducts();
        setProducts(prevProducts => {
          if (JSON.stringify(prevProducts) !== JSON.stringify(data)) {
            return data;
          }
          return prevProducts;
        });
        await setUpdateStatus(0);
      } finally {
        setIsRefetching(false);
      }
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.nom_product.toLowerCase().includes(lowercasedTerm) ||
        product.reference_product.toLowerCase().includes(lowercasedTerm) ||
        product.category_product.toLowerCase().includes(lowercasedTerm) ||
        product.description_product.toLowerCase().includes(lowercasedTerm)
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

    if (hasDiscount) {
      filtered = filtered.filter(product =>
        hasDiscount === 'oui' ? product.discount_product > 0 : product.discount_product === 0
      );
    }

    if (inStock) {
      filtered = filtered.filter(product =>
        inStock === 'oui' ? product.qnty_product > 0 : product.qnty_product === 0
      );
    }

    setFilteredProducts(filtered);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setSelectedType(newType);
    setSelectedCategory('');
    setSelectedItemGroup('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setSelectedItemGroup('');
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteProduct(product);
  };

  if (showAddPage) {
    return <AddProductPage onBack={() => {
      setShowAddPage(false);
      loadProducts();
    }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#5a0c1a]">Produits</h2>
        <button
          onClick={() => setShowAddPage(true)}
          className="px-4 py-2 bg-[#5a0c1a] text-white rounded-lg hover:bg-[#5a0c1a]/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un nouveau produit
        </button>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher des produits..."
          className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]"
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]"
        >
          <option value="">Type</option>
          {Object.entries(PRODUCT_OPTIONS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]"
        >
          <option value="">Catégorie</option>
          {selectedType && Object.entries(PRODUCT_OPTIONS[selectedType].categories).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={selectedItemGroup}
          onChange={(e) => setSelectedItemGroup(e.target.value)}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]"
        >
          <option value="">Groupe d'articles</option>
          {selectedType && selectedCategory &&
            PRODUCT_OPTIONS[selectedType].categories[selectedCategory].itemGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
        </select>

        <select
          value={hasDiscount}
          onChange={(e) => setHasDiscount(e.target.value)}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]"
        >
          <option value="">En promotion</option>
          <option value="oui">Oui</option>
          <option value="non">Non</option>
        </select>

        <select
          value={inStock}
          onChange={(e) => setInStock(e.target.value)}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]"
        >
          <option value="">En stock</option>
          <option value="oui">Oui</option>
          <option value="non">Non</option>
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5a0c1a] border-t-transparent"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-[#5a0c1a]/20">
          <p className="text-gray-600">Aucun produit trouvé. Ajoutez votre premier produit!</p>
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