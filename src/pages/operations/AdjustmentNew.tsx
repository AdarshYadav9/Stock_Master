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
import { Textarea } from '@/components/ui/textarea';
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

const adjustmentItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  location: z.string().min(1, 'Location is required'),
  countedQty: z.number().min(0, 'Counted quantity must be positive'),
});

const adjustmentSchema = z.object({
  warehouse: z.string().min(1, 'Warehouse is required'),
  reason: z.string().min(1, 'Reason is required'),
  items: z.array(adjustmentItemSchema).min(1, 'At least one item is required'),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

const AdjustmentNew = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createAdjustment, loading } = useOperationsStore();
  const { products, fetchProducts } = useProductsStore();
  const { warehouses, fetchWarehouses } = useWarehousesStore();

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      warehouse: '',
      reason: '',
      items: [{ productId: '', location: '', countedQty: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const selectedWarehouse = warehouses.find((w) => w.id === form.watch('warehouse'));

  const onSubmit = async (data: AdjustmentFormValues) => {
    try {
      const adjustmentItems = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const stockLevel = product?.stock.find(
          (s) => s.warehouse === data.warehouse && s.location === item.location
        );
        const systemQty = stockLevel?.quantity || 0;
        const difference = item.countedQty - systemQty;

        return {
          productId: item.productId,
          productSku: product?.sku || '',
          productName: product?.name || '',
          location: item.location,
          systemQty,
          countedQty: item.countedQty,
          difference,
          uom: product?.uom || '',
        };
      });

      await createAdjustment({
        warehouse: data.warehouse,
        reason: data.reason,
        status: 'draft',
        items: adjustmentItems,
        userId: user?.id || user?._id || 'user-1',
      });

      toast.success('Adjustment created successfully');
      navigate('/operations/adjustments');
    } catch (error) {
      toast.error('Failed to create adjustment');
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
            <h1 className="text-3xl font-bold text-foreground">New Adjustment</h1>
            <p className="text-muted-foreground mt-1">Create a new inventory adjustment</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adjustment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Reason for adjustment..." {...field} />
                      </FormControl>
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
                    onClick={() => append({ productId: '', location: '', countedQty: 0 })}
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
                      <TableHead>Location</TableHead>
                      <TableHead>System Qty</TableHead>
                      <TableHead>Counted Qty</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const productId = form.watch(`items.${index}.productId`);
                      const location = form.watch(`items.${index}.location`);
                      const product = products.find((p) => p.id === productId);
                      const stockLevel = product?.stock.find(
                        (s) => s.warehouse === form.watch('warehouse') && s.location === location
                      );
                      const systemQty = stockLevel?.quantity || 0;
                      const countedQty = form.watch(`items.${index}.countedQty`);
                      const difference = countedQty - systemQty;

                      return (
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
                                          {loc.code}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>{systemQty}</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.countedQty`}
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
                          <TableCell className={difference !== 0 ? (difference > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                            {difference > 0 ? '+' : ''}{difference}
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
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/operations/adjustments')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Adjustment'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default AdjustmentNew;

