import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
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
import { useOperationsStore } from '@/store/operationsStore';
import { useWarehousesStore } from '@/store/warehousesStore';

const Ledger = () => {
  const { stockMoves, loading, fetchStockMoves } = useOperationsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  useEffect(() => {
    fetchStockMoves({ type: typeFilter !== 'all' ? typeFilter : undefined });
    fetchWarehouses();
  }, [typeFilter]);

  const filteredMoves = stockMoves.filter((move) => {
    const matchesType = typeFilter === 'all' || move.type === typeFilter;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'receipt':
        return 'default';
      case 'delivery':
        return 'secondary';
      case 'transfer':
        return 'outline';
      case 'adjustment':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Move History</h1>
          <p className="text-muted-foreground mt-1">Complete history of all stock movements</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
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
            <CardTitle>Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredMoves.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No movements found</div>
            ) : (
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
                  {filteredMoves.map((move) => (
                    <TableRow key={move.id}>
                      <TableCell>
                        <Badge variant={getTypeColor(move.type)} className="capitalize">
                          {move.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{move.product}</TableCell>
                      <TableCell className="font-mono text-sm">{move.productSku}</TableCell>
                      <TableCell className="text-sm">
                        {move.fromLocation && `${move.fromLocation} → `}
                        {move.toLocation}
                      </TableCell>
                      <TableCell
                        className={
                          move.quantity < 0 ? 'text-red-600' : move.quantity > 0 ? 'text-green-600' : ''
                        }
                      >
                        {move.quantity > 0 ? '+' : ''}
                        {move.quantity}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{move.reference}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(move.status)}>{move.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(move.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Ledger;
