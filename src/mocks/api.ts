// Mock API functions to simulate server calls
import {
  Product,
  Warehouse,
  Category,
  UOM,
  Receipt,
  Delivery,
  Transfer,
  Adjustment,
  StockMove,
  mockProducts,
  mockWarehouses,
  mockCategories,
  mockUOMs,
  mockReceipts,
  mockDeliveries,
  mockTransfers,
  mockAdjustments,
  mockStockMoves,
} from './data';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    await delay(300);
    return [...mockProducts];
  },
  getById: async (id: string): Promise<Product | null> => {
    await delay(200);
    return mockProducts.find((p) => p.id === id) || null;
  },
  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(400);
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newProduct;
  },
  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await delay(400);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return { ...product, ...updates, updatedAt: new Date().toISOString() };
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
  },
  search: async (query: string): Promise<Product[]> => {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.name.toLowerCase().includes(lowerQuery)
    );
  },
};

// Warehouses API
export const warehousesAPI = {
  getAll: async (): Promise<Warehouse[]> => {
    await delay(300);
    return [...mockWarehouses];
  },
  getById: async (id: string): Promise<Warehouse | null> => {
    await delay(200);
    return mockWarehouses.find((w) => w.id === id) || null;
  },
  create: async (warehouse: Omit<Warehouse, 'id'>): Promise<Warehouse> => {
    await delay(400);
    return { ...warehouse, id: `wh-${Date.now()}` };
  },
  update: async (id: string, updates: Partial<Warehouse>): Promise<Warehouse> => {
    await delay(400);
    const warehouse = mockWarehouses.find((w) => w.id === id);
    if (!warehouse) throw new Error('Warehouse not found');
    return { ...warehouse, ...updates };
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    await delay(200);
    return [...mockCategories];
  },
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    await delay(300);
    return { ...category, id: `cat-${Date.now()}` };
  },
  update: async (id: string, updates: Partial<Category>): Promise<Category> => {
    await delay(300);
    const category = mockCategories.find((c) => c.id === id);
    if (!category) throw new Error('Category not found');
    return { ...category, ...updates };
  },
  delete: async (id: string): Promise<void> => {
    await delay(200);
  },
};

// UOM API
export const uomAPI = {
  getAll: async (): Promise<UOM[]> => {
    await delay(200);
    return [...mockUOMs];
  },
  create: async (uom: Omit<UOM, 'id'>): Promise<UOM> => {
    await delay(300);
    return { ...uom, id: `uom-${Date.now()}` };
  },
  update: async (id: string, updates: Partial<UOM>): Promise<UOM> => {
    await delay(300);
    const uom = mockUOMs.find((u) => u.id === id);
    if (!uom) throw new Error('UOM not found');
    return { ...uom, ...updates };
  },
  delete: async (id: string): Promise<void> => {
    await delay(200);
  },
};

// Receipts API
export const receiptsAPI = {
  getAll: async (): Promise<Receipt[]> => {
    await delay(300);
    return [...mockReceipts];
  },
  getById: async (id: string): Promise<Receipt | null> => {
    await delay(200);
    return mockReceipts.find((r) => r.id === id) || null;
  },
  create: async (receipt: Omit<Receipt, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Receipt> => {
    await delay(400);
    const newReceipt: Receipt = {
      ...receipt,
      id: `rec-${Date.now()}`,
      reference: `REC-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newReceipt;
  },
  update: async (id: string, updates: Partial<Receipt>): Promise<Receipt> => {
    await delay(400);
    const receipt = mockReceipts.find((r) => r.id === id);
    if (!receipt) throw new Error('Receipt not found');
    return { ...receipt, ...updates, updatedAt: new Date().toISOString() };
  },
  validate: async (id: string): Promise<void> => {
    await delay(500);
  },
};

// Deliveries API
export const deliveriesAPI = {
  getAll: async (): Promise<Delivery[]> => {
    await delay(300);
    return [...mockDeliveries];
  },
  getById: async (id: string): Promise<Delivery | null> => {
    await delay(200);
    return mockDeliveries.find((d) => d.id === id) || null;
  },
  create: async (delivery: Omit<Delivery, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Delivery> => {
    await delay(400);
    const newDelivery: Delivery = {
      ...delivery,
      id: `del-${Date.now()}`,
      reference: `DEL-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newDelivery;
  },
  update: async (id: string, updates: Partial<Delivery>): Promise<Delivery> => {
    await delay(400);
    const delivery = mockDeliveries.find((d) => d.id === id);
    if (!delivery) throw new Error('Delivery not found');
    return { ...delivery, ...updates, updatedAt: new Date().toISOString() };
  },
  validate: async (id: string): Promise<void> => {
    await delay(500);
  },
};

// Transfers API
export const transfersAPI = {
  getAll: async (): Promise<Transfer[]> => {
    await delay(300);
    return [...mockTransfers];
  },
  getById: async (id: string): Promise<Transfer | null> => {
    await delay(200);
    return mockTransfers.find((t) => t.id === id) || null;
  },
  create: async (transfer: Omit<Transfer, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Transfer> => {
    await delay(400);
    const newTransfer: Transfer = {
      ...transfer,
      id: `trf-${Date.now()}`,
      reference: `TRF-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newTransfer;
  },
  update: async (id: string, updates: Partial<Transfer>): Promise<Transfer> => {
    await delay(400);
    const transfer = mockTransfers.find((t) => t.id === id);
    if (!transfer) throw new Error('Transfer not found');
    return { ...transfer, ...updates, updatedAt: new Date().toISOString() };
  },
  validate: async (id: string): Promise<void> => {
    await delay(500);
  },
};

// Adjustments API
export const adjustmentsAPI = {
  getAll: async (): Promise<Adjustment[]> => {
    await delay(300);
    return [...mockAdjustments];
  },
  getById: async (id: string): Promise<Adjustment | null> => {
    await delay(200);
    return mockAdjustments.find((a) => a.id === id) || null;
  },
  create: async (adjustment: Omit<Adjustment, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Adjustment> => {
    await delay(400);
    const newAdjustment: Adjustment = {
      ...adjustment,
      id: `adj-${Date.now()}`,
      reference: `ADJ-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newAdjustment;
  },
  update: async (id: string, updates: Partial<Adjustment>): Promise<Adjustment> => {
    await delay(400);
    const adjustment = mockAdjustments.find((a) => a.id === id);
    if (!adjustment) throw new Error('Adjustment not found');
    return { ...adjustment, ...updates, updatedAt: new Date().toISOString() };
  },
  validate: async (id: string): Promise<void> => {
    await delay(500);
  },
};

// Stock Moves / Ledger API
export const stockMovesAPI = {
  getAll: async (filters?: {
    type?: string;
    status?: string;
    warehouse?: string;
    category?: string;
  }): Promise<StockMove[]> => {
    await delay(300);
    let moves = [...mockStockMoves];
    if (filters) {
      if (filters.type) moves = moves.filter((m) => m.type === filters.type);
      if (filters.status) moves = moves.filter((m) => m.status === filters.status);
      if (filters.warehouse) moves = moves.filter((m) => m.warehouse === filters.warehouse);
    }
    return moves;
  },
};

