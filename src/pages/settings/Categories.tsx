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
import { Plus } from 'lucide-react';
import { useWarehousesStore } from '@/store/warehousesStore';
import { toast } from 'sonner';

const Categories = () => {
  const { categories, loading, fetchCategories } = useWarehousesStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage product categories</p>
          </div>
          <Button onClick={() => toast.info('Category creation coming soon')}>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Categories List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No categories found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-mono font-medium">{category.code}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
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

export default Categories;

