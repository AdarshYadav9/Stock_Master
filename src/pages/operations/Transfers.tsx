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
import { Plus, Eye } from 'lucide-react';
import { useOperationsStore } from '@/store/operationsStore';
import { useWarehousesStore } from '@/store/warehousesStore';

const Transfers = () => {
  const navigate = useNavigate();
  const { transfers, loading, fetchTransfers } = useOperationsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransfers();
    fetchWarehouses();
  }, []);

  const filteredTransfers = transfers.filter((transfer) => {
    return statusFilter === 'all' || transfer.status === statusFilter;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Internal Transfers</h1>
            <p className="text-muted-foreground mt-1">Manage stock transfers between locations</p>
          </div>
          <Button onClick={() => navigate('/operations/transfers/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transfers List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredTransfers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No transfers found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>From Warehouse</TableHead>
                    <TableHead>To Warehouse</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono font-medium">{transfer.reference}</TableCell>
                      <TableCell>
                        {warehouses.find((w) => w.id === transfer.fromWarehouse)?.name ||
                          transfer.fromWarehouse}
                      </TableCell>
                      <TableCell>
                        {warehouses.find((w) => w.id === transfer.toWarehouse)?.name ||
                          transfer.toWarehouse}
                      </TableCell>
                      <TableCell>{transfer.items.length} items</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(transfer.status)}>{transfer.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(transfer.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/operations/transfers/${transfer.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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

export default Transfers;

