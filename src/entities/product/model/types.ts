export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  category: string;
  description?: string;
  brand?: string;
  article?: string;
  color?: string;
  package?: string;
  barcode?: string;
  nds?: number;
}
