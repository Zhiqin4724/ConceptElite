import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, expand, map, reduce, EMPTY } from 'rxjs';
import {
  CatalogItem,
  SquareCatalogObject,
  SquareCatalogResponse,
} from '../model/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:4201/api/squarespace/v2/catalog';

  /** * FIX 1: Fetch IMAGE and CATEGORY objects along with ITEM.
   * Without these, image URLs and Brand names will be empty.
   */
  fetchProductsPage(cursor?: string): Observable<SquareCatalogResponse> {
    let params = new HttpParams().set('types', 'ITEM,IMAGE,CATEGORY');
    if (cursor) params = params.set('cursor', cursor);
    return this.http.get<SquareCatalogResponse>(`${this.base}/list`, {
      params,
    });
  }

  fetchCatalog(): Observable<CatalogItem[]> {
    return this.fetchProductsPage().pipe(
      expand((res) =>
        res.cursor ? this.fetchProductsPage(res.cursor) : EMPTY,
      ),
      reduce((acc, res) => {
        const objects = res.objects ?? [];
        const related = res.related_objects ?? [];
        return [...acc, ...objects, ...related];
      }, [] as SquareCatalogObject[]),
      map((all) => this.buildCatalog(all)),
    );
  }

  /** * Processes the raw list of objects to build the normalized catalog.
   */
  private buildCatalog(objects: SquareCatalogObject[]): CatalogItem[] {
    const imageMap = new Map<string, string>();
    const categoryMap = new Map<string, string>();

    // Map images and categories first so they are ready for the items
    for (const obj of objects) {
      if (obj.type === 'IMAGE' && obj.image_data?.url) {
        imageMap.set(obj.id, obj.image_data.url);
      }
      if (obj.type === 'CATEGORY' && obj.category_data?.name) {
        categoryMap.set(obj.id, obj.category_data.name);
      }
    }

    return objects
      .filter(
        (obj) =>
          obj.type === 'ITEM' &&
          !obj.is_deleted &&
          !obj.item_data?.is_archived &&
          obj.item_data?.product_type === 'REGULAR',
      )
      .map((obj) => this.normalize(obj, imageMap, categoryMap));
  }

  /** * FIX 2: Map the category_id to a 'brand' property.
   */
  private normalize(
    obj: SquareCatalogObject,
    imageMap: Map<string, string>,
    categoryMap: Map<string, string>,
  ): CatalogItem {
    const data = obj.item_data as any;

    // Initialize temp arrays to collect matches
    let brand = 'No Brand';
    const matchedTypes: string[] = [];
    const matchedTreatments: string[] = [];
    const allCategoryNames: string[] = [];

    // 1. Get all category IDs from the Square 'categories' array
    const categoryIds = data.categories?.map((c: any) => c.id) || [];
    if (data.category_id) categoryIds.push(data.category_id);

    // 2. Loop through every category assigned to this product
    categoryIds.forEach((id: string) => {
      const name = categoryMap.get(id);
      if (!name) return;

      allCategoryNames.push(name);

      // 3. Logic to sort strings into Facets
      // 3. Logic to sort strings into Facets
      const knownBrands = [
        'Amika',
        'Kérastase',
        'Kerastase',
        'Barberstation',
        'BaBylissPRO',
        'BABYLISS',
        'Nioxin',
        'Redken',
        'Olaplex',
        'Viral',
        "L'Oreal",
        "L'Oréal",
        'Hot Tools',
        'Avanti',
        'Mielle',
        'Passion',
      ];

      const knownTypes = [
        'Shampoo',
        'Conditioner',
        'Mask',
        'Masque',
        'Oil',
        'Spray',
        'Cream',
        'Bain',
        'Brosse',
        'Fer',
        'Sèche-cheveux',
        'Lotion',
        'Mousse',
      ];

      const knownTreatments = [
        'Hydration',
        'Color',
        'Growth',
        'Loss',
        'Frizz',
        'Volume',
        'Repair',
        'Blond',
        'Curl',
        'Scalp',
        'Dandruff',
        'Nutritive',
      ];

      // Check if the name matches a brand
      if (
        knownBrands.some((b) => name.toLowerCase().includes(b.toLowerCase()))
      ) {
        brand = name;
      }
      // Check if the name matches a product type
      else if (
        knownTypes.some((t) => name.toLowerCase().includes(t.toLowerCase()))
      ) {
        matchedTypes.push(name);
      }
      // Check if the name matches a treatment
      else if (
        knownTreatments.some((tr) =>
          name.toLowerCase().includes(tr.toLowerCase()),
        )
      ) {
        matchedTreatments.push(name);
      }
    });

    // Prepare the image URL
    const firstImageId = data.image_ids?.[0];
    const imageUrl = firstImageId ? imageMap.get(firstImageId) : undefined;

    // Prepare pricing
    const variation = data.variations?.[0]?.item_variation_data;
    const price = (variation?.price_money?.amount ?? 0) / 100;
    const currency = variation?.price_money?.currency ?? 'CAD';

    return {
      id: obj.id,
      name: data.name ?? 'Untitled product',
      description: data.description ?? '',

      // Convert to Strings for your facets
      brand: brand,
      productType: matchedTypes[0] ?? 'Other', // Takes the first matched type string
      treatment: matchedTreatments[0] ?? 'General', // Takes the first matched treatment string

      categories: allCategoryNames, // Full list of category names
      imageUrl: imageUrl,
      images:
        data.image_ids
          ?.map((id: string) => ({ url: imageMap.get(id) }))
          .filter((img: any) => img.url) || [],
      price: price,
      currency: currency,
      onSale: false,
      inStock: true,
      raw: obj,
    };
  }

  /** * Export function with the 'raw' null check fix included
   */
  exportCatalogData(): void {
    this.fetchCatalog().subscribe((items) => {
      const brandMapping: Record<string, string> = {};

      items.forEach((item) => {
        const catId = item.raw?.item_data?.category_id;
        const catName = item.brand;
        if (catId && catName && !brandMapping[catId]) {
          brandMapping[catId] = catName;
        }
      });

      this.triggerDownload({
        metadata: {
          generatedAt: new Date().toISOString(),
          itemCount: items.length,
        },
        brandMapping,
        products: items,
      });
    });
  }

  private triggerDownload(data: any): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', `catalog_audit_${Date.now()}.json`);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}