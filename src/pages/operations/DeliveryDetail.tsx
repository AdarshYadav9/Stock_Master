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

const DeliveryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDeliveryById, fetchDeliveries } = useOperationsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();

  useEffect(() => {
    fetchDeliveries();
    fetchWarehouses();
  }, []);

  const delivery = id ? getDeliveryById(id) : undefined;

  if (!delivery) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Delivery not found</p>
          <Button onClick={() => navigate('/operations/deliveries')} className="mt-4">
            Back to Deliveries
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/operations/deliveries')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{delivery.reference}</h1>
            <p className="text-muted-foreground mt-1">Delivery Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reference</label>
                <p className="font-mono">{delivery.reference}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Customer</label>
                <p>{delivery.customer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Warehouse</label>
                <p>{warehouses.find((w) => w.id === delivery.warehouse)?.name || delivery.warehouse}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(delivery.status)}>{delivery.status}</Badge>
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
                  <TableHead>Requested</TableHead>
                  <TableHead>Picked</TableHead>
                  <TableHead>Packed</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delivery.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-mono">{item.productSku}</TableCell>
                    <TableCell>{item.requestedQty}</TableCell>
                    <TableCell>{item.pickedQty}</TableCell>
                    <TableCell>{item.packedQty}</TableCell>
                    <TableCell className="font-mono">{item.location}</TableCell>
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

export default DeliveryDetail;

