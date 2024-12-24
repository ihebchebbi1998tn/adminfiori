import React, { useState } from 'react';
import { ProductFormFields } from './ProductFormFields';
import { FormHeader } from '../ui/FormHeader';

interface AddProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ValidationError {
  field?: string;
  message: string;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);

  // Basic form validation
  const validateForm = (formData: FormData): ValidationError | null => {
    // Check required fields
    const requiredFields = [
      'reference_product',
      'nom_product',
      'description_product',
      'type_product',
      'category_product',
      'price_product',
      'qnty_product',
      'status_product',
      'img_product'
    ];

    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return {
          field,
          message: `${field.replace('_', ' ')} is required`
        };
      }
    }

    // Validate price format
    const price = formData.get('price_product') as string;
    if (!/^\d*\.?\d*$/.test(price)) {
      return {
        field: 'price_product',
        message: 'Price must be a valid number'
      };
    }

    // Validate quantity format
    const quantity = formData.get('qnty_product') as string;
    if (!/^\d+$/.test(quantity)) {
      return {
        field: 'qnty_product',
        message: 'Quantity must be a whole number'
      };
    }

    // Validate image
    const imageFile = formData.get('img_product') as File;
    if (imageFile instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(imageFile.type)) {
        return {
          field: 'img_product',
          message: 'Only JPG, JPEG, and PNG images are allowed'
        };
      }

      // Check file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (imageFile.size > maxSize) {
        return {
          field: 'img_product',
          message: 'Image size must be less than 5MB'
        };
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate form before submission
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://respizenmedical.com/fiori/add_article.php', {
        method: 'POST',
        body: formData,
      });

      // Log response headers for debugging
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let responseData;
      const contentType = response.headers.get("content-type");
      const responseText = await response.text();

      try {
        // Try to parse as JSON even if content-type is not explicitly JSON
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Invalid response format from server');
      }

      if (responseData.status === 'success') {
        // Show success message before closing
        onSuccess();
        onClose();
      } else {
        setError({
          message: responseData.message || 'Failed to add product'
        });
      }
    } catch (err) {
      console.error('Error details:', err);
      setError({
        message: err instanceof Error ? err.message : 'An error occurred while adding the product'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-2xl mx-4">
        <FormHeader title="Add New Product" onClose={onClose} />
        
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <ProductFormFields />

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded flex items-center">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>{error.message}</span>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
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
              className="px-4 py-2 bg-[#5a0c1a] text-white rounded-lg hover:bg-[#5a0c1a]/90 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
