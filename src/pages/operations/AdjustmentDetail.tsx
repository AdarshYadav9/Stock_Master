import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
import { ArrowLeft } from 'lucide-react';
import { useOperationsStore } from '@/store/operationsStore';
import { useWarehousesStore } from '@/store/warehousesStore';

const AdjustmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAdjustmentById, fetchAdjustments } = useOperationsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();

  useEffect(() => {
    fetchAdjustments();
    fetchWarehouses();
  }, []);

  const adjustment = id ? getAdjustmentById(id) : undefined;

  if (!adjustment) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Adjustment not found</p>
          <Button onClick={() => navigate('/operations/adjustments')} className="mt-4">
            Back to Adjustments
          </Button>
        </div>
      </Layout>
    );
  }

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/operations/adjustments')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{adjustment.reference}</h1>
            <p className="text-muted-foreground mt-1">Adjustment Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reference</label>
                <p className="font-mono">{adjustment.reference}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Warehouse</label>
                <p>
                  {warehouses.find((w) => w.id === adjustment.warehouse)?.name ||
                    adjustment.warehouse}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reason</label>
                <p>{adjustment.reason}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(adjustment.status)}>{adjustment.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>System Qty</TableHead>
                  <TableHead>Counted Qty</TableHead>
                  <TableHead>Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustment.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-mono">{item.productSku}</TableCell>
                    <TableCell className="font-mono">{item.location}</TableCell>
                    <TableCell>{item.systemQty}</TableCell>
                    <TableCell>{item.countedQty}</TableCell>
                    <TableCell
                      className={
                        item.difference !== 0
                          ? item.difference > 0
                            ? 'text-green-600 font-medium'
                            : 'text-red-600 font-medium'
                          : ''
                      }
                    >
                      {item.difference > 0 ? '+' : ''}
                      {item.difference}
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

export default AdjustmentDetail;

