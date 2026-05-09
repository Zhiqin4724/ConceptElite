/**
 * Models for the Square Catalog API.
 * Reference: https://developer.squareup.com/reference/square/catalog-api
 */

export interface SquareMoney {
  amount: number; // in smallest currency unit (cents)
  currency: string; // ISO 4217, e.g. "CAD"
}

export interface SquareItemVariationData {
  item_id?: string;
  name?: string;
  sku?: string;
  price_money?: SquareMoney;
  pricing_type?: 'FIXED_PRICING' | 'VARIABLE_PRICING';
  track_inventory?: boolean;
  location_overrides?: unknown[];
}

export interface SquareItemVariation {
  id: string;
  type: 'ITEM_VARIATION';
  item_variation_data?: SquareItemVariationData;
}

export interface SquareItemData {
  name?: string;
  description?: string;
  abbreviation?: string;
  label_color?: string;
  category_id?: string;
  tax_ids?: string[];
  modifier_list_info?: unknown[];
  variations?: SquareItemVariation[];
  product_type?: string;
  skip_modifier_screen?: boolean;
  image_ids?: string[];
  is_archived?: boolean;
}

export interface SquareCategoryData {
  name?: string;
}

export interface SquareImageData {
  name?: string;
  url?: string;
  caption?: string;
}

export interface SquareCatalogObject {
  type: 'ITEM' | 'CATEGORY' | 'IMAGE' | 'TAX' | 'ITEM_VARIATION' | string;
  id: string;
  updated_at?: string;
  version?: number;
  is_deleted?: boolean;
  present_at_all_locations?: boolean;
  item_data?: SquareItemData;
  category_data?: SquareCategoryData;
  image_data?: SquareImageData;
}

export interface SquareCatalogResponse {
  objects?: SquareCatalogObject[];
  cursor?: string;
  related_objects?: SquareCatalogObject[];
}

export interface SquareInventoryCount {
  catalog_object_id?: string;
  quantity?: string;
  state?: string;
}

/**
 * Normalized catalog item used by the UI.
 */
export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  productType: string;
  treatment: string;
  categories: string[];
  // tags: string[];
  imageUrl?: string;
  images: { url: string; altText?: string }[];
  price: number;
  salePrice?: number;
  currency: string;
  onSale: boolean;
  inStock: boolean;
  url?: string;
  raw?: SquareCatalogObject;
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