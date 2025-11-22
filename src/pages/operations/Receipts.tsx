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
import { useNavigate } from 'react-router-dom';
import { useOperationsStore } from '@/store/operationsStore';

const Receipts = () => {
  const navigate = useNavigate();
  const stockMoves = useOperationsStore((state) => state.stockMoves);
  const receipts = stockMoves.filter((m) => m.type === 'receipt');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-success text-success-foreground';
      case 'ready':
        return 'bg-primary text-primary-foreground';
      case 'waiting':
        return 'bg-warning text-warning-foreground';
      case 'draft':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
            <p className="text-muted-foreground mt-1">Manage incoming stock receipts</p>
          </div>
          <Button onClick={() => navigate('/operations/receipts/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Receipt
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receipt List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-mono">{receipt.reference}</TableCell>
                    <TableCell className="font-medium">{receipt.product}</TableCell>
                    <TableCell className="text-muted-foreground">{receipt.productSku}</TableCell>
                    <TableCell>{receipt.toLocation}</TableCell>
                    <TableCell>{receipt.quantity}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(receipt.status)}>
                        {receipt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(receipt.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
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

export default Receipts;
