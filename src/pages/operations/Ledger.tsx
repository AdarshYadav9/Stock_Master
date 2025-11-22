import { Layout } from '@/components/Layout';
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
import { useOperationsStore } from '@/store/operationsStore';
import { ArrowUp, ArrowDown } from 'lucide-react';

const Ledger = () => {
  const stockMoves = useOperationsStore((state) => state.stockMoves);

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
      case 'canceled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getQuantityDisplay = (move: any) => {
    const isIncoming = move.type === 'receipt' || (move.type === 'transfer' && move.toLocation);
    return (
      <div className={`flex items-center gap-1 ${isIncoming ? 'text-success' : 'text-destructive'}`}>
        {isIncoming ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        {isIncoming ? '+' : '-'}
        {move.quantity}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Move History</h1>
          <p className="text-muted-foreground mt-1">Complete history of all stock movements</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Movement Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMoves
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((move) => (
                    <TableRow key={move.id}>
                      <TableCell className="text-sm">
                        {new Date(move.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {move.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{move.product}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {move.productSku}
                      </TableCell>
                      <TableCell className="text-sm">{move.fromLocation || '-'}</TableCell>
                      <TableCell className="text-sm">{move.toLocation}</TableCell>
                      <TableCell className="font-semibold">{getQuantityDisplay(move)}</TableCell>
                      <TableCell className="font-mono text-sm">{move.reference}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(move.status)}>{move.status}</Badge>
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

export default Ledger;
