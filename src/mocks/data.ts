// Mock data for StockMaster IMS

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  capacity: number;
  locations: Location[];
}

export interface Location {
  id: string;
  code: string;
  name: string;
  type: 'rack' | 'bin' | 'shelf' | 'zone';
  capacity?: number;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  parentId?: string;
}

export interface UOM {
  id: string;
  name: string;
  code: string;
  type: 'unit' | 'weight' | 'volume' | 'length';
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  uom: string;
  reorderPoint: number;
  reorderQuantity: number;
  stock: StockLevel[];
  createdAt: string;
  updatedAt: string;
}

export interface StockLevel {
  warehouse: string;
  location: string;
  quantity: number;
  reserved: number;
}

export interface StockMove {
  id: string;
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
  reference: string;
  product: string;
  productSku: string;
  fromLocation?: string;
  toLocation: string;
  quantity: number;
  timestamp: string;
  warehouse: string;
  userId: string;
  notes?: string;
}

export interface Receipt {
  id: string;
  reference: string;
  supplier: string;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
  warehouse: string;
  items: ReceiptItem[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ReceiptItem {
  productId: string;
  productSku: string;
  productName: string;
  expectedQty: number;
  receivedQty: number;
  location: string;
  uom: string;
}

export interface Delivery {
  id: string;
  reference: string;
  customer: string;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
  warehouse: string;
  items: DeliveryItem[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DeliveryItem {
  productId: string;
  productSku: string;
  productName: string;
  requestedQty: number;
  pickedQty: number;
  packedQty: number;
  location: string;
  uom: string;
}

export interface Transfer {
  id: string;
  reference: string;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
  fromWarehouse: string;
  toWarehouse: string;
  items: TransferItem[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TransferItem {
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  uom: string;
}

export interface Adjustment {
  id: string;
  reference: string;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
  warehouse: string;
  reason: string;
  items: AdjustmentItem[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AdjustmentItem {
  productId: string;
  productSku: string;
  productName: string;
  location: string;
  systemQty: number;
  countedQty: number;
  difference: number;
  uom: string;
}

// Seed Data
export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'Main Warehouse',
    code: 'WH-MAIN',
    address: '123 Industrial Ave, City, State 12345',
    capacity: 10000,
    locations: [
      { id: 'loc-1', code: 'A-01-01', name: 'Rack A-01, Shelf 01', type: 'rack' },
      { id: 'loc-2', code: 'A-01-02', name: 'Rack A-01, Shelf 02', type: 'rack' },
      { id: 'loc-3', code: 'A-02-01', name: 'Rack A-02, Shelf 01', type: 'rack' },
      { id: 'loc-4', code: 'B-01-01', name: 'Bin B-01-01', type: 'bin' },
      { id: 'loc-5', code: 'B-02-03', name: 'Bin B-02-03', type: 'bin' },
    ],
  },
  {
    id: 'wh-2',
    name: 'Secondary Warehouse',
    code: 'WH-SEC',
    address: '456 Commerce Blvd, City, State 12345',
    capacity: 5000,
    locations: [
      { id: 'loc-6', code: 'C-01-01', name: 'Zone C-01', type: 'zone' },
      { id: 'loc-7', code: 'C-02-01', name: 'Zone C-02', type: 'zone' },
    ],
  },
  {
    id: 'wh-3',
    name: 'Distribution Center',
    code: 'WH-DC',
    address: '789 Logistics Way, City, State 12345',
    capacity: 15000,
    locations: [
      { id: 'loc-8', code: 'D-01-01', name: 'Rack D-01', type: 'rack' },
      { id: 'loc-9', code: 'D-02-01', name: 'Rack D-02', type: 'rack' },
    ],
  },
];

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Electronics', code: 'ELEC' },
  { id: 'cat-2', name: 'Parts', code: 'PART' },
  { id: 'cat-3', name: 'Raw Materials', code: 'RAW' },
  { id: 'cat-4', name: 'Finished Goods', code: 'FG' },
  { id: 'cat-5', name: 'Packaging', code: 'PKG' },
];

export const mockUOMs: UOM[] = [
  { id: 'uom-1', name: 'Piece', code: 'pcs', type: 'unit' },
  { id: 'uom-2', name: 'Kilogram', code: 'kg', type: 'weight' },
  { id: 'uom-3', name: 'Gram', code: 'g', type: 'weight' },
  { id: 'uom-4', name: 'Liter', code: 'L', type: 'volume' },
  { id: 'uom-5', name: 'Meter', code: 'm', type: 'length' },
  { id: 'uom-6', name: 'Box', code: 'box', type: 'unit' },
  { id: 'uom-7', name: 'Pallet', code: 'pallet', type: 'unit' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Widget A',
    description: 'High-quality widget for industrial use',
    category: 'cat-1',
    uom: 'uom-1',
    reorderPoint: 50,
    reorderQuantity: 200,
    stock: [
      { warehouse: 'wh-1', location: 'A-01-01', quantity: 120, reserved: 10 },
      { warehouse: 'wh-2', location: 'C-01-01', quantity: 45, reserved: 5 },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'prod-2',
    sku: 'SKU-002',
    name: 'Gadget B',
    description: 'Premium gadget with advanced features',
    category: 'cat-1',
    uom: 'uom-1',
    reorderPoint: 30,
    reorderQuantity: 100,
    stock: [
      { warehouse: 'wh-1', location: 'A-01-02', quantity: 25, reserved: 0 },
    ],
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
  },
  {
    id: 'prod-3',
    sku: 'SKU-003',
    name: 'Component C',
    description: 'Essential component for assembly',
    category: 'cat-2',
    uom: 'uom-1',
    reorderPoint: 100,
    reorderQuantity: 500,
    stock: [
      { warehouse: 'wh-1', location: 'A-02-01', quantity: 200, reserved: 20 },
      { warehouse: 'wh-3', location: 'D-01-01', quantity: 150, reserved: 15 },
    ],
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-22T10:45:00Z',
  },
  {
    id: 'prod-4',
    sku: 'SKU-004',
    name: 'Material D',
    description: 'Raw material for production',
    category: 'cat-3',
    uom: 'uom-2',
    reorderPoint: 500,
    reorderQuantity: 2000,
    stock: [
      { warehouse: 'wh-1', location: 'B-01-01', quantity: 800, reserved: 50 },
    ],
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-23T11:30:00Z',
  },
  {
    id: 'prod-5',
    sku: 'SKU-005',
    name: 'Product E',
    description: 'Finished product ready for sale',
    category: 'cat-4',
    uom: 'uom-1',
    reorderPoint: 75,
    reorderQuantity: 300,
    stock: [
      { warehouse: 'wh-2', location: 'C-02-01', quantity: 90, reserved: 15 },
      { warehouse: 'wh-3', location: 'D-02-01', quantity: 60, reserved: 10 },
    ],
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-24T12:00:00Z',
  },
];

export const mockStockMoves: StockMove[] = [
  {
    id: 'move-1',
    type: 'receipt',
    status: 'done',
    reference: 'REC-001',
    product: 'Widget A',
    productSku: 'SKU-001',
    toLocation: 'A-01-01',
    quantity: 50,
    timestamp: '2024-01-20T10:00:00Z',
    warehouse: 'wh-1',
    userId: 'user-1',
  },
  {
    id: 'move-2',
    type: 'delivery',
    status: 'ready',
    reference: 'DEL-001',
    product: 'Gadget B',
    productSku: 'SKU-002',
    fromLocation: 'A-01-02',
    toLocation: 'OUT',
    quantity: 10,
    timestamp: '2024-01-21T09:00:00Z',
    warehouse: 'wh-1',
    userId: 'user-1',
  },
  {
    id: 'move-3',
    type: 'transfer',
    status: 'waiting',
    reference: 'TRF-001',
    product: 'Component C',
    productSku: 'SKU-003',
    fromLocation: 'A-02-01',
    toLocation: 'D-01-01',
    quantity: 25,
    timestamp: '2024-01-22T08:00:00Z',
    warehouse: 'wh-1',
    userId: 'user-1',
  },
  {
    id: 'move-4',
    type: 'adjustment',
    status: 'done',
    reference: 'ADJ-001',
    product: 'Material D',
    productSku: 'SKU-004',
    toLocation: 'B-01-01',
    quantity: -5,
    timestamp: '2024-01-23T11:00:00Z',
    warehouse: 'wh-1',
    userId: 'user-1',
    notes: 'Damaged items removed',
  },
];

export const mockReceipts: Receipt[] = [
  {
    id: 'rec-1',
    reference: 'REC-001',
    supplier: 'Supplier A',
    status: 'done',
    warehouse: 'wh-1',
    items: [
      {
        productId: 'prod-1',
        productSku: 'SKU-001',
        productName: 'Widget A',
        expectedQty: 50,
        receivedQty: 50,
        location: 'A-01-01',
        uom: 'pcs',
      },
    ],
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    userId: 'user-1',
  },
  {
    id: 'rec-2',
    reference: 'REC-002',
    supplier: 'Supplier B',
    status: 'waiting',
    warehouse: 'wh-1',
    items: [
      {
        productId: 'prod-2',
        productSku: 'SKU-002',
        productName: 'Gadget B',
        expectedQty: 100,
        receivedQty: 0,
        location: 'A-01-02',
        uom: 'pcs',
      },
    ],
    createdAt: '2024-01-21T08:00:00Z',
    updatedAt: '2024-01-21T08:00:00Z',
    userId: 'user-1',
  },
];

export const mockDeliveries: Delivery[] = [
  {
    id: 'del-1',
    reference: 'DEL-001',
    customer: 'Customer X',
    status: 'ready',
    warehouse: 'wh-1',
    items: [
      {
        productId: 'prod-2',
        productSku: 'SKU-002',
        productName: 'Gadget B',
        requestedQty: 10,
        pickedQty: 10,
        packedQty: 0,
        location: 'A-01-02',
        uom: 'pcs',
      },
    ],
    createdAt: '2024-01-21T08:00:00Z',
    updatedAt: '2024-01-21T09:00:00Z',
    userId: 'user-1',
  },
];

export const mockTransfers: Transfer[] = [
  {
    id: 'trf-1',
    reference: 'TRF-001',
    status: 'waiting',
    fromWarehouse: 'wh-1',
    toWarehouse: 'wh-3',
    items: [
      {
        productId: 'prod-3',
        productSku: 'SKU-003',
        productName: 'Component C',
        quantity: 25,
        fromLocation: 'A-02-01',
        toLocation: 'D-01-01',
        uom: 'pcs',
      },
    ],
    createdAt: '2024-01-22T08:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z',
    userId: 'user-1',
  },
];

export const mockAdjustments: Adjustment[] = [
  {
    id: 'adj-1',
    reference: 'ADJ-001',
    status: 'done',
    warehouse: 'wh-1',
    reason: 'Damaged items',
    items: [
      {
        productId: 'prod-4',
        productSku: 'SKU-004',
        productName: 'Material D',
        location: 'B-01-01',
        systemQty: 805,
        countedQty: 800,
        difference: -5,
        uom: 'kg',
      },
    ],
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T11:00:00Z',
    userId: 'user-1',
  },
];

