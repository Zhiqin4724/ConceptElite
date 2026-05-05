export interface PriceRow {
  label: string;
  price: string;
}

export interface ServiceCard {
  logo: string;
  image: string;
  title: string;
  menuTitle: string;
  rows: PriceRow[];
}
