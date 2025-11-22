import { create } from 'zustand';
import { Warehouse, Category, UOM, mockWarehouses, mockCategories, mockUOMs } from '@/mocks/data';
import { db, DB_COLLECTIONS } from '@/lib/database';
import { toast } from 'sonner';

interface WarehousesState {
  warehouses: Warehouse[];
  categories: Category[];
  uoms: UOM[];
  loading: boolean;
  error: string | null;
  
  // Warehouses
  fetchWarehouses: () => Promise<void>;
  getWarehouseById: (id: string) => Warehouse | undefined;
  createWarehouse: (warehouse: Omit<Warehouse, 'id'>) => Promise<void>;
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => Promise<void>;
  deleteWarehouse: (id: string) => Promise<void>;
  
  // Categories
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // UOMs
  fetchUOMs: () => Promise<void>;
  createUOM: (uom: Omit<UOM, 'id'>) => Promise<void>;
  updateUOM: (id: string, updates: Partial<UOM>) => Promise<void>;
  deleteUOM: (id: string) => Promise<void>;
  
  // Initialize data
  initializeData: () => Promise<void>;
}

export const useWarehousesStore = create<WarehousesState>((set, get) => ({
  warehouses: [],
  categories: [],
  uoms: [],
  loading: false,
  error: null,
  
  // Warehouses
  fetchWarehouses: async () => {
    set({ loading: true, error: null });
    try {
      const warehouses = await db.getCollection<Warehouse>(DB_COLLECTIONS.WAREHOUSES);
      if (warehouses.length === 0) {
        await get().initializeData();
        const initializedWarehouses = await db.getCollection<Warehouse>(DB_COLLECTIONS.WAREHOUSES);
        set({ warehouses: initializedWarehouses, loading: false });
      } else {
        set({ warehouses, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getWarehouseById: (id: string) => {
    return get().warehouses.find((w) => w.id === id);
  },
  createWarehouse: async (warehouse) => {
    set({ loading: true, error: null });
    try {
      const newWarehouse: Warehouse = {
        ...warehouse,
        id: `wh-${Date.now()}`,
      };
      await db.addToCollection(DB_COLLECTIONS.WAREHOUSES, newWarehouse);
      set((state) => ({ warehouses: [...state.warehouses, newWarehouse], loading: false }));
      toast.success('Warehouse created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create warehouse');
      throw error;
    }
  },
  updateWarehouse: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedWarehouse = await db.updateInCollection<Warehouse>(
        DB_COLLECTIONS.WAREHOUSES,
        id,
        updates
      );
      if (!updatedWarehouse) {
        throw new Error('Warehouse not found');
      }
      set((state) => ({
        warehouses: state.warehouses.map((w) => (w.id === id ? updatedWarehouse : w)),
        loading: false,
      }));
      toast.success('Warehouse updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update warehouse');
      throw error;
    }
  },
  deleteWarehouse: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.deleteFromCollection(DB_COLLECTIONS.WAREHOUSES, id);
      set((state) => ({
        warehouses: state.warehouses.filter((w) => w.id !== id),
        loading: false,
      }));
      toast.success('Warehouse deleted successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to delete warehouse');
      throw error;
    }
  },
  
  // Categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await db.getCollection<Category>(DB_COLLECTIONS.CATEGORIES);
      if (categories.length === 0) {
        await get().initializeData();
        const initializedCategories = await db.getCollection<Category>(DB_COLLECTIONS.CATEGORIES);
        set({ categories: initializedCategories, loading: false });
      } else {
        set({ categories, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  createCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const newCategory: Category = {
        ...category,
        id: `cat-${Date.now()}`,
      };
      await db.addToCollection(DB_COLLECTIONS.CATEGORIES, newCategory);
      set((state) => ({ categories: [...state.categories, newCategory], loading: false }));
      toast.success('Category created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create category');
      throw error;
    }
  },
  updateCategory: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedCategory = await db.updateInCollection<Category>(
        DB_COLLECTIONS.CATEGORIES,
        id,
        updates
      );
      if (!updatedCategory) {
        throw new Error('Category not found');
      }
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
        loading: false,
      }));
      toast.success('Category updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update category');
      throw error;
    }
  },
  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.deleteFromCollection(DB_COLLECTIONS.CATEGORIES, id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: false,
      }));
      toast.success('Category deleted successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to delete category');
      throw error;
    }
  },
  
  // UOMs
  fetchUOMs: async () => {
    set({ loading: true, error: null });
    try {
      const uoms = await db.getCollection<UOM>(DB_COLLECTIONS.UOMS);
      if (uoms.length === 0) {
        await get().initializeData();
        const initializedUOMs = await db.getCollection<UOM>(DB_COLLECTIONS.UOMS);
        set({ uoms: initializedUOMs, loading: false });
      } else {
        set({ uoms, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  createUOM: async (uom) => {
    set({ loading: true, error: null });
    try {
      const newUOM: UOM = {
        ...uom,
        id: `uom-${Date.now()}`,
      };
      await db.addToCollection(DB_COLLECTIONS.UOMS, newUOM);
      set((state) => ({ uoms: [...state.uoms, newUOM], loading: false }));
      toast.success('UOM created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create UOM');
      throw error;
    }
  },
  updateUOM: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedUOM = await db.updateInCollection<UOM>(
        DB_COLLECTIONS.UOMS,
        id,
        updates
      );
      if (!updatedUOM) {
        throw new Error('UOM not found');
      }
      set((state) => ({
        uoms: state.uoms.map((u) => (u.id === id ? updatedUOM : u)),
        loading: false,
      }));
      toast.success('UOM updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update UOM');
      throw error;
    }
  },
  deleteUOM: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.deleteFromCollection(DB_COLLECTIONS.UOMS, id);
      set((state) => ({
        uoms: state.uoms.filter((u) => u.id !== id),
        loading: false,
      }));
      toast.success('UOM deleted successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to delete UOM');
      throw error;
    }
  },
  
  // Initialize data
  initializeData: async () => {
    // Initialize warehouses
    const existingWarehouses = await db.getCollection<Warehouse>(DB_COLLECTIONS.WAREHOUSES);
    if (existingWarehouses.length === 0) {
      for (const warehouse of mockWarehouses) {
        await db.addToCollection(DB_COLLECTIONS.WAREHOUSES, warehouse);
      }
    }
    
    // Initialize categories
    const existingCategories = await db.getCollection<Category>(DB_COLLECTIONS.CATEGORIES);
    if (existingCategories.length === 0) {
      for (const category of mockCategories) {
        await db.addToCollection(DB_COLLECTIONS.CATEGORIES, category);
      }
    }
    
    // Initialize UOMs
    const existingUOMs = await db.getCollection<UOM>(DB_COLLECTIONS.UOMS);
    if (existingUOMs.length === 0) {
      for (const uom of mockUOMs) {
        await db.addToCollection(DB_COLLECTIONS.UOMS, uom);
      }
    }
  },
}));
