import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useOperationsStore } from '@/store/operationsStore';
import { useProductsStore } from '@/store/productsStore';
import { useWarehousesStore } from '@/store/warehousesStore';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

const receiptItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  expectedQty: z.number().min(1, 'Quantity must be at least 1'),
  receivedQty: z.number().min(0),
  location: z.string().min(1, 'Location is required'),
});

const receiptSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  warehouse: z.string().min(1, 'Warehouse is required'),
  items: z.array(receiptItemSchema).min(1, 'At least one item is required'),
});

type ReceiptFormValues = z.infer<typeof receiptSchema>;

const ReceiptNew = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createReceipt, loading } = useOperationsStore();
  const { products, fetchProducts } = useProductsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      supplier: '',
      warehouse: '',
      items: [{ productId: '', expectedQty: 0, receivedQty: 0, location: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const selectedWarehouse = warehouses.find((w) => w.id === form.watch('warehouse'));

  const onSubmit = async (data: ReceiptFormValues) => {
    try {
      const receiptItems = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          productSku: product?.sku || '',
          productName: product?.name || '',
          expectedQty: item.expectedQty,
          receivedQty: item.receivedQty || item.expectedQty,
          location: item.location,
          uom: product?.uom || '',
        };
      });

      await createReceipt({
        supplier: data.supplier,
        warehouse: data.warehouse,
        status: 'draft',
        items: receiptItems,
        userId: user?.id || 'user-1',
      });

      toast.success('Receipt created successfully');
      navigate('/operations/receipts');
    } catch (error) {
      toast.error('Failed to create receipt');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/operations/receipts')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">New Receipt</h1>
            <p className="text-muted-foreground mt-1">Create a new stock receipt</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        <Input placeholder="Supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.map((wh) => (
                            <SelectItem key={wh.id} value={wh.id}>
                              {wh.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Items</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ productId: '', expectedQty: 0, receivedQty: 0, location: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Expected Qty</TableHead>
                      <TableHead>Received Qty</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {products.map((product) => (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.sku} - {product.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.expectedQty`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.receivedQty`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.location`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {selectedWarehouse?.locations.map((loc) => (
                                      <SelectItem key={loc.id} value={loc.code}>
                                        {loc.code} - {loc.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/operations/receipts')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Receipt'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default ReceiptNew;

