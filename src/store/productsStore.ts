import { create } from 'zustand';
import { Product } from '@/mocks/data';
import { db, DB_COLLECTIONS } from '@/lib/database';
import { mockProducts } from '@/mocks/data';
import { toast } from 'sonner';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  initializeData: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await db.getCollection<Product>(DB_COLLECTIONS.PRODUCTS);
      if (products.length === 0) {
        // Initialize with mock data if empty
        await get().initializeData();
        const initializedProducts = await db.getCollection<Product>(DB_COLLECTIONS.PRODUCTS);
        set({ products: initializedProducts, loading: false });
      } else {
        set({ products, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id);
  },
  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const newProduct: Product = {
        ...product,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.addToCollection(DB_COLLECTIONS.PRODUCTS, newProduct);
      set((state) => ({ products: [...state.products, newProduct], loading: false }));
      toast.success('Product created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create product');
      throw error;
    }
  },
  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await db.updateInCollection<Product>(
        DB_COLLECTIONS.PRODUCTS,
        id,
        { ...updates, updatedAt: new Date().toISOString() }
      );
      if (!updatedProduct) {
        throw new Error('Product not found');
      }
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));
      toast.success('Product updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update product');
      throw error;
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.deleteFromCollection(DB_COLLECTIONS.PRODUCTS, id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
      toast.success('Product deleted successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to delete product');
      throw error;
    }
  },
  searchProducts: async (query) => {
    const products = await db.getCollection<Product>(DB_COLLECTIONS.PRODUCTS);
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.name.toLowerCase().includes(lowerQuery)
    );
  },
  initializeData: async () => {
    const existing = await db.getCollection<Product>(DB_COLLECTIONS.PRODUCTS);
    if (existing.length === 0) {
      // Seed with mock data
      for (const product of mockProducts) {
        await db.addToCollection(DB_COLLECTIONS.PRODUCTS, product);
      }
    }
  },
}));
