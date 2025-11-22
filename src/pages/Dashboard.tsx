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

const Dashboard = () => {
  const products = useProductsStore((state) => state.products);
  const stockMoves = useOperationsStore((state) => state.stockMoves);

  const totalStock = products.reduce((acc, product) => {
    return acc + product.stock.reduce((sum, s) => sum + s.quantity, 0);
  }, 0);

  const lowStockItems = products.filter((product) => {
    const total = product.stock.reduce((sum, s) => sum + s.quantity, 0);
    return total < product.reorderPoint;
  }).length;

  const pendingReceipts = stockMoves.filter((m) => m.type === 'receipt' && m.status !== 'done').length;
  const pendingDeliveries = stockMoves.filter((m) => m.type === 'delivery' && m.status !== 'done').length;
  const pendingTransfers = stockMoves.filter((m) => m.type === 'transfer' && m.status !== 'done').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-success text-success-foreground';
      case 'ready':
        return 'bg-primary text-primary-foreground';
      case 'waiting':
        return 'bg-warning text-warning-foreground';
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'canceled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
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
                {stockMoves.slice(0, 10).map((move) => (
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
                      <Badge className={getStatusColor(move.status)}>
                        {move.status}
                      </Badge>
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
