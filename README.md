# StockMaster - Inventory Management System

A comprehensive Inventory Management System (IMS) built with React, TypeScript, TailwindCSS, Shadcn/UI, Zustand, and local database storage.

## Features

### 📦 Products Module
- Product list with search and category filtering
- Create new products with SKU, categories, and reorder rules
- Product detail pages with stock by location
- Low stock alerts

### 🔄 Operations Module
- **Receipts**: Manage incoming stock from suppliers
- **Deliveries**: Handle outgoing stock to customers
- **Internal Transfers**: Move stock between warehouses/locations
- **Inventory Adjustments**: Correct stock discrepancies
- **Move History**: Complete ledger of all stock movements

### 🏭 Settings Module
- Warehouse management with locations
- Product categories
- Units of Measure (UOM)
- User management

### 📊 Dashboard
- KPI cards showing key metrics
- Recent activity table
- Filters for document type, status, and warehouse
- Low stock alerts

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Shadcn/UI** for components
- **Zustand** for state management
- **React Hook Form + Zod** for form validation
- **LocalStorage** for local database storage
- **React Router** for navigation
- **Sonner** for toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
cd stock-master-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

5. Create an account:
   - Click "Sign up" to create a new account
   - Use any email and password (minimum 6 characters)
   - You'll be automatically logged in after signup

## Local Database

The application uses **localStorage** as a local database. All data is stored in the browser's localStorage, which means:

- ✅ Data persists across browser sessions
- ✅ No backend server required
- ✅ Works completely offline
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Data can be cleared by clearing browser data

### Database Structure

The local database uses a collection-based structure:
- `users` - User accounts
- `products` - Product catalog
- `warehouses` - Warehouse and location data
- `categories` - Product categories
- `uoms` - Units of measure
- `receipts` - Stock receipts
- `deliveries` - Stock deliveries
- `transfers` - Internal transfers
- `adjustments` - Inventory adjustments
- `stock_moves` - Stock movement ledger

### Data Initialization

On first load, the application automatically seeds mock data for:
- Products
- Warehouses
- Categories
- UOMs
- Sample receipts, deliveries, transfers, and adjustments

## Authentication

The application uses local authentication with password hashing (basic implementation). Users are stored in the local database.

### Default Users

You can create users through the sign-up page. The first user you create will be the admin.

## Project Structure

```
src/
  components/        # Reusable UI components
    ui/             # Shadcn/UI components
  pages/            # Page components
    operations/     # Operations module pages
    settings/       # Settings module pages
  store/            # Zustand stores
  mocks/            # Mock data
  lib/              # Utility functions
    database.ts     # Local database utilities
  hooks/            # Custom React hooks
```

## Key Features

- ✅ Complete local authentication system
- ✅ Product management with stock tracking
- ✅ Receipt, Delivery, Transfer, and Adjustment operations
- ✅ Multi-warehouse support with locations
- ✅ Stock ledger and move history
- ✅ Low stock alerts
- ✅ Global search functionality
- ✅ Breadcrumb navigation
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Local database persistence

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Data Export/Import

To export your data:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Copy all items starting with `stockmaster_`

To import data:
1. Use the browser's localStorage API
2. Set items with the `stockmaster_` prefix

## Next Steps

To migrate to a real backend:

1. Replace `src/lib/database.ts` with API calls
2. Update all stores to use real API endpoints
3. Configure CORS and authentication headers
4. Update environment variables for API endpoints
5. Implement proper password hashing (bcrypt)

## License

MIT
