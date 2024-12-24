import React from 'react';
import { FormField } from '../ui/FormField';
import { FormSelect } from '../ui/FormSelect';

export const ProductFormFields = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Reference"
          name="reference_product"
          type="text"
          maxLength={250}  // Match VARCHAR(250)
          required
        />
        
        <FormField
          label="Name"
          name="nom_product"
          type="text"
          maxLength={250}
          required
        />

        <FormField
          label="Price"
          name="price_product"
          type="text"  // Changed to text since it's VARCHAR in DB
          maxLength={250}
          required
        />

        <FormField
          label="Quantity"
          name="qnty_product"
          type="text"  // Changed to text since it's VARCHAR in DB
          maxLength={250}
          required
        />

        <FormSelect
          label="Type"
          name="type_product"
          required
          options={[
            { value: 'Dress', label: 'Dress' },
            { value: 'Jacket', label: 'Jacket' },
            { value: 'Shoes', label: 'Shoes' },
            { value: 'Accessories', label: 'Accessories' }
          ]}
        />

        <FormSelect
          label="Category"
          name="category_product"
          required
          options={[
            { value: 'Women', label: 'Women' },
            { value: 'Men', label: 'Men' },
            { value: 'Unisex', label: 'Unisex' }
          ]}
        />

        <FormSelect
          label="Status"
          name="status_product"
          required
          options={[
            { value: 'En stock', label: 'En stock' },
            { value: 'Épuisé', label: 'Épuisé' }
          ]}
        />
      </div>

      <FormField
        label="Description"
        name="description_product"
        type="textarea"
        maxLength={250}  // Match VARCHAR(250)
        required
        rows={3}
      />

      <FormField
        label="Product Image"
        name="img_product"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        required
      />
    </>
  );
};
