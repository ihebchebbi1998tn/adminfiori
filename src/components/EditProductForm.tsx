import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Product {
  id_product: number;
  nom_product: string;
  img_product: string;
  price_product: number;
  qnty_product: number;
  status_product: string;
  description_product?: string;
  type_product?: string;
  category_product?: string;
  reference_product?: string;
}

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

// Create a type for form data that includes id_product
interface FormData extends Partial<Omit<Product, 'id_product'>> {
  id_product: number;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    id_product: product.id_product, // Include id_product
    nom_product: product.nom_product,
    price_product: product.price_product,
    qnty_product: product.qnty_product,
    status_product: product.status_product,
    description_product: product.description_product,
    type_product: product.type_product,
    category_product: product.category_product,
    reference_product: product.reference_product,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') || name.includes('qnty') 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const submitData = new FormData();
  
    // Explicitly add the product ID
    if (!product.id_product) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }
  
    // Add the ID to form data
    submitData.append('id_product', String(product.id_product));
  
    // Add other form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== undefined && 
        value !== null && 
        value !== '' && 
        value !== (product as any)[key]
      ) {
        if (typeof value === 'number') {
          submitData.append(key, String(value));
        } else {
          submitData.append(key, value);
        }
      }
    });
  
    // Handle image file
    if (imageFile) {
      submitData.append('img_product', imageFile);
    }
  
    try {
      const response = await fetch(`https://respizenmedical.com/fiori/modify_product.php?id_product=${product.id_product}`, {
  method: 'POST',
  body: submitData,
});
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.status === 'success') {
          onSuccess();
          onClose();
        } else {
          throw new Error(data.message || 'Failed to update product');
        }
      } else {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error('Invalid server response format');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="nom_product"
                value={formData.nom_product || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price_product"
                value={formData.price_product || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="qnty_product"
                value={formData.qnty_product || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status_product"
                value={formData.status_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
                required
              >
                <option value="En stock">En stock</option>
                <option value="Épuisé">Épuisé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#5a0c1a] text-white rounded-lg hover:bg-[#5a0c1a]/90 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
