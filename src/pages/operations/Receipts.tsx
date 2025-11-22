import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
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
import { Plus, Eye, CheckCircle } from 'lucide-react';
import { useOperationsStore } from '@/store/operationsStore';
import { useWarehousesStore } from '@/store/warehousesStore';
import { toast } from 'sonner';

const Receipts = () => {
  const navigate = useNavigate();
  const { receipts, loading, fetchReceipts, validateReceipt } = useOperationsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  useEffect(() => {
    fetchReceipts();
    fetchWarehouses();
  }, []);

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'all' || receipt.warehouse === warehouseFilter;
    return matchesStatus && matchesWarehouse;
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

  const handleValidate = async (id: string) => {
    try {
      await validateReceipt(id);
      toast.success('Receipt validated and stock updated');
    } catch (error) {
      toast.error('Failed to validate receipt');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
            <p className="text-muted-foreground mt-1">Manage incoming stock receipts</p>
          </div>
          <Button onClick={() => navigate('/operations/receipts/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Receipt
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
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
            <CardTitle>Receipts List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredReceipts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No receipts found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-mono font-medium">{receipt.reference}</TableCell>
                      <TableCell>{receipt.supplier}</TableCell>
                      <TableCell>
                        {warehouses.find((w) => w.id === receipt.warehouse)?.name || receipt.warehouse}
                      </TableCell>
                      <TableCell>{receipt.items.length} items</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(receipt.status)}>{receipt.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(receipt.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {receipt.status === 'ready' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleValidate(receipt.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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

export default Receipts;
