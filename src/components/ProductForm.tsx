import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { ArrowLeft } from 'lucide-react';
import { useProductsStore } from '@/store/productsStore';
import { useWarehousesStore } from '@/store/warehousesStore';
import { Product } from '@/mocks/data';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  uom: z.string().min(1, 'UOM is required'),
  reorderPoint: z.number().min(0, 'Reorder point must be positive'),
  reorderQuantity: z.number().min(0, 'Reorder quantity must be positive'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ProductForm = ({ product, onCancel, onSuccess }: ProductFormProps) => {
  const navigate = useNavigate();
  const { addProduct, updateProduct, loading } = useProductsStore();
  const { categories, uoms, fetchCategories, fetchUOMs } = useWarehousesStore();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          sku: product.sku,
          name: product.name,
          description: product.description || '',
          category: product.category,
          uom: product.uom,
          reorderPoint: product.reorderPoint,
          reorderQuantity: product.reorderQuantity,
        }
      : {
          sku: '',
          name: '',
          description: '',
          category: '',
          uom: '',
          reorderPoint: 0,
          reorderQuantity: 0,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (product) {
        await updateProduct(product.id, data);
        toast.success('Product updated successfully');
      } else {
        await addProduct({
          ...data,
          stock: [],
        });
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${product ? 'update' : 'create'} product`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {product ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {product ? 'Update product information' : 'Create a new product'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Product description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
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
                  name="uom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit of Measure</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select UOM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uoms.map((uom) => (
                            <SelectItem key={uom.id} value={uom.id}>
                              {uom.name} ({uom.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="reorderPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder Point</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Minimum stock level before reordering</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reorderQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Quantity to order when reordering</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (product ? 'Updating...' : 'Creating...') : product ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

