import { useEffect } from 'react';
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
import { Plus, Eye } from 'lucide-react';
import { useWarehousesStore } from '@/store/warehousesStore';

const Warehouses = () => {
  const navigate = useNavigate();
  const { warehouses, loading, fetchWarehouses } = useWarehousesStore();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
            <p className="text-muted-foreground mt-1">Manage warehouses and locations</p>
          </div>
          <Button onClick={() => navigate('/settings/warehouses/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Warehouse
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Warehouses List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : warehouses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No warehouses found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-mono font-medium">{warehouse.code}</TableCell>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{warehouse.address}</TableCell>
                      <TableCell>{warehouse.capacity}</TableCell>
                      <TableCell>{warehouse.locations.length} locations</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/settings/warehouses/${warehouse.id}`)}
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

export default Warehouses;

