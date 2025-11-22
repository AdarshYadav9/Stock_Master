# StockMaster - Complete File Structure

```
stock-master-ui/
│
├── 📁 public/                          # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── 📁 src/                             # Source code
│   │
│   ├── 📁 components/                  # Reusable components
│   │   ├── Breadcrumbs.tsx             # Breadcrumb navigation
│   │   ├── GlobalSearch.tsx            # Global product search
│   │   ├── KpiCard.tsx                 # KPI card component
│   │   ├── Layout.tsx                  # Main layout wrapper
│   │   ├── NavLink.tsx                 # Navigation link component
│   │   ├── ProductForm.tsx             # Product form (create/edit)
│   │   ├── Sidebar.tsx                 # Sidebar navigation
│   │   ├── TopBar.tsx                  # Top navigation bar
│   │   │
│   │   └── 📁 ui/                      # Shadcn/UI components (50+ components)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx              # Mobile detection hook
│   │   └── use-toast.ts                # Toast notification hook
│   │
│   ├── 📁 lib/                         # Utility libraries
│   │   ├── database.ts                 # Local database (localStorage) utilities
│   │   └── utils.ts                    # General utility functions
│   │
│   ├── 📁 mocks/                       # Mock data and API
│   │   ├── api.ts                      # Mock API functions
│   │   └── data.ts                     # Seed/mock data
│   │
│   ├── 📁 pages/                       # Page components
│   │   │
│   │   ├── 📁 operations/              # Operations module pages
│   │   │   ├── AdjustmentDetail.tsx    # Adjustment detail view
│   │   │   ├── AdjustmentNew.tsx       # Create new adjustment
│   │   │   ├── Adjustments.tsx         # Adjustments list
│   │   │   ├── DeliveryDetail.tsx      # Delivery detail view
│   │   │   ├── Deliveries.tsx          # Deliveries list
│   │   │   ├── Ledger.tsx              # Stock move history/ledger
│   │   │   ├── ReceiptDetail.tsx       # Receipt detail view
│   │   │   ├── ReceiptNew.tsx          # Create new receipt
│   │   │   ├── Receipts.tsx            # Receipts list
│   │   │   ├── TransferDetail.tsx      # Transfer detail view
│   │   │   ├── TransferNew.tsx         # Create new transfer
│   │   │   └── Transfers.tsx           # Transfers list
│   │   │
│   │   ├── 📁 settings/                 # Settings module pages
│   │   │   ├── Categories.tsx          # Product categories management
│   │   │   ├── UOM.tsx                 # Units of measure management
│   │   │   ├── Users.tsx               # User management
│   │   │   ├── WarehouseDetail.tsx     # Warehouse detail view
│   │   │   └── Warehouses.tsx          # Warehouses list
│   │   │
│   │   ├── Dashboard.tsx               # Main dashboard
│   │   ├── ForgotPassword.tsx          # Password reset page
│   │   ├── Index.tsx                   # Index/landing page
│   │   ├── Login.tsx                   # Legacy login (deprecated)
│   │   ├── NotFound.tsx                # 404 page
│   │   ├── ProductDetail.tsx           # Product detail view
│   │   ├── ProductNew.tsx               # Create new product
│   │   ├── Products.tsx                 # Products list
│   │   ├── SignIn.tsx                   # Sign in page
│   │   └── Signup.tsx                   # Sign up page
│   │
│   ├── 📁 store/                       # Zustand state management
│   │   ├── authStore.ts                # Authentication state
│   │   ├── operationsStore.ts          # Operations state (receipts, deliveries, etc.)
│   │   ├── productsStore.ts            # Products state
│   │   └── warehousesStore.ts         # Warehouses, categories, UOM state
│   │
│   ├── App.css                         # Global app styles
│   ├── App.tsx                          # Main app component & routing
│   ├── index.css                       # Global CSS & Tailwind imports
│   ├── main.tsx                        # App entry point
│   └── vite-env.d.ts                   # Vite type definitions
│
├── 📄 Configuration Files
│   ├── .gitignore                      # Git ignore rules
│   ├── components.json                 # Shadcn/UI configuration
│   ├── eslint.config.js                # ESLint configuration
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Dependencies & scripts
│   ├── package-lock.json               # Locked dependencies
│   ├── postcss.config.js               # PostCSS configuration
│   ├── README.md                       # Project documentation
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── tsconfig.app.json               # TypeScript app config
│   ├── tsconfig.node.json              # TypeScript node config
│   └── vite.config.ts                  # Vite build configuration
│
└── 📁 node_modules/                    # Dependencies (generated)

```

## 📊 Statistics

- **Total Files**: ~120+ files
- **Components**: 50+ UI components + 8 custom components
- **Pages**: 25+ page components
- **Stores**: 4 Zustand stores
- **Lines of Code**: ~15,000+ lines

## 🗂️ Module Breakdown

### 📦 Products Module
- `pages/Products.tsx` - Product list
- `pages/ProductNew.tsx` - Create product
- `pages/ProductDetail.tsx` - Product details
- `components/ProductForm.tsx` - Product form component
- `store/productsStore.ts` - Product state management

### 🔄 Operations Module
- **Receipts**: `Receipts.tsx`, `ReceiptNew.tsx`, `ReceiptDetail.tsx`
- **Deliveries**: `Deliveries.tsx`, `DeliveryDetail.tsx`
- **Transfers**: `Transfers.tsx`, `TransferNew.tsx`, `TransferDetail.tsx`
- **Adjustments**: `Adjustments.tsx`, `AdjustmentNew.tsx`, `AdjustmentDetail.tsx`
- **Ledger**: `Ledger.tsx` - Stock movement history
- `store/operationsStore.ts` - Operations state management

### 🏭 Settings Module
- **Warehouses**: `Warehouses.tsx`, `WarehouseDetail.tsx`
- **Categories**: `Categories.tsx`
- **UOM**: `UOM.tsx`
- **Users**: `Users.tsx`
- `store/warehousesStore.ts` - Settings state management

### 🔐 Authentication
- `pages/SignIn.tsx` - Sign in page
- `pages/SignUp.tsx` - Sign up page
- `pages/ForgotPassword.tsx` - Password reset
- `store/authStore.ts` - Authentication state
- `lib/database.ts` - Local database (stores users)

### 🎨 UI Components
- **Layout**: `Layout.tsx`, `Sidebar.tsx`, `TopBar.tsx`
- **Navigation**: `Breadcrumbs.tsx`, `NavLink.tsx`
- **Search**: `GlobalSearch.tsx`
- **Cards**: `KpiCard.tsx`
- **50+ Shadcn/UI components** in `components/ui/`

### 💾 Data Layer
- `lib/database.ts` - Local database utilities (localStorage)
- `mocks/data.ts` - Mock/seed data
- `mocks/api.ts` - Mock API functions (for reference)

## 🔑 Key Files

1. **`src/App.tsx`** - Main app component, routing configuration
2. **`src/main.tsx`** - Application entry point
3. **`src/lib/database.ts`** - Local database implementation
4. **`src/store/*.ts`** - State management stores
5. **`vite.config.ts`** - Build configuration
6. **`tailwind.config.ts`** - Styling configuration

## 📝 Notes

- All data is stored in **localStorage** (browser-based)
- No backend server required
- Mock data auto-initializes on first load
- TypeScript throughout for type safety
- React Router for navigation
- Zustand for state management

