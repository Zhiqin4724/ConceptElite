/**
 * Models for the Squarespace Commerce Catalog.
 * Reference: https://developers.squarespace.com/commerce-apis/retrieve-all-products
 */

export interface Money {
  value: string; // decimal string, e.g. "29.99"
  currency: string; // ISO 4217, e.g. "USD"
}

export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  pricing: {
    basePrice: Money;
    salePrice?: Money;
    onSale?: boolean;
  };
  stock?: {
    quantity?: number;
    unlimited?: boolean;
  };
  attributes?: Record<string, string>;
}

/**
 * Normalized catalog item used by the UI. Built from a Squarespace product.
 */
export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  brand?: string;
  categories: string[];
  tags: string[];
  imageUrl?: string;
  images: ProductImage[];
  price: number;
  salePrice?: number;
  currency: string;
  onSale: boolean;
  inStock: boolean;
  url?: string;
  raw?: SquarespaceProduct;
}

/**
 * Raw response shapes from the Squarespace API.
 */
export interface SquarespaceProduct {
  id: string;
  type?: string;
  storePageId?: string;
  productPage?: { id: string; url?: string };
  url?: string;
  name?: string;
  description?: string;
  tags?: string[];
  isVisible?: boolean;
  variantAttributes?: string[];
  variants?: ProductVariant[];
  images?: ProductImage[];
  storeSettings?: { isVisible?: boolean };
  // Squarespace v1 uses `structure` in some payloads
  structure?: {
    name?: string;
    description?: string;
    tags?: string[];
    categories?: string[];
  };
  categories?: string[];
}

export interface ProductCatalogResponse {
  products: SquarespaceProduct[];
  pagination?: {
    nextPageUrl?: string;
    nextPageCursor?: string;
    hasNextPage?: boolean;
  };
}

export interface CatalogFacet {
  field: 'brand' | 'categories' | 'tags';
  label: string;
  values: { value: string; count: number; selected: boolean }[];
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';
