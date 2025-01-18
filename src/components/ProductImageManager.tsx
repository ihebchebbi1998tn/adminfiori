import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ProductImageManagerProps {
  product: {
    id_product: number;
    img_product: string;
    img2_product?: string;
    img3_product?: string;
    img4_product?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({ product, onClose, onSuccess }) => {
  const [newImages, setNewImages] = useState<{ [key: string]: File | null }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageDelete = async (imageNumber: number) => {
    try {
      const response = await fetch('https://www.fioriforyou.com/backfiori/update_images_products.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_product: product.id_product,
          image_number: imageNumber
        })
      });

      if (!response.ok) throw new Error('Failed to delete image');
      
      onSuccess();
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: string) => {
    if (e.target.files?.[0]) {
      setNewImages(prev => ({
        ...prev,
        [imageKey]: e.target.files![0]
      }));
    }
  };

  const handleImageUpdate = async () => {
    if (Object.keys(newImages).length === 0) return;

    setLoading(true);
    setError('');

    try {
      // Create FormData and append product ID
      const formData = new FormData();
      formData.append('id_product', product.id_product.toString());
      
      // Append each new image with its specific key
      Object.entries(newImages).forEach(([key, file]) => {
        if (file) {
          // Use the exact field name (img_product, img2_product, etc.)
          formData.append(key, file);
        }
      });

      const response = await fetch('https://www.fioriforyou.com/backfiori/update_images_products.php', {
        method: 'POST', // Changed to POST as per API requirements
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update images');

      const result = await response.json();
      if (result.status === 'success') {
        onSuccess();
        onClose();
      } else {
        throw new Error(result.message || 'Failed to update images');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update images');
    } finally {
      setLoading(false);
    }
  };

  // Define image slots with their exact field names
  const imageSlots = [
    { key: 'img_product', label: 'Image 1' },
    { key: 'img2_product', label: 'Image 2' },
    { key: 'img3_product', label: 'Image 3' },
    { key: 'img4_product', label: 'Image 4' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#5a0c1a]">Gérer les images</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageSlots.map((slot, index) => {
              const currentImage = product[slot.key as keyof typeof product];
              const newImage = newImages[slot.key];
              
              return (
                <div key={slot.key} className="relative">
                  <div className="aspect-square rounded-lg border border-gray-200 overflow-hidden">
                    {currentImage || newImage ? (
                      <div className="relative group">
                        <img
                          src={newImage ? URL.createObjectURL(newImage) : 
                            `https://www.fioriforyou.com/backfiori/${currentImage}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {currentImage && !newImage && (
                          <button
                            onClick={() => handleImageDelete(index + 1)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, slot.key)}
                          accept="image/*"
                          className="hidden"
                        />
                        <Upload className="w-6 h-6 text-gray-400" />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 text-center">{slot.label}</p>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          {Object.keys(newImages).length > 0 && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setNewImages({})}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleImageUpdate}
                disabled={loading}
                className="px-4 py-2 bg-[#5a0c1a] text-white rounded-lg hover:bg-[#5a0c1a]/90 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour les images'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageManager;