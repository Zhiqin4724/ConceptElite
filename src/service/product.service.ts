import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, expand, map, reduce, takeWhile } from 'rxjs';
import {
  CatalogItem,
  ProductCatalogResponse,
  SquarespaceProduct,
} from '../model/product.model';

/**
 * Service for the Squarespace Commerce Catalog.
 *
 * In dev, requests go to `/api/squarespace/...` which is forwarded by
 * `proxy.conf.js` to `https://api.squarespace.com/...` with the
 * `Authorization: Bearer <token>` header injected from `.env`.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/squarespace/1.0/commerce';

  /** Fetch a single page of raw products from Squarespace. */
  fetchProductsPage(cursor?: string): Observable<ProductCatalogResponse> {
    let params = new HttpParams();
    if (cursor) params = params.set('cursor', cursor);
    return this.http.get<ProductCatalogResponse>(`${this.base}/products`, {
      params,
    });
  }

  /** Fetch every page and return the full normalized catalog. */
  fetchCatalog(): Observable<CatalogItem[]> {
    return this.fetchProductsPage().pipe(
      expand((res) =>
        res.pagination?.hasNextPage && res.pagination.nextPageCursor
          ? this.fetchProductsPage(res.pagination.nextPageCursor)
          : [],
      ),
      takeWhile((res) => !!res, true),
      reduce(
        (acc, res) => acc.concat(res.products ?? []),
        [] as SquarespaceProduct[],
      ),
      map((products) => products.map((p) => this.normalize(p))),
    );
  }

  /** Convert a Squarespace product into a UI-friendly CatalogItem. */
  private normalize(p: SquarespaceProduct): CatalogItem {
    const name = p.name ?? p.structure?.name ?? 'Untitled product';
    const description = p.description ?? p.structure?.description ?? '';
    const tags = p.tags ?? p.structure?.tags ?? [];
    const categories = p.categories ?? p.structure?.categories ?? [];

    // Brand isn't a first-class field on Squarespace products; derive from a
    // tag formatted as "brand:Acme" when present, else fall back to the first
    // category.
    const brandTag = tags.find((t) => t.toLowerCase().startsWith('brand:'));
    const brand = brandTag
      ? brandTag.slice(brandTag.indexOf(':') + 1).trim()
      : categories[0];

    const variant = p.variants?.[0];
    const basePrice = variant?.pricing?.basePrice;
    const salePrice = variant?.pricing?.salePrice;
    const onSale = !!variant?.pricing?.onSale && !!salePrice;

    const inStock = (p.variants ?? []).some(
      (v) => v.stock?.unlimited || (v.stock?.quantity ?? 0) > 0,
    );

    return {
      id: p.id,
      name,
      description,
      brand,
      categories,
      tags: tags.filter((t) => !t.toLowerCase().startsWith('brand:')),
      imageUrl: p.images?.[0]?.url,
      images: p.images ?? [],
      price: basePrice ? Number(basePrice.value) : 0,
      salePrice: salePrice ? Number(salePrice.value) : undefined,
      currency: basePrice?.currency ?? 'USD',
      onSale,
      inStock: inStock || (p.variants?.length ?? 0) === 0,
      url: p.url ?? p.productPage?.url,
      raw: p,
    };
  }
}
