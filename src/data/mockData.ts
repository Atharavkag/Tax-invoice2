export interface InventoryItem {
  id: string;
  name: string;
  hsn: string;
  rate: number;
  stock: number;
  unit: string;
  gstRate: number;
}

export interface Company {
  id: string;
  gstNo: string;
  name: string;
  address: string;
  state: string;
  stateCode: string;
  pendingAmount: number;
  lastTransaction?: string;
  phone?: string;
}

export interface InvoiceItem {
  id: string;
  item: InventoryItem;
  quantity: number;
  discount: number;
}

export const inventoryItems: InventoryItem[] = [
  { id: '1', name: 'Steel Bars (10mm)', hsn: '7214', rate: 5500, stock: 150, unit: 'MT', gstRate: 18 },
  { id: '2', name: 'Cement (OPC 53)', hsn: '2523', rate: 380, stock: 500, unit: 'Bags', gstRate: 28 },
  { id: '3', name: 'TMT Bars (12mm)', hsn: '7214', rate: 5800, stock: 80, unit: 'MT', gstRate: 18 },
  { id: '4', name: 'Bricks (Red)', hsn: '6901', rate: 8, stock: 10000, unit: 'Pcs', gstRate: 5 },
  { id: '5', name: 'Sand (River)', hsn: '2505', rate: 2500, stock: 200, unit: 'CFT', gstRate: 5 },
  { id: '6', name: 'Aggregate (20mm)', hsn: '2517', rate: 1800, stock: 300, unit: 'CFT', gstRate: 5 },
  { id: '7', name: 'PVC Pipes (4")', hsn: '3917', rate: 450, stock: 250, unit: 'Pcs', gstRate: 18 },
  { id: '8', name: 'Electrical Wire (1.5mm)', hsn: '8544', rate: 2800, stock: 50, unit: 'Coils', gstRate: 18 },
  { id: '9', name: 'Paint (Exterior)', hsn: '3208', rate: 2400, stock: 30, unit: 'Bucket', gstRate: 28 },
  { id: '10', name: 'Tiles (Ceramic)', hsn: '6908', rate: 55, stock: 2000, unit: 'Sqft', gstRate: 18 },
];

export const companies: Company[] = [
  {
    id: '1',
    gstNo: '27AABCU9603R1ZM',
    name: 'Sharma Constructions Pvt Ltd',
    address: '123, Industrial Area, Sector 5',
    state: 'Maharashtra',
    stateCode: '27',
    pendingAmount: 2000,
    lastTransaction: '2025-01-15',
    phone: '+91 90000 00001',
  },
  {
    id: '2',
    gstNo: '29AABCT1332L1ZL',
    name: 'BuildWell Infrastructure',
    address: '456, Business Park, Phase 2',
    state: 'Karnataka',
    stateCode: '29',
    pendingAmount: 2000,
    lastTransaction: '2025-01-28',
    phone: '+91 90000 00002',
  },
  {
    id: '3',
    gstNo: '07AAACR5055K1Z6',
    name: 'Raj Builders & Developers',
    address: '789, Commercial Complex, Ring Road',
    state: 'Delhi',
    stateCode: '07',
    pendingAmount: 2000,
    lastTransaction: '2025-02-01',
    phone: '+91 90000 00003',
  },
  {
    id: '4',
    gstNo: '33AABCS1429B1ZR',
    name: 'Southern Infra Solutions',
    address: '321, Tech Park, OMR Road',
    state: 'Tamil Nadu',
    stateCode: '33',
    pendingAmount: 2000,
    phone: '+91 90000 00004',
  },
];

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `INV/${year}${month}/${random}`;
};

export const sellerInfo = {
  name: 'ABC Trading Company',
  address: '100, Main Market, Industrial Zone',
  city: 'Mumbai',
  state: 'Maharashtra',
  stateCode: '27',
  pincode: '400001',
  gstNo: '27AABCA1234A1Z5',
  pan: 'AABCA1234A',
  phone: '+91 98765 43210',
  email: 'sales@abctrading.com',
};

export const bankDetails = {
  bankName: 'State Bank of India',
  accountName: 'ABC Trading Company',
  accountNumber: '1234567890123456',
  ifscCode: 'SBIN0001234',
  branch: 'Industrial Area Branch, Mumbai',
};
