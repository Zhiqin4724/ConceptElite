export interface PriceRow {
  key: string;
  price: string;
}

export interface ServiceCard {
  key: string;
  logo: string;
  image: string;
  rows: PriceRow[];
}
