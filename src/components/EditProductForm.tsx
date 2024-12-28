import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';

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
  s_size: number;
  m_size: number;
  l_size: number;
  xl_size: number;
  xxl_size: number;
  color_product: string;
  status_product: string;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: string) => {
    if (e.target.files && e.target.files[0]) {
      setImages(prev => ({
        ...prev,
        [imageKey]: e.target.files![0]
      }));
    }
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
      const response = await fetch('https://respizenmedical.com/fiori/update_products.php', {
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

          const imageResponse = await fetch('https://respizenmedical.com/fiori/update_product_images.php', {
            method: 'POST',
            body: imageFormData
          });

          if (!imageResponse.ok) {
            throw new Error('Failed to update product images');
          }
        }

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

            <div>
              <label className="block text-sm font-medium mb-1">Quantité</label>
              <input
                type="number"
                name="qnty_product"
                value={formData.qnty_product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Size inputs */}
            <div className="md:col-span-2 grid grid-cols-6 gap-4">
              {['xs', 's', 'm', 'l', 'xl', 'xxl'].map(size => (
                <div key={size}>
                  <label className="block text-sm font-medium mb-1">Taille {size.toUpperCase()}</label>
                  <input
                    type="number"
                    name={`${size}_size`}
                    value={formData[`${size}_size` as keyof Product]}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Image uploads */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-medium">Images du produit</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['img_product', 'img2_product', 'img3_product', 'img4_product'].map((key, index) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium">Image {index + 1}</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, key)}
                        accept="image/*"
                        className="hidden"
                        id={`image-${index}`}
                      />
                      <label
                        htmlFor={`image-${index}`}
                        className="block w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#5a0c1a] transition-colors cursor-pointer"
                      >
                        {formData[key as keyof Product] ? (
                          <img
                            src={`https://respizenmedical.com/fiori/${formData[key as keyof Product]}`}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
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