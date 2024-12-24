import React, { useState, useEffect } from 'react';

const FormSelect = ({ label, name, required, value, onChange, options }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out shadow-sm appearance-none hover:border-gray-400"
      >
        <option value="">Sélectionner une option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
        <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
    </div>
  );
};

const FormField = ({ label, name, type, maxLength, required, rows, value, onChange, accept }) => {
  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          name={name}
          required={required}
          maxLength={maxLength}
          rows={rows}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out shadow-sm resize-none hover:border-gray-400"
          placeholder={`Entrez ${label.toLowerCase()}...`}
        />
      </div>
    );
  }

  if (type === 'file') {
    return (
      <div className="mt-4">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-all duration-200">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Télécharger un fichier</span>
                <input
                  type="file"
                  name={name}
                  required={required}
                  onChange={onChange}
                  accept={accept}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG jusqu'à 10MB</p>
          </div>
        </div>
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
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        accept={accept}
        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out shadow-sm hover:border-gray-400"
        placeholder={`Entrez ${label.toLowerCase()}...`}
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
    description_product: '',
    img_product: null
  });

  const [itemGroupOptions, setItemGroupOptions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
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
    } else if (formValues.type_product === "L'univers Cadeaux") {
      return [
        { value: 'Pack Composé', label: 'Pack Composé' },
        { value: 'Pack Prestige', label: 'Pack Prestige' },
        { value: 'Pack Premium', label: 'Pack Premium' },
        { value: 'Pack Trio', label: 'Pack Trio' },
        { value: 'Pack Duo', label: 'Pack Duo' },
        { value: 'Pack Mini Duo', label: 'Pack Mini Duo' },
        { value: 'Pack Mono', label: 'Pack Mono' }
      ];
    } else if (formValues.type_product === 'Le monde Fiori') {
      return [
        { value: 'Histoire', label: 'Histoire' },
        { value: 'Collection', label: 'Collection' },
        { value: 'DNA', label: 'DNA' }
      ];
    } else if (formValues.type_product === 'Le sur mesure') {
      if (formValues.category_product === 'Men') {
        return [
          { value: 'Portefeuilles', label: 'Portefeuilles' },
          { value: 'Ceintures', label: 'Ceintures' },
          { value: 'Cravates', label: 'Cravates' },
          { value: 'Mallettes', label: 'Mallettes' }
        ];
      } else if (formValues.category_product === 'Women') {
        return [
          { value: 'Sacs à main', label: 'Sacs à main' }
        ];
      }
    } else if (formValues.type_product === 'Outlet') {
      if (formValues.category_product === 'Men') {
        return [
          { value: 'Costumes', label: 'Costumes' },
          { value: 'Blazers', label: 'Blazers' },
          { value: 'Chemises', label: 'Chemises' },
          { value: 'Pulls', label: 'Pulls' },
          { value: 'Pantalons', label: 'Pantalons' }
        ];
      } else if (formValues.category_product === 'Women') {
        return [
          { value: 'Chemises', label: 'Chemises' },
          { value: 'Robes', label: 'Robes' },
          { value: 'Vestes/Manteaux', label: 'Vestes/Manteaux' }
        ];
      }
    }
    return [];
  };

  useEffect(() => {
    const options = getItemGroupOptions();
    setItemGroupOptions(options);
    if (options.length === 0) {
      setFormValues(prev => ({
        ...prev,
        itemgroupe_product: ''
      }));
    }
  }, [formValues.type_product, formValues.category_product]);

  return (
    <form className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <FormField
          label="Référence"
          name="reference_product"
          type="text"
          maxLength={250}
          required
          value={formValues.reference_product}
          onChange={handleInputChange}
        />
        
        <FormField
          label="Nom"
          name="nom_product"
          type="text"
          maxLength={250}
          required
          value={formValues.nom_product}
          onChange={handleInputChange}
        />

        <FormField
          label="Prix"
          name="price_product"
          type="text"
          maxLength={250}
          required
          value={formValues.price_product}
          onChange={handleInputChange}
        />

        <FormField
          label="Quantité"
          name="qnty_product"
          type="text"
          maxLength={250}
          required
          value={formValues.qnty_product}
          onChange={handleInputChange}
        />

        <FormSelect
          label="Type"
          name="type_product"
          required
          value={formValues.type_product}
          onChange={handleInputChange}
          options={[
            { value: 'Accessoires', label: 'Accessoires' },
            { value: "L'univers Cadeaux", label: "L'univers Cadeaux" },
            { value: 'Le monde Fiori', label: 'Le monde Fiori' },
            { value: 'Le sur mesure', label: 'Le sur mesure' },
            { value: 'Outlet', label: 'Outlet' }
          ]}
        />

        <FormSelect
          label="Catégorie"
          name="category_product"
          required
          value={formValues.category_product}
          onChange={handleInputChange}
          options={[
            { value: 'Men', label: 'Homme' },
            { value: 'Women', label: 'Femme' }
          ]}
        />

        <FormSelect
          label="Groupe d'articles"
          name="itemgroupe_product"
          required
          value={formValues.itemgroupe_product}
          onChange={handleInputChange}
          options={itemGroupOptions}
        />

        <FormSelect
          label="Statut"
          name="status_product"
          required
          value={formValues.status_product}
          onChange={handleInputChange}
          options={[
            { value: 'En stock', label: 'En stock' },
            { value: 'Épuisé', label: 'Épuisé' }
          ]}
        />
      </div>

      <div className="mt-6">
        <FormField
          label="Description"
          name="description_product"
          type="textarea"
          maxLength={250}
          required
          rows={3}
          value={formValues.description_product}
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-6">
        <FormField
          label="Image du produit"
          name="img_product"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          required
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
};

export default ProductFormFields;
