import React, { useState, useEffect } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { fetchProducts } from '../utils/api/products';
import { setUpdateStatus } from '../utils/api/products';

const PRODUCT_OPTIONS = {
  'le-monde-fiori': {
    label: 'Le Monde Fiori',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['histoire', 'collection', 'dna']
      }
    }
  },
  'pret-a-porter': {
    label: 'Prêt à Porter',
    categories: {
      homme: {
        label: 'Homme',
        itemGroups: ['costumes', 'blazers', 'chemises', 'pantalons', 'pollo']
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
        itemGroups: ['costumes', 'blazers', 'chemises', 'pantalons', 'pollo']
      },
      femme: {
        label: 'Femme',
        itemGroups: ['chemises', 'robes', 'vestes']
      }
    }
  }
} as const;

const COLORS = [
  { value: 'rouge', label: 'Rouge' },
  { value: 'bleu', label: 'Bleu' },
  { value: 'vert', label: 'Vert' },
  { value: 'jaune', label: 'Jaune' },
  { value: 'noir', label: 'Noir' },
  { value: 'blanc', label: 'Blanc' },
  { value: 'gris', label: 'Gris' },
  { value: 'rose', label: 'Rose' },
  { value: 'marron', label: 'Marron' },
  { value: 'violet', label: 'Violet' },
  { value: 'orange', label: 'Orange' }
] as const;

// Define the Product type interface
interface Product {
  id_product: number;
  reference_product: string;
  nom_product: string;
  img_product: string;
  img2_product?: string;
  img3_product?: string;
  img4_product?: string;
  description_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  price_product: string;
  qnty_product: string;
  xs_size: number;
  "3xl_size": number;
  "4xl_size": number;
  s_size: number;
  m_size: number;
  l_size: number;
  xl_size: number;
  xxl_size: number;
  "48_size": string;
  "50_size": string;
  "52_size": string;
  "54_size": string;
  "56_size": string;
  "58_size": string;
  color_product: string;
  status_product: string;
  discount_product: string;
  related_products: string;
}

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState<Product>(product);
  const [images, setImages] = useState<{ [key: string]: File | null }>({
    img_product: null,
    img2_product: null,
    img3_product: null,
    img4_product: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableItemGroups, setAvailableItemGroups] = useState<string[]>([]);

  useEffect(() => {
    // Update available categories when type changes
    const type = formData.type_product as keyof typeof PRODUCT_OPTIONS;
    if (PRODUCT_OPTIONS[type]) {
      const categories = Object.keys(PRODUCT_OPTIONS[type].categories);
      setAvailableCategories(categories);
      
      // Reset category and item group if not available in new type
      if (!categories.includes(formData.category_product)) {
        setFormData(prev => ({
          ...prev,
          category_product: categories[0],
          itemgroup_product: PRODUCT_OPTIONS[type].categories[categories[0]].itemGroups[0]
        }));
      }
    }
  }, [formData.type_product]);

  useEffect(() => {
    // Update available item groups when category changes
    const type = formData.type_product as keyof typeof PRODUCT_OPTIONS;
    const category = formData.category_product;
    
    if (PRODUCT_OPTIONS[type]?.categories[category]) {
      const itemGroups = PRODUCT_OPTIONS[type].categories[category].itemGroups;
      setAvailableItemGroups(itemGroups);
      
      // Reset item group if not available in new category
      if (!itemGroups.includes(formData.itemgroup_product)) {
        setFormData(prev => ({
          ...prev,
          itemgroup_product: itemGroups[0]
        }));
      }
    }
  }, [formData.type_product, formData.category_product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const jsonData = {
    id_product: product.id_product,
    ...formData
  };

  try {
    const response = await fetch('https://www.fioriforyou.com/backfiori/update_products.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    const result = await response.json();

    if (result.status === 'success') {
      // Handle image uploads if any
      if (Object.values(images).some(img => img !== null)) {
        const imageFormData = new FormData();
        imageFormData.append('id_product', product.id_product.toString());
        
        Object.entries(images).forEach(([key, file]) => {
          if (file) {
            imageFormData.append(key, file);
          }
        });

        const imageResponse = await fetch('https://www.fioriforyou.com/backfiori/update_product_images.php', {
          method: 'POST',
          body: imageFormData
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to update product images');
        }
      }

      const products = await fetchProducts();  // Calling fetchProducts
      console.log(products);  // You can use this data to update your state or display on the UI
      setUpdateStatus(1);  // Mark that the update happened

      // Trigger success callback
      onSuccess();
      onClose();
    } else {
      throw new Error(result.message || 'Failed to update product');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update product');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#5a0c1a]">Modifier le produit</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Select */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type_product"
                value={formData.type_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                {Object.entries(PRODUCT_OPTIONS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                name="category_product"
                value={formData.category_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {PRODUCT_OPTIONS[formData.type_product as keyof typeof PRODUCT_OPTIONS]
                      ?.categories[category].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Group Select */}
            <div>
              <label className="block text-sm font-medium mb-1">Groupe d'articles</label>
              <select
                name="itemgroup_product"
                value={formData.itemgroup_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                {availableItemGroups.map(group => (
                  <option key={group} value={group}>
                    {group.charAt(0).toUpperCase() + group.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Select */}
            <div>
              <label className="block text-sm font-medium mb-1">Couleur</label>
              <select
                name="color_product"
                value={formData.color_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                {COLORS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Remise</label>
              <input
                type="number"
                name="discount_product"
                value={formData.discount_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Référence</label>
              <input
                type="text"
                name="reference_product"
                value={formData.reference_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="nom_product"
                value={formData.nom_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description_product"
                value={formData.description_product}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prix</label>
              <input
                type="number"
                name="price_product"
                value={formData.price_product}
                onChange={handleChange}
                step="0.01"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-6 gap-4">
  {['cravates', 'portefeuilles', 'mallettes', 'porte-cles', 'porte-cartes', 'porte-passport'].includes(formData.itemgroup_product) ? (
    // Render qnty_product input field
    <div className="col-span-6">
      <label className="block text-sm font-medium mb-1">Quantité</label>
      <input
        type="number"
        name="qnty_product"
        value={formData.qnty_product}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>
  )   : (
    <div className="col-span-6">
                  <label className="block text-sm font-medium mb-1">La quantité sera la somme des tailles ici (calculé automatiquement)</label>

  </div>
  )}
</div>





















            <div className="md:col-span-2 grid grid-cols-6 gap-4">
  {['cravates', 'portefeuilles', 'mallettes', 'porte-cles', 'porte-cartes'].includes(formData.itemgroup_product) ? null : (
    formData.itemgroup_product === 'costumes' ? (
      // Render costume sizes
      ['48', '50', '52', '54', '56', '58'].map((size) => (
        <div key={size}>
          <label className="block text-sm font-medium mb-1">Taille {size}</label>
          <input
            type="number"
            name={`${size}_size`}
            value={formData[`${size}_size` as keyof Product] || ''}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      ))
    ) : formData.itemgroup_product === 'vestes' ? (
      // Render veste sizes
      ['38', '40', '42', '44', '46', '48'].map((size) => (
        <div key={size}>
          <label className="block text-sm font-medium mb-1">Taille {size}</label>
          <input
            type="number"
            name={`${size}_size`}
            value={formData[`${size}_size` as keyof Product] || ''}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      ))
    ) : formData.itemgroup_product === 'ceintures' ? (
      // Render veste sizes
      ['XS','S', 'M', 'L', 'XL', 'XXL', '3XL' , '4XL'].map((size) => (
        <div key={size}>
          <label className="block text-sm font-medium mb-1">Taille {size}</label>
          <input
            type="number"
            name={`${size.toLowerCase()}_size`}
            value={formData[`${size.toLowerCase()}_size` as keyof Product] || ''}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      ))
    )
    : (
      // Default: Render normal sizes
      ['S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
        <div key={size}>
          <label className="block text-sm font-medium mb-1">Taille {size}</label>
          <input
            type="number"
            name={`${size.toLowerCase()}_size`}
            value={formData[`${size.toLowerCase()}_size` as keyof Product] || ''}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      ))
    )
  )}
</div>

          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#5a0c1a] text-white rounded-lg hover:bg-[#5a0c1a]/90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;

