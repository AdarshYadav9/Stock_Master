import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { ArrowLeft, Edit, Package, Warehouse } from 'lucide-react';
import { useProductsStore } from '@/store/productsStore';
import { useWarehousesStore } from '@/store/warehousesStore';
import { ProductForm } from '@/components/ProductForm';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const [editMode, setEditMode] = useState(isEdit);

  const { getProductById, fetchProducts } = useProductsStore();
  const { warehouses, fetchWarehouses, categories, fetchCategories, uoms, fetchUOMs } =
    useWarehousesStore();

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    fetchCategories();
    fetchUOMs();
  }, []);

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Product not found</p>
          <Button onClick={() => navigate('/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </Layout>
    );
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  const getUOMName = (uomId: string) => {
    return uoms.find((u) => u.id === uomId)?.name || uomId;
  };

  const getWarehouseName = (warehouseId: string) => {
    return warehouses.find((w) => w.id === warehouseId)?.name || warehouseId;
  };

  const getTotalStock = () => {
    return product.stock.reduce((sum, s) => sum + s.quantity, 0);
  };

  if (editMode) {
    return (
      <Layout>
        <ProductForm
          product={product}
          onCancel={() => setEditMode(false)}
          onSuccess={() => {
            setEditMode(false);
            fetchProducts();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground mt-1">Product Details</p>
            </div>
          </div>
          <Button onClick={() => setEditMode(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">SKU</label>
                <p className="font-mono">{product.sku}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{product.name}</p>
              </div>
              {product.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p>{product.description}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p>{getCategoryName(product.category)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Unit of Measure</label>
                <p>{getUOMName(product.uom)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Stock</label>
                <p className="text-2xl font-bold">{getTotalStock()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reorder Point</label>
                <p>{product.reorderPoint}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reorder Quantity</label>
                <p>{product.reorderQuantity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {getTotalStock() < product.reorderPoint ? (
                    <Badge variant="destructive">Low Stock</Badge>
                  ) : (
                    <Badge variant="default">In Stock</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock by Location</CardTitle>
          </CardHeader>
          <CardContent>
            {product.stock.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No stock recorded</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.stock.map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell>{getWarehouseName(stock.warehouse)}</TableCell>
                      <TableCell className="font-mono">{stock.location}</TableCell>
                      <TableCell>{stock.quantity}</TableCell>
                      <TableCell>{stock.reserved}</TableCell>
                      <TableCell>{stock.quantity - stock.reserved}</TableCell>
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

export default ProductDetail;

