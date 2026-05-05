export type SchemaType = 'HairSalon' | 'BarberShop';

export interface PostalAddressData {
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
}

export interface SeoThemeConfig {
  title: string;
  description: string;
  path: string;
  schemaType: SchemaType;
  businessName: string;
  /** Optional override; falls back to siteConfig.address. */
  address?: PostalAddressData;
}

export interface SeoSiteConfig {
  origin: string;
  defaultLang: string;
  address: PostalAddressData;
}

export interface SeoData {
  site: SeoSiteConfig;
  themes: Record<string, SeoThemeConfig>;
}
