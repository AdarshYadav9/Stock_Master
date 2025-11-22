import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { KpiCard } from '@/components/KpiCard';
import { Package, AlertTriangle, FileText, TruckIcon, ArrowLeftRight } from 'lucide-react';
import { useProductsStore } from '@/store/productsStore';
import { useOperationsStore } from '@/store/operationsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWarehousesStore } from '@/store/warehousesStore';

const Dashboard = () => {
  const { products, fetchProducts } = useProductsStore();
  const { stockMoves, fetchStockMoves } = useOperationsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
    fetchStockMoves();
    fetchWarehouses();
  }, []);

  const totalStock = products.reduce((acc, product) => {
    return acc + product.stock.reduce((sum, s) => sum + s.quantity, 0);
  }, 0);

  const lowStockItems = products.filter((product) => {
    const total = product.stock.reduce((sum, s) => sum + s.quantity, 0);
    return total < product.reorderPoint;
  }).length;

  const pendingReceipts = stockMoves.filter(
    (m) => m.type === 'receipt' && m.status !== 'done' && m.status !== 'canceled'
  ).length;
  const pendingDeliveries = stockMoves.filter(
    (m) => m.type === 'delivery' && m.status !== 'done' && m.status !== 'canceled'
  ).length;
  const pendingTransfers = stockMoves.filter(
    (m) => m.type === 'transfer' && m.status !== 'done' && m.status !== 'canceled'
  ).length;

  const filteredMoves = stockMoves.filter((move) => {
    const matchesType = documentTypeFilter === 'all' || move.type === documentTypeFilter;
    const matchesStatus = statusFilter === 'all' || move.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'all' || move.warehouse === warehouseFilter;
    return matchesType && matchesStatus && matchesWarehouse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'default';
      case 'ready':
        return 'default';
      case 'waiting':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'canceled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your inventory system</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            title="Total Products in Stock"
            value={totalStock}
            icon={Package}
            trend={{ value: 12, positive: true }}
          />
          <KpiCard
            title="Low Stock Items"
            value={lowStockItems}
            icon={AlertTriangle}
            className="border-warning/50"
          />
          <KpiCard
            title="Pending Receipts"
            value={pendingReceipts}
            icon={FileText}
          />
          <KpiCard
            title="Pending Deliveries"
            value={pendingDeliveries}
            icon={TruckIcon}
          />
          <KpiCard
            title="Pending Transfers"
            value={pendingTransfers}
            icon={ArrowLeftRight}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="receipt">Receipts</SelectItem>
                  <SelectItem value="delivery">Deliveries</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                  <SelectItem value="adjustment">Adjustments</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMoves.slice(0, 10).map((move) => (
                  <TableRow key={move.id}>
                    <TableCell className="font-medium capitalize">{move.type}</TableCell>
                    <TableCell>{move.product}</TableCell>
                    <TableCell className="text-muted-foreground">{move.productSku}</TableCell>
                    <TableCell className="text-sm">
                      {move.fromLocation && `${move.fromLocation} → `}
                      {move.toLocation}
                    </TableCell>
                    <TableCell>{move.quantity}</TableCell>
                    <TableCell className="font-mono text-sm">{move.reference}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(move.status)}>{move.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(move.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
