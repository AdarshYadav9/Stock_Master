import { create } from 'zustand';
import {
  Receipt,
  Delivery,
  Transfer,
  Adjustment,
  StockMove,
  mockReceipts,
  mockDeliveries,
  mockTransfers,
  mockAdjustments,
  mockStockMoves,
} from '@/mocks/data';
import { db, DB_COLLECTIONS } from '@/lib/database';
import { toast } from 'sonner';

interface OperationsState {
  receipts: Receipt[];
  deliveries: Delivery[];
  transfers: Transfer[];
  adjustments: Adjustment[];
  stockMoves: StockMove[];
  loading: boolean;
  error: string | null;
  
  // Receipts
  fetchReceipts: () => Promise<void>;
  getReceiptById: (id: string) => Receipt | undefined;
  createReceipt: (receipt: Omit<Receipt, 'id' | 'reference' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReceipt: (id: string, updates: Partial<Receipt>) => Promise<void>;
  validateReceipt: (id: string) => Promise<void>;
  
  // Deliveries
  fetchDeliveries: () => Promise<void>;
  getDeliveryById: (id: string) => Delivery | undefined;
  createDelivery: (delivery: Omit<Delivery, 'id' | 'reference' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDelivery: (id: string, updates: Partial<Delivery>) => Promise<void>;
  validateDelivery: (id: string) => Promise<void>;
  
  // Transfers
  fetchTransfers: () => Promise<void>;
  getTransferById: (id: string) => Transfer | undefined;
  createTransfer: (transfer: Omit<Transfer, 'id' | 'reference' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransfer: (id: string, updates: Partial<Transfer>) => Promise<void>;
  validateTransfer: (id: string) => Promise<void>;
  
  // Adjustments
  fetchAdjustments: () => Promise<void>;
  getAdjustmentById: (id: string) => Adjustment | undefined;
  createAdjustment: (adjustment: Omit<Adjustment, 'id' | 'reference' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAdjustment: (id: string, updates: Partial<Adjustment>) => Promise<void>;
  validateAdjustment: (id: string) => Promise<void>;
  
  // Stock Moves / Ledger
  fetchStockMoves: (filters?: {
    type?: string;
    status?: string;
    warehouse?: string;
    category?: string;
  }) => Promise<void>;
  
  // Initialize data
  initializeData: () => Promise<void>;
}

export const useOperationsStore = create<OperationsState>((set, get) => ({
  receipts: [],
  deliveries: [],
  transfers: [],
  adjustments: [],
  stockMoves: [],
  loading: false,
  error: null,
  
  // Receipts
  fetchReceipts: async () => {
    set({ loading: true, error: null });
    try {
      const receipts = await db.getCollection<Receipt>(DB_COLLECTIONS.RECEIPTS);
      if (receipts.length === 0) {
        await get().initializeData();
        const initializedReceipts = await db.getCollection<Receipt>(DB_COLLECTIONS.RECEIPTS);
        set({ receipts: initializedReceipts, loading: false });
      } else {
        set({ receipts, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getReceiptById: (id: string) => {
    return get().receipts.find((r) => r.id === id);
  },
  createReceipt: async (receipt) => {
    set({ loading: true, error: null });
    try {
      const newReceipt: Receipt = {
        ...receipt,
        id: `rec-${Date.now()}`,
        reference: `REC-${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.addToCollection(DB_COLLECTIONS.RECEIPTS, newReceipt);
      set((state) => ({ receipts: [...state.receipts, newReceipt], loading: false }));
      toast.success('Receipt created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create receipt');
      throw error;
    }
  },
  updateReceipt: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedReceipt = await db.updateInCollection<Receipt>(
        DB_COLLECTIONS.RECEIPTS,
        id,
        { ...updates, updatedAt: new Date().toISOString() }
      );
      if (!updatedReceipt) {
        throw new Error('Receipt not found');
      }
      set((state) => ({
        receipts: state.receipts.map((r) => (r.id === id ? updatedReceipt : r)),
        loading: false,
      }));
      toast.success('Receipt updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update receipt');
      throw error;
    }
  },
  validateReceipt: async (id) => {
    set({ loading: true, error: null });
    try {
      const receipt = get().getReceiptById(id);
      if (!receipt) throw new Error('Receipt not found');
      
      // Update status to done
      await get().updateReceipt(id, { status: 'done' });
      
      // Create stock moves for each item
      for (const item of receipt.items) {
        const stockMove: StockMove = {
          id: `move-${Date.now()}-${Math.random()}`,
          type: 'receipt',
          status: 'done',
          reference: receipt.reference,
          product: item.productName,
          productSku: item.productSku,
          toLocation: item.location,
          quantity: item.receivedQty,
          timestamp: new Date().toISOString(),
          warehouse: receipt.warehouse,
          userId: receipt.userId,
        };
        await db.addToCollection(DB_COLLECTIONS.STOCK_MOVES, stockMove);
      }
      
      await get().fetchStockMoves();
      set({ loading: false });
      toast.success('Receipt validated and stock updated');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to validate receipt');
      throw error;
    }
  },
  
  // Deliveries
  fetchDeliveries: async () => {
    set({ loading: true, error: null });
    try {
      const deliveries = await db.getCollection<Delivery>(DB_COLLECTIONS.DELIVERIES);
      if (deliveries.length === 0) {
        await get().initializeData();
        const initializedDeliveries = await db.getCollection<Delivery>(DB_COLLECTIONS.DELIVERIES);
        set({ deliveries: initializedDeliveries, loading: false });
      } else {
        set({ deliveries, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getDeliveryById: (id: string) => {
    return get().deliveries.find((d) => d.id === id);
  },
  createDelivery: async (delivery) => {
    set({ loading: true, error: null });
    try {
      const newDelivery: Delivery = {
        ...delivery,
        id: `del-${Date.now()}`,
        reference: `DEL-${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.addToCollection(DB_COLLECTIONS.DELIVERIES, newDelivery);
      set((state) => ({ deliveries: [...state.deliveries, newDelivery], loading: false }));
      toast.success('Delivery created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create delivery');
      throw error;
    }
  },
  updateDelivery: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedDelivery = await db.updateInCollection<Delivery>(
        DB_COLLECTIONS.DELIVERIES,
        id,
        { ...updates, updatedAt: new Date().toISOString() }
      );
      if (!updatedDelivery) {
        throw new Error('Delivery not found');
      }
      set((state) => ({
        deliveries: state.deliveries.map((d) => (d.id === id ? updatedDelivery : d)),
        loading: false,
      }));
      toast.success('Delivery updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update delivery');
      throw error;
    }
  },
  validateDelivery: async (id) => {
    set({ loading: true, error: null });
    try {
      const delivery = get().getDeliveryById(id);
      if (!delivery) throw new Error('Delivery not found');
      
      await get().updateDelivery(id, { status: 'done' });
      
      // Create stock moves
      for (const item of delivery.items) {
        const stockMove: StockMove = {
          id: `move-${Date.now()}-${Math.random()}`,
          type: 'delivery',
          status: 'done',
          reference: delivery.reference,
          product: item.productName,
          productSku: item.productSku,
          fromLocation: item.location,
          toLocation: 'OUT',
          quantity: -item.packedQty,
          timestamp: new Date().toISOString(),
          warehouse: delivery.warehouse,
          userId: delivery.userId,
        };
        await db.addToCollection(DB_COLLECTIONS.STOCK_MOVES, stockMove);
      }
      
      await get().fetchStockMoves();
      set({ loading: false });
      toast.success('Delivery validated and stock updated');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to validate delivery');
      throw error;
    }
  },
  
  // Transfers
  fetchTransfers: async () => {
    set({ loading: true, error: null });
    try {
      const transfers = await db.getCollection<Transfer>(DB_COLLECTIONS.TRANSFERS);
      if (transfers.length === 0) {
        await get().initializeData();
        const initializedTransfers = await db.getCollection<Transfer>(DB_COLLECTIONS.TRANSFERS);
        set({ transfers: initializedTransfers, loading: false });
      } else {
        set({ transfers, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getTransferById: (id: string) => {
    return get().transfers.find((t) => t.id === id);
  },
  createTransfer: async (transfer) => {
    set({ loading: true, error: null });
    try {
      const newTransfer: Transfer = {
        ...transfer,
        id: `trf-${Date.now()}`,
        reference: `TRF-${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.addToCollection(DB_COLLECTIONS.TRANSFERS, newTransfer);
      set((state) => ({ transfers: [...state.transfers, newTransfer], loading: false }));
      toast.success('Transfer created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create transfer');
      throw error;
    }
  },
  updateTransfer: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedTransfer = await db.updateInCollection<Transfer>(
        DB_COLLECTIONS.TRANSFERS,
        id,
        { ...updates, updatedAt: new Date().toISOString() }
      );
      if (!updatedTransfer) {
        throw new Error('Transfer not found');
      }
      set((state) => ({
        transfers: state.transfers.map((t) => (t.id === id ? updatedTransfer : t)),
        loading: false,
      }));
      toast.success('Transfer updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update transfer');
      throw error;
    }
  },
  validateTransfer: async (id) => {
    set({ loading: true, error: null });
    try {
      const transfer = get().getTransferById(id);
      if (!transfer) throw new Error('Transfer not found');
      
      await get().updateTransfer(id, { status: 'done' });
      
      // Create stock moves
      for (const item of transfer.items) {
        const stockMove: StockMove = {
          id: `move-${Date.now()}-${Math.random()}`,
          type: 'transfer',
          status: 'done',
          reference: transfer.reference,
          product: item.productName,
          productSku: item.productSku,
          fromLocation: item.fromLocation,
          toLocation: item.toLocation,
          quantity: item.quantity,
          timestamp: new Date().toISOString(),
          warehouse: transfer.fromWarehouse,
          userId: transfer.userId,
        };
        await db.addToCollection(DB_COLLECTIONS.STOCK_MOVES, stockMove);
      }
      
      await get().fetchStockMoves();
      set({ loading: false });
      toast.success('Transfer validated and stock updated');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to validate transfer');
      throw error;
    }
  },
  
  // Adjustments
  fetchAdjustments: async () => {
    set({ loading: true, error: null });
    try {
      const adjustments = await db.getCollection<Adjustment>(DB_COLLECTIONS.ADJUSTMENTS);
      if (adjustments.length === 0) {
        await get().initializeData();
        const initializedAdjustments = await db.getCollection<Adjustment>(DB_COLLECTIONS.ADJUSTMENTS);
        set({ adjustments: initializedAdjustments, loading: false });
      } else {
        set({ adjustments, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getAdjustmentById: (id: string) => {
    return get().adjustments.find((a) => a.id === id);
  },
  createAdjustment: async (adjustment) => {
    set({ loading: true, error: null });
    try {
      const newAdjustment: Adjustment = {
        ...adjustment,
        id: `adj-${Date.now()}`,
        reference: `ADJ-${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.addToCollection(DB_COLLECTIONS.ADJUSTMENTS, newAdjustment);
      set((state) => ({ adjustments: [...state.adjustments, newAdjustment], loading: false }));
      toast.success('Adjustment created successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to create adjustment');
      throw error;
    }
  },
  updateAdjustment: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedAdjustment = await db.updateInCollection<Adjustment>(
        DB_COLLECTIONS.ADJUSTMENTS,
        id,
        { ...updates, updatedAt: new Date().toISOString() }
      );
      if (!updatedAdjustment) {
        throw new Error('Adjustment not found');
      }
      set((state) => ({
        adjustments: state.adjustments.map((a) => (a.id === id ? updatedAdjustment : a)),
        loading: false,
      }));
      toast.success('Adjustment updated successfully');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to update adjustment');
      throw error;
    }
  },
  validateAdjustment: async (id) => {
    set({ loading: true, error: null });
    try {
      const adjustment = get().getAdjustmentById(id);
      if (!adjustment) throw new Error('Adjustment not found');
      
      await get().updateAdjustment(id, { status: 'done' });
      
      // Create stock moves
      for (const item of adjustment.items) {
        const stockMove: StockMove = {
          id: `move-${Date.now()}-${Math.random()}`,
          type: 'adjustment',
          status: 'done',
          reference: adjustment.reference,
          product: item.productName,
          productSku: item.productSku,
          toLocation: item.location,
          quantity: item.difference,
          timestamp: new Date().toISOString(),
          warehouse: adjustment.warehouse,
          userId: adjustment.userId,
          notes: adjustment.reason,
        };
        await db.addToCollection(DB_COLLECTIONS.STOCK_MOVES, stockMove);
      }
      
      await get().fetchStockMoves();
      set({ loading: false });
      toast.success('Adjustment validated and stock updated');
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      toast.error('Failed to validate adjustment');
      throw error;
    }
  },
  
  // Stock Moves
  fetchStockMoves: async (filters) => {
    set({ loading: true, error: null });
    try {
      let moves = await db.getCollection<StockMove>(DB_COLLECTIONS.STOCK_MOVES);
      if (moves.length === 0) {
        await get().initializeData();
        moves = await db.getCollection<StockMove>(DB_COLLECTIONS.STOCK_MOVES);
      }
      
      if (filters) {
        if (filters.type) moves = moves.filter((m) => m.type === filters.type);
        if (filters.status) moves = moves.filter((m) => m.status === filters.status);
        if (filters.warehouse) moves = moves.filter((m) => m.warehouse === filters.warehouse);
      }
      
      set({ stockMoves: moves, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  // Initialize data
  initializeData: async () => {
    // Initialize receipts
    const existingReceipts = await db.getCollection<Receipt>(DB_COLLECTIONS.RECEIPTS);
    if (existingReceipts.length === 0) {
      for (const receipt of mockReceipts) {
        await db.addToCollection(DB_COLLECTIONS.RECEIPTS, receipt);
      }
    }
    
    // Initialize deliveries
    const existingDeliveries = await db.getCollection<Delivery>(DB_COLLECTIONS.DELIVERIES);
    if (existingDeliveries.length === 0) {
      for (const delivery of mockDeliveries) {
        await db.addToCollection(DB_COLLECTIONS.DELIVERIES, delivery);
      }
    }
    
    // Initialize transfers
    const existingTransfers = await db.getCollection<Transfer>(DB_COLLECTIONS.TRANSFERS);
    if (existingTransfers.length === 0) {
      for (const transfer of mockTransfers) {
        await db.addToCollection(DB_COLLECTIONS.TRANSFERS, transfer);
      }
    }
    
    // Initialize adjustments
    const existingAdjustments = await db.getCollection<Adjustment>(DB_COLLECTIONS.ADJUSTMENTS);
    if (existingAdjustments.length === 0) {
      for (const adjustment of mockAdjustments) {
        await db.addToCollection(DB_COLLECTIONS.ADJUSTMENTS, adjustment);
      }
    }
    
    // Initialize stock moves
    const existingMoves = await db.getCollection<StockMove>(DB_COLLECTIONS.STOCK_MOVES);
    if (existingMoves.length === 0) {
      for (const move of mockStockMoves) {
        await db.addToCollection(DB_COLLECTIONS.STOCK_MOVES, move);
      }
    }
  },
}));
