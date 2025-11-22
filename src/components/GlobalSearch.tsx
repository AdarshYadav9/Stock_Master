import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useProductsStore } from '@/store/productsStore';
import { Button } from '@/components/ui/button';

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const searchProducts = useProductsStore((state) => state.searchProducts);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length > 2) {
      const products = await searchProducts(searchQuery);
      setResults(products);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (productId: string) => {
    navigate(`/products/${productId}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search products...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products by SKU or name..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No products found.</CommandEmpty>
          <CommandGroup heading="Products">
            {results.map((product) => (
              <CommandItem
                key={product.id}
                value={product.id}
                onSelect={() => handleSelect(product.id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{product.sku}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

