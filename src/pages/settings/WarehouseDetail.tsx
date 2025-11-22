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
import { useWarehousesStore } from '@/store/warehousesStore';

const WarehouseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWarehouseById, fetchWarehouses } = useWarehousesStore();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const warehouse = id ? getWarehouseById(id) : undefined;

  if (!warehouse) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Warehouse not found</p>
          <Button onClick={() => navigate('/settings/warehouses')} className="mt-4">
            Back to Warehouses
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings/warehouses')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{warehouse.name}</h1>
            <p className="text-muted-foreground mt-1">Warehouse Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Code</label>
                <p className="font-mono">{warehouse.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{warehouse.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p>{warehouse.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                <p>{warehouse.capacity}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
          </CardHeader>
          <CardContent>
            {warehouse.locations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No locations defined</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouse.locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-mono font-medium">{location.code}</TableCell>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {location.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{location.capacity || '-'}</TableCell>
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

export default WarehouseDetail;

