export interface DealerDocument {
  fileName: string;
  fileSize?: string;
  fileData?: string; // base64 string for previewing/persist
  uploadedAt: string;
}

export interface Dealer {
  id: string;
  name: string;
  code: string;
  location: string;
  email: string;
  password?: string;
  logoUrl?: string;
  phone: string;
  managerName: string;
  // New compliance profile fields
  companyName?: string;
  incorporationNo?: string;
  dbaName?: string;
  legalStructure?: 'Sole Proprietorship' | 'Partnership' | 'Private Limited' | 'LLP' | '';
  ownershipDetails?: string; // names and addresses of partners/owners
  registeredAddress?: string;
  documentPan?: DealerDocument;
  documentGst?: DealerDocument;
  documentShopLicense?: DealerDocument;
  documentTradeLicense?: DealerDocument;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface InventoryItem {
  id: string;
  dealerId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minThreshold: number; // for low stock warning
  price: number;
  location: string; // warehouse section
  imageUrl?: string;
  lastUpdated: string;
}

export interface SaleItem {
  itemId: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Sale {
  id: string;
  dealerId: string;
  invoiceNo: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
  date: string;
  salespersonId: string;
  salespersonName: string;
  // New details as requested in Image 1 & 2
  modelNo?: string;
  location?: string;
  productDesc?: string;
  hsnNo?: string;
  chassisNo?: string;
  motorNo?: string;
  batteryNo?: string;
  batteryWarranty?: string;
  batteryCapacity?: string;
  vehicleWarranty?: string;
  gstNo?: string;
  leadSource?: string;
  splits?: Array<{ amount: number; paymentMethod: string; date: string }>;
  displaySplitsInInvoice?: boolean;
}

export interface ServiceInvoiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ServiceInvoice {
  id: string;
  dealerId: string;
  invoiceNo: string;
  customerName: string;
  customerPhone?: string;
  location?: string;
  date: string;
  labourCharges: number;
  paymentMethod: string;
  leadSource?: string;
  enableGst: boolean;
  products: ServiceInvoiceItem[];
  productDescription?: string;
  totalAmount: number;
  splits: Array<{ amount: number; paymentMethod: string; date: string }>;
  displaySplitsInInvoice?: boolean;
}

export interface Employee {
  id: string;
  dealerId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive';
  hireDate: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  id: string;
  dealerId: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  clockIn?: string; // HH:MM
  clockOut?: string; // HH:MM
  notes?: string;
}

export type ServiceTicketPriority = 'Low' | 'Medium' | 'High';
export type ServiceTicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface ServiceTicket {
  id: string;
  dealerId: string;
  subject: string;
  category: 'Warranty Claim' | 'Parts Support' | 'Technical Query' | 'Return Merchandise Support';
  priority: ServiceTicketPriority;
  status: ServiceTicketStatus;
  description: string;
  createdAt: string;
  lastUpdated: string;
  unreadCount?: number;
}

export interface ServiceMessage {
  id: string;
  ticketId: string;
  sender: 'dealer' | 'service_center';
  senderName: string;
  content: string;
  timestamp: string;
}
