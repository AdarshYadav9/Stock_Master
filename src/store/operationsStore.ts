import { create } from 'zustand';

export interface StockMove {
  id: string;
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  product: string;
  productSku: string;
  fromLocation?: string;
  toLocation: string;
  quantity: number;
  reference: string;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
  timestamp: string;
}

interface OperationsState {
  stockMoves: StockMove[];
  receipts: any[];
  deliveries: any[];
  transfers: any[];
  adjustments: any[];
  addStockMove: (move: StockMove) => void;
  updateStockMove: (id: string, move: Partial<StockMove>) => void;
}

export const useOperationsStore = create<OperationsState>((set) => ({
  stockMoves: [
    {
      id: '1',
      type: 'receipt',
      product: 'Widget A',
      productSku: 'SKU-001',
      toLocation: 'Main Warehouse / A-01-01',
      quantity: 50,
      reference: 'RCP-001',
      status: 'done',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'delivery',
      product: 'Gadget B',
      productSku: 'SKU-002',
      fromLocation: 'Main Warehouse / A-01-02',
      toLocation: 'Customer Location',
      quantity: 10,
      reference: 'DEL-001',
      status: 'ready',
      timestamp: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'transfer',
      product: 'Widget A',
      productSku: 'SKU-001',
      fromLocation: 'Main Warehouse / A-01-01',
      toLocation: 'Secondary Warehouse / B-02-03',
      quantity: 25,
      reference: 'TRF-001',
      status: 'waiting',
      timestamp: new Date().toISOString(),
    },
  ],
  receipts: [],
  deliveries: [],
  transfers: [],
  adjustments: [],
  addStockMove: (move) =>
    set((state) => ({ stockMoves: [...state.stockMoves, move] })),
  updateStockMove: (id, updatedMove) =>
    set((state) => ({
      stockMoves: state.stockMoves.map((m) =>
        m.id === id ? { ...m, ...updatedMove } : m
      ),
    })),
}));
