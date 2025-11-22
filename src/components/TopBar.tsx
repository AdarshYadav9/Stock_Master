import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';

export const TopBar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">

      {/* LEFT SECTION — LOGO + NAVIGATION */}
      <div className="flex items-center gap-8">

        {/* LOGO */}
        <div
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => navigate('/')}
        >
          StockMaster
        </div>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">

          {/* Dashboard */}
          <button onClick={() => navigate('/dashboard')} className="hover:text-primary">
            Dashboard
          </button>

          {/* Products */}
          <button onClick={() => navigate('/products')} className="hover:text-primary">
            Products
          </button>

          {/* OPERATIONS — DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary">
              Operations <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate('/operations/receipts')}>Receipts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/operations/deliveries')}>Deliveries</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/operations/transfers')}>Transfers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/operations/adjustments')}>Adjustments</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/operations/ledger')}>Move History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* SETTINGS — DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary">
              Settings <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate('/settings/uom')}>Units of Measure</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/warehouses')}>Warehouses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/categories')}>Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/users')}>Users</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>
      </div>

      {/* CENTER — SEARCH BAR */}
      <div className="flex-1 flex justify-center">
        <GlobalSearch />
      </div>

      {/* RIGHT SIDE — USER MENU */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name || 'User'}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};