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
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useOperationsStore } from '@/store/operationsStore';
import { useWarehousesStore } from '@/store/warehousesStore';
import { toast } from 'sonner';

const ReceiptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReceiptById, fetchReceipts, validateReceipt } = useOperationsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();

  useEffect(() => {
    fetchReceipts();
    fetchWarehouses();
  }, []);

  const receipt = id ? getReceiptById(id) : undefined;

  if (!receipt) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Receipt not found</p>
          <Button onClick={() => navigate('/operations/receipts')} className="mt-4">
            Back to Receipts
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

  const handleValidate = async () => {
    try {
      await validateReceipt(receipt.id);
      toast.success('Receipt validated and stock updated');
    } catch (error) {
      toast.error('Failed to validate receipt');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/operations/receipts')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{receipt.reference}</h1>
              <p className="text-muted-foreground mt-1">Receipt Details</p>
            </div>
          </div>
          {receipt.status === 'ready' && (
            <Button onClick={handleValidate}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Validate & Update Stock
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reference</label>
                <p className="font-mono">{receipt.reference}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Supplier</label>
                <p>{receipt.supplier}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Warehouse</label>
                <p>{warehouses.find((w) => w.id === receipt.warehouse)?.name || receipt.warehouse}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(receipt.status)}>{receipt.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p>{new Date(receipt.createdAt).toLocaleString()}</p>
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
                  <TableHead>Expected Qty</TableHead>
                  <TableHead>Received Qty</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>UOM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-mono">{item.productSku}</TableCell>
                    <TableCell>{item.expectedQty}</TableCell>
                    <TableCell>{item.receivedQty}</TableCell>
                    <TableCell className="font-mono">{item.location}</TableCell>
                    <TableCell>{item.uom}</TableCell>
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

export default ReceiptDetail;

