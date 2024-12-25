import React, { useState, useEffect } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  maxLength?: number;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  required,
  options,
  maxLength,
  rows
}) => {
  if (type === 'select' && options) {
    return (
      <div className="relative">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out shadow-sm appearance-none hover:border-gray-400"
        >
          <option value="">Select an option</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows || 3}
          maxLength={maxLength}
          className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out shadow-sm resize-none hover:border-gray-400"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out shadow-sm hover:border-gray-400"
      />
    </div>
  );
};

export const ProductFormFields = () => {
  const [formValues, setFormValues] = useState({
    reference_product: '',
    nom_product: '',
    price_product: '',
    qnty_product: '',
    type_product: '',
    category_product: '',
    itemgroupe_product: '',
    status_product: '',
    description_product: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getItemGroupOptions = () => {
    if (!formValues.type_product) return [];
    
    if (formValues.type_product === 'Accessoires') {
      if (formValues.category_product === 'Men') {
        return [
          { value: 'Portefeuilles', label: 'Portefeuilles' },
          { value: 'Ceintures', label: 'Ceintures' },
          { value: 'Cravates', label: 'Cravates' },
          { value: 'Mallettes', label: 'Mallettes' },
          { value: 'Porte-cartes', label: 'Porte-cartes' },
          { value: 'Porte-clés', label: 'Porte-clés' },
          { value: 'Porte-chèques', label: 'Porte-chèques' },
          { value: 'Porte-passeports', label: 'Porte-passeports' }
        ];
      } else if (formValues.category_product === 'Women') {
        return [
          { value: 'Sacs à main', label: 'Sacs à main' }
        ];
      }
    }
    // ... rest of the options logic remains the same
    return [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Reference"
        name="reference_product"
        type="text"
        value={formValues.reference_product}
        onChange={handleInputChange}
        required
        maxLength={250}
      />
      
      <FormField
        label="Name"
        name="nom_product"
        type="text"
        value={formValues.nom_product}
        onChange={handleInputChange}
        required
        maxLength={250}
      />

      <FormField
        label="Price"
        name="price_product"
        type="number"
        value={formValues.price_product}
        onChange={handleInputChange}
        required
      />

      <FormField
        label="Quantity"
        name="qnty_product"
        type="number"
        value={formValues.qnty_product}
        onChange={handleInputChange}
        required
      />

      <FormField
        label="Type"
        name="type_product"
        type="select"
        value={formValues.type_product}
        onChange={handleInputChange}
        required
        options={[
          { value: 'Accessoires', label: 'Accessoires' },
          { value: "L'univers Cadeaux", label: "L'univers Cadeaux" },
          { value: 'Le monde Fiori', label: 'Le monde Fiori' },
          { value: 'Le sur mesure', label: 'Le sur mesure' },
          { value: 'Outlet', label: 'Outlet' }
        ]}
      />

      <FormField
        label="Category"
        name="category_product"
        type="select"
        value={formValues.category_product}
        onChange={handleInputChange}
        required
        options={[
          { value: 'Men', label: 'Homme' },
          { value: 'Women', label: 'Femme' }
        ]}
      />

      <FormField
        label="Item Group"
        name="itemgroupe_product"
        type="select"
        value={formValues.itemgroupe_product}
        onChange={handleInputChange}
        required
        options={getItemGroupOptions()}
      />

      <FormField
        label="Status"
        name="status_product"
        type="select"
        value={formValues.status_product}
        onChange={handleInputChange}
        required
        options={[
          { value: 'En stock', label: 'En stock' },
          { value: 'Épuisé', label: 'Épuisé' }
        ]}
      />

      <div className="md:col-span-2">
        <FormField
          label="Description"
          name="description_product"
          type="textarea"
          value={formValues.description_product}
          onChange={handleInputChange}
          required
          maxLength={250}
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProductFormFields;