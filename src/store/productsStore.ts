import { create } from 'zustand';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  uom: string;
  reorderPoint: number;
  stock: {
    warehouse: string;
    location: string;
    quantity: number;
  }[];
}

interface ProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [
    {
      id: '1',
      sku: 'SKU-001',
      name: 'Widget A',
      category: 'Electronics',
      uom: 'pcs',
      reorderPoint: 50,
      stock: [
        { warehouse: 'Main Warehouse', location: 'A-01-01', quantity: 120 },
        { warehouse: 'Secondary Warehouse', location: 'B-02-03', quantity: 45 },
      ],
    },
    {
      id: '2',
      sku: 'SKU-002',
      name: 'Gadget B',
      category: 'Electronics',
      uom: 'pcs',
      reorderPoint: 30,
      stock: [
        { warehouse: 'Main Warehouse', location: 'A-01-02', quantity: 25 },
      ],
    },
    {
      id: '3',
      sku: 'SKU-003',
      name: 'Component C',
      category: 'Parts',
      uom: 'pcs',
      reorderPoint: 100,
      stock: [
        { warehouse: 'Main Warehouse', location: 'A-02-01', quantity: 200 },
      ],
    },
  ],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updatedProduct } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
