import React, { useState, useMemo } from 'react';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';

// Types
interface AddProductPageProps {
  onBack: () => void;
}

interface ProductFormData {
  reference_product: string;
  nom_product: string;
  description_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  price_product: string;
  qnty_product: string;
  xs_size: string;
  s_size: string;
  m_size: string;
  l_size: string;
  xl_size: string;
  xxl_size: string;
  "3xl_size": string;
  "4xl_size": string;
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

// Configuration Constants
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
        itemGroups: ['portefeuilles', 'ceintures', 'cravates', 'mallettes', 'porte-cartes' , 'porte-cles' , 'porte-passport']
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

const PRODUCT_STATUS = [
  { value: 'en_stock', label: 'En stock' },
  { value: 'rupture_stock', label: 'Rupture de stock' }
] as const;

// Style Constants
const inputClassName = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a] transition-all duration-200 outline-none";
const selectClassName = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a] transition-all duration-200 outline-none appearance-none bg-white";
const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

const AddProductPage: React.FC<AddProductPageProps> = ({ onBack }) => {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    reference_product: '',
    nom_product: '',
    description_product: '',
    type_product: '',
    category_product: '',
    itemgroup_product: '',
    price_product: '',
    qnty_product: '',
    xs_size: '',
    s_size: '',
    m_size: '',
    l_size: '',
    xl_size: '',
    xxl_size: '',
    "3xl_size": '',
    "4xl_size": '',
    "48_size": '',
    "50_size": '',
    "52_size": '',
    "54_size": '',
    "56_size": '',
    "58_size": '',
    color_product: '',
    status_product: '',
    discount_product: '',
    related_products: ''
  });
  

  const availableCategories = useMemo(() => {
    if (!formData.type_product) return [];
    return Object.entries(PRODUCT_OPTIONS[formData.type_product as keyof typeof PRODUCT_OPTIONS]?.categories || {});
  }, [formData.type_product]);

  const availableItemGroups = useMemo(() => {
    if (!formData.type_product || !formData.category_product) return [];
    return PRODUCT_OPTIONS[formData.type_product as keyof typeof PRODUCT_OPTIONS]
      ?.categories[formData.category_product as 'homme' | 'femme']
      ?.itemGroups || [];
  }, [formData.type_product, formData.category_product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'type_product') {
        newData.category_product = '';
        newData.itemgroup_product = '';
      } else if (name === 'category_product') {
        newData.itemgroup_product = '';
      }
      
      return newData;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      setError('Maximum 4 images autorisées');
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValid && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Certains fichiers ont été ignorés. Les images doivent être inférieures à 5 Mo et dans des formats valides (ex: JPG, PNG)');
    }

    setImages(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const form = e.currentTarget as HTMLFormElement;
    const submitFormData = new FormData(form);
  
    // Ensure that all form fields are added, with null or 0 for empty values
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        submitFormData.append(key, null); // Adjust if backend needs null as a proper null value
      } else {
        submitFormData.append(key, value);
      }
    });
  
    images.forEach((image, index) => {
      const imageKey = index === 0 ? 'img_product' : `img${index + 1}_product`;
      submitFormData.append(imageKey, image);
    });
  
    try {
      const response = await fetch('https://www.fioriforyou.com/backfiori/add.php', {
        method: 'POST',
        body: submitFormData,
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (responseData.status === 'success') {
        onBack();
      } else {
        throw new Error(responseData.message || 'Échec de l\'ajout du produit');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux Produits
          </button>
          <h1 className="text-2xl font-bold text-[#5a0c1a]">Ajouter un Nouveau Produit</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">Images du Produit</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {preview.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={src} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
              {preview.length < 4 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#5a0c1a] transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 hover:bg-gray-50">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-500">Télécharger une Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">Détails du Produit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type_product" className={labelClassName}>Type</label>
                <select
                  id="type_product"
                  name="type_product"
                  value={formData.type_product}
                  onChange={handleInputChange}
                  className={selectClassName}
                >
                  <option value="">Sélectionner un type</option>
                  {Object.entries(PRODUCT_OPTIONS).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category_product" className={labelClassName}>Catégorie</label>
                <select
                  id="category_product"
                  name="category_product"
                  value={formData.category_product}
                  onChange={handleInputChange}
                  className={selectClassName}
                  disabled={!formData.type_product}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {availableCategories.map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="itemgroup_product" className={labelClassName}>Groupe d'Articles</label>
                <select
                  id="itemgroup_product"
                  name="itemgroup_product"
                  value={formData.itemgroup_product}
                  onChange={handleInputChange}
                  className={selectClassName}
                  disabled={!formData.category_product}
                >
                  <option value="">Sélectionner un groupe</option>
                  {availableItemGroups.map(value => (
                    <option key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reference_product" className={labelClassName}>Référence</label>
                <input
                  type="text"
                  id="reference_product"
                  name="reference_product"
                  value={formData.reference_product}
                  onChange={handleInputChange}
                  placeholder="Entrer la référence"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="nom_product" className={labelClassName}>Nom du Produit</label>
                <input
                  type="text"
                  id="nom_product"
                  name="nom_product"
                  value={formData.nom_product}
                  onChange={handleInputChange}
                  placeholder="Entrer le nom du produit"
                  className={inputClassName}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description_product" className={labelClassName}>Description</label>
                <textarea
                  id="description_product"
                  name="description_product"
                  value={formData.description_product}
                  onChange={handleInputChange}
                  placeholder="Entrer la description du produit"
                  rows={4}
                  className={`${inputClassName} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="price_product" className={labelClassName}>Prix</label>
                <input
                  type="text"
                  id="price_product"
                  name="price_product"
                  value={formData.price_product}
                  onChange={handleInputChange}
                  placeholder="Entrer le prix"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="qnty_product" className={labelClassName}>Quantité</label>
                <input
                  type="text"
                  id="qnty_product"
                  name="qnty_product"
                  value={formData.qnty_product}
                  onChange={handleInputChange}
                  placeholder="Entrer la quantité"
                  className={inputClassName}
                />
              </div>

              <div className="md:col-span-2">
              {!['cravates', 'portefeuilles', 'mallettes', 'porte-cles', 'porte-cartes' , 'porte-passport'].includes(formData.itemgroup_product) && (
  <h3 className="text-md font-semibold mb-4 text-gray-700">Quantités par Taille</h3>
)}
  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
  {['cravates', 'portefeuilles', 'mallettes', 'porte-cles', 'porte-cartes'].includes(formData.itemgroup_product) ? null : (
    formData.itemgroup_product === 'costumes' ? (
      // Render costume sizes
      ['48', '50', '52', '54', '56', '58'].map((size) => (
        
        <div key={size}>
          <label htmlFor={`${size}_size`} className={labelClassName}>
            {size}
          </label>
          <input
            type="number"
            id={`${size}_size`}
            name={`${size}_size`}
            value={formData[`${size}_size` as keyof typeof formData] || ''}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            className={inputClassName}
          />
        </div>
      ))
    ) : formData.itemgroup_product === 'vestes' ? (
      // Render veste sizes
      ['38', '40', '42', '44', '46', '48'].map((size) => (
        <div key={size}>
          <label htmlFor={`${size}_size`} className={labelClassName}>
            {size}
          </label>
          <input
            type="number"
            id={`${size}_size`}
            name={`${size}_size`}
            value={formData[`${size}_size` as keyof typeof formData] || ''}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            className={inputClassName}
          />
        </div>
      ))
    ): formData.itemgroup_product === 'ceintures' ? (
      // Render veste sizes
      ['xs','s', 'm', 'l', 'xl', 'xxl', '3xl' , '4xl'].map((size) => (
        <div key={size}>
          <label htmlFor={`${size}_size`} className={labelClassName}>
            {size.toUpperCase()}
          </label>
          <input
            type="number"
            id={`${size}_size`}
            name={`${size}_size`}
            value={formData[`${size}_size` as keyof typeof formData] || ''}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            className={inputClassName}
          />
        </div>
      ))
    ) : (
      // Default: Render normal sizes
      ['s', 'm', 'l', 'xl', 'xxl', '3xl'].map((size) => (
        <div key={size}>
          <label htmlFor={`${size}_size`} className={labelClassName}>
            {size.toUpperCase()}
          </label>
          <input
            type="number"
            id={`${size}_size`}
            name={`${size}_size`}
            value={formData[`${size}_size` as keyof typeof formData] || ''}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            className={inputClassName}
          />
        </div>
      ))
    )
  )}
</div>
</div>
              <div>
                <label htmlFor="color_product" className={labelClassName}>Couleur</label>
                <select
                  id="color_product"
                  name="color_product"
                  value={formData.color_product}
                  onChange={handleInputChange}
                  className={selectClassName}
                >
                  <option value="">Sélectionner une couleur</option>
                  {COLORS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status_product" className={labelClassName}>Statut</label>
                <select
                  id="status_product"
                  name="status_product"
                  value={formData.status_product}
                  onChange={handleInputChange}
                  className={selectClassName}
                >
                  <option value="">Sélectionner le statut</option>
                  {PRODUCT_STATUS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="related_products" className={labelClassName}>Pourcentage Remise:</label>
                <input
                  type="number"
                  id="discount_product"
                  name="discount_product"
                  value={formData.discount_product}
                  onChange={handleInputChange}
                  placeholder="Ajouer en % remise pour cette article"
                  className={inputClassName}
                />
              </div> 
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#5a0c1a] text-white rounded-lg hover:bg-[#5a0c1a]/90 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter le Produit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;