export interface Stylist {
  id: number;
  slug: string;
  name: string;
  location: string;
  specialty: string;
  imageUrl: string;
  bio?: string;
  instagram?: string;
  availability?: string;
  portfolioImages?: string[];
}