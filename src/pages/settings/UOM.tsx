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
import { Plus } from 'lucide-react';
import { useWarehousesStore } from '@/store/warehousesStore';
import { toast } from 'sonner';

const UOM = () => {
  const { uoms, loading, fetchUOMs } = useWarehousesStore();

  useEffect(() => {
    fetchUOMs();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'unit':
        return 'default';
      case 'weight':
        return 'secondary';
      case 'volume':
        return 'outline';
      case 'length':
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
            <h1 className="text-3xl font-bold text-foreground">Units of Measure</h1>
            <p className="text-muted-foreground mt-1">Manage units of measure</p>
          </div>
          <Button onClick={() => toast.info('UOM creation coming soon')}>
            <Plus className="mr-2 h-4 w-4" />
            New UOM
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>UOM List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : uoms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No UOMs found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uoms.map((uom) => (
                    <TableRow key={uom.id}>
                      <TableCell className="font-mono font-medium">{uom.code}</TableCell>
                      <TableCell className="font-medium">{uom.name}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(uom.type)} className="capitalize">
                          {uom.type}
                        </Badge>
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

export default UOM;

