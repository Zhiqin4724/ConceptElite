import { Injectable } from '@angular/core';
import { Stylist } from '../model/stylist.model';
import { stylists } from '../data/stylist.json';

@Injectable({
  providedIn: 'root'
})
export class StylistService {

  private stylists: Stylist[] = stylists;

  getAll(): Stylist[] {
    return this.stylists;
  }

  getBySlug(slug: string): Stylist | undefined {
    return this.stylists.find(s => s.slug === slug);
  }
}