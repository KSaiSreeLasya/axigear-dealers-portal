import { Dealer, InventoryItem, Employee, AttendanceRecord, Sale, ServiceTicket, ServiceMessage } from '../types';

export const INITIAL_DEALERS: Dealer[] = [
  {
    id: 'dealer-1',
    name: 'Axigear Bangalore Central',
    code: 'AXI-BLR-101',
    location: 'Bangalore, Karnataka',
    email: 'blr@axigear.com',
    password: 'dealer123',
    phone: '+91 80 4912 3456',
    managerName: 'Rajesh Kumar',
    logoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?rect=0%2C0%2C400%2C400&q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'dealer-2',
    name: 'Axigear Mumbai West',
    code: 'AXI-MUM-202',
    location: 'Andheri West, Mumbai',
    email: 'mum@axigear.com',
    password: 'dealer123',
    phone: '+91 22 2673 9876',
    managerName: 'Sneha Patel',
    logoUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?rect=0%2C0%2C400%2C400&q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'dealer-3',
    name: 'Axigear Delhi NCR',
    code: 'AXI-DEL-303',
    location: 'Gurugram, Haryana',
    email: 'del@axigear.com',
    password: 'dealer123',
    phone: '+91 124 4022 111',
    managerName: 'Amit Sharma',
    logoUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?rect=0%2C0%2C400%2C400&q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'dealer-4',
    name: 'Axigear Chennai East',
    code: 'AXI-CHN-404',
    location: 'Adyar, Chennai',
    email: 'chn@axigear.com',
    password: 'dealer123',
    phone: '+91 44 2445 9900',
    managerName: 'Vikram Sethupathi',
    logoUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?rect=0%2C0%2C400%2C400&q=80&w=200&auto=format&fit=crop'
  }
];

// Generates initial mockup data for isolated collections.
// Real applications synchronize this with database schemas per dealer.

export const INITIAL_INVENTORY: InventoryItem[] = [
  // --- Bangalore Central (dealer-1) ---
  {
    id: 'inv-blr-1',
    dealerId: 'dealer-1',
    name: 'Axigear Carbon Fury Helmet',
    sku: 'AXI-HELM-CB-01',
    category: 'Helmets',
    quantity: 15,
    minThreshold: 5,
    price: 18500,
    location: 'Aisle A2, Shelf 3',
    lastUpdated: '2026-06-20'
  },
  {
    id: 'inv-blr-2',
    dealerId: 'dealer-1',
    name: 'All-Terrain Mesh Riding Jacket',
    sku: 'AXI-JACK-TR-12',
    category: 'Riding Jackets',
    quantity: 4,
    minThreshold: 6, // Low Stock!
    price: 12500,
    location: 'Aisle B1, Rack 2',
    lastUpdated: '2026-06-18'
  },
  {
    id: 'inv-blr-3',
    dealerId: 'dealer-1',
    name: 'Kevlar Pro Riding Gloves',
    sku: 'AXI-GLOV-KV-55',
    category: 'Gloves',
    quantity: 28,
    minThreshold: 8,
    price: 3800,
    location: 'Aisle C2, Shelf 1',
    lastUpdated: '2026-06-21'
  },
  {
    id: 'inv-blr-4',
    dealerId: 'dealer-1',
    name: 'Supremacy Leather Racing Boots',
    sku: 'AXI-BT-SP-09',
    category: 'Footwear',
    quantity: 0,
    minThreshold: 3, // Out of Stock!
    price: 16200,
    location: 'Aisle D1, Rack 4',
    lastUpdated: '2026-06-15'
  },
  {
    id: 'inv-blr-5',
    dealerId: 'dealer-1',
    name: 'Brake Pad Ceramic Set (V-1)',
    sku: 'AXI-PART-BP-22',
    category: 'Spare Parts',
    quantity: 45,
    minThreshold: 15,
    price: 1450,
    location: 'Aisle F3, Drawer 5',
    lastUpdated: '2026-06-19'
  },
  {
    id: 'inv-blr-6',
    dealerId: 'dealer-1',
    name: 'High-Flow Performance Oil Filter',
    sku: 'AXI-PART-OF-88',
    category: 'Spare Parts',
    quantity: 32,
    minThreshold: 10,
    price: 890,
    location: 'Aisle F3, Drawer 2',
    lastUpdated: '2026-06-22'
  },

  // --- Mumbai West (dealer-2) ---
  {
    id: 'inv-mum-1',
    dealerId: 'dealer-2',
    name: 'Axigear Carbon Fury Helmet',
    sku: 'AXI-HELM-CB-01',
    category: 'Helmets',
    quantity: 8,
    minThreshold: 5,
    price: 18500,
    location: 'Zone A - Rack 1',
    lastUpdated: '2026-06-21'
  },
  {
    id: 'inv-mum-2',
    dealerId: 'dealer-2',
    name: 'Gravel-Pro Waterproof Pants',
    sku: 'AXI-PNT-GP-44',
    category: 'Riding Pants',
    quantity: 3,
    minThreshold: 5, // Low Stock!
    price: 9500,
    location: 'Zone B - Rack 2',
    lastUpdated: '2026-06-17'
  },
  {
    id: 'inv-mum-3',
    dealerId: 'dealer-2',
    name: 'Kevlar Pro Riding Gloves',
    sku: 'AXI-GLOV-KV-55',
    category: 'Gloves',
    quantity: 2,
    minThreshold: 6, // Low Stock!
    price: 3800,
    location: 'Zone C - Bin 4',
    lastUpdated: '2026-06-19'
  },
  {
    id: 'inv-mum-4',
    dealerId: 'dealer-2',
    name: 'Heavy Duty Quad-Intercom V3',
    sku: 'AXI-ELEC-IC-04',
    category: 'Electronics',
    quantity: 12,
    minThreshold: 3,
    price: 7900,
    location: 'Tech Cabinet B',
    lastUpdated: '2026-06-22'
  },

  // --- Delhi NCR (dealer-3) ---
  {
    id: 'inv-del-1',
    dealerId: 'dealer-3',
    name: 'Axigear Carbon Fury Helmet',
    sku: 'AXI-HELM-CB-01',
    category: 'Helmets',
    quantity: 2,
    minThreshold: 4, // Low Stock!
    price: 18500,
    location: 'Row 1, Box 15',
    lastUpdated: '2026-06-20'
  },
  {
    id: 'inv-del-2',
    dealerId: 'dealer-3',
    name: 'All-Terrain Mesh Riding Jacket',
    sku: 'AXI-JACK-TR-12',
    category: 'Riding Jackets',
    quantity: 24,
    minThreshold: 6,
    price: 12500,
    location: 'Row 3, Rack A',
    lastUpdated: '2026-06-21'
  },
  {
    id: 'inv-del-3',
    dealerId: 'dealer-3',
    name: 'Gold Racing Drive Chain 120L',
    sku: 'AXI-PART-CH-99',
    category: 'Spare Parts',
    quantity: 15,
    minThreshold: 5,
    price: 4900,
    location: 'Row 5, Drawer C',
    lastUpdated: '2026-06-18'
  },

  // --- Chennai East (dealer-4) ---
  {
    id: 'inv-chn-1',
    dealerId: 'dealer-4',
    name: 'Supremacy Leather Racing Boots',
    sku: 'AXI-BT-SP-09',
    category: 'Footwear',
    quantity: 14,
    minThreshold: 3,
    price: 16200,
    location: 'Sec A, Shelf 1',
    lastUpdated: '2026-06-21'
  },
  {
    id: 'inv-chn-2',
    dealerId: 'dealer-4',
    name: 'Kevlar Pro Riding Gloves',
    sku: 'AXI-GLOV-KV-55',
    category: 'Gloves',
    quantity: 35,
    minThreshold: 8,
    price: 3800,
    location: 'Sec B, Shelf 3',
    lastUpdated: '2026-06-22'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  // --- Bangalore (dealer-1) ---
  {
    id: 'emp-blr-1',
    dealerId: 'dealer-1',
    name: 'Karthik Gowda',
    email: 'karthik@blr.axigear.com',
    phone: '+91 98845 23145',
    role: 'Senior Sales Executive',
    status: 'Active',
    hireDate: '2024-03-12'
  },
  {
    id: 'emp-blr-2',
    dealerId: 'dealer-1',
    name: 'Divya Rao',
    email: 'divya@blr.axigear.com',
    phone: '+91 96555 12098',
    role: 'Store Operations Supervisor',
    status: 'Active',
    hireDate: '2024-11-01'
  },
  {
    id: 'emp-blr-3',
    dealerId: 'dealer-1',
    name: 'Anup Mathew',
    email: 'anup@blr.axigear.com',
    phone: '+91 94432 87611',
    role: 'Inventory Assistant',
    status: 'Active',
    hireDate: '2025-05-15'
  },
  {
    id: 'emp-blr-4',
    dealerId: 'dealer-1',
    name: 'Suhas K',
    email: 'suhas@blr.axigear.com',
    phone: '+91 97712 14321',
    role: 'Sales Associate',
    status: 'Inactive',
    hireDate: '2025-01-10'
  },

  // --- Mumbai (dealer-2) ---
  {
    id: 'emp-mum-1',
    dealerId: 'dealer-2',
    name: 'Rohan Deshmukh',
    email: 'rohan@mum.axigear.com',
    phone: '+91 91234 56789',
    role: 'Store Manager',
    status: 'Active',
    hireDate: '2023-01-15'
  },
  {
    id: 'emp-mum-2',
    dealerId: 'dealer-2',
    name: 'Pooja Chawla',
    email: 'pooja@mum.axigear.com',
    phone: '+91 98765 43210',
    role: 'Product Consultant',
    status: 'Active',
    hireDate: '2024-09-20'
  },

  // --- Delhi (dealer-3) ---
  {
    id: 'emp-del-1',
    dealerId: 'dealer-3',
    name: 'Tarun Yadav',
    email: 'tarun@del.axigear.com',
    phone: '+91 99911 22334',
    role: 'Lead Sales Representative',
    status: 'Active',
    hireDate: '2023-07-25'
  },
  {
    id: 'emp-del-2',
    dealerId: 'dealer-3',
    name: 'Riddhima Sen',
    email: 'riddhima@del.axigear.com',
    phone: '+91 98888 77766',
    role: 'Technical Expert',
    status: 'Active',
    hireDate: '2025-02-14'
  },

  // --- Chennai (dealer-4) ---
  {
    id: 'emp-chn-1',
    dealerId: 'dealer-4',
    name: 'Dinesh Balan',
    email: 'dinesh@chn.axigear.com',
    phone: '+91 90033 44556',
    role: 'Outlet Lead',
    status: 'Active',
    hireDate: '2024-06-05'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // --- Bangalore (dealer-1) for today ---
  {
    id: 'att-blr-1',
    dealerId: 'dealer-1',
    employeeId: 'emp-blr-1',
    employeeName: 'Karthik Gowda',
    date: '2026-06-22',
    status: 'Present',
    clockIn: '09:24',
    clockOut: '18:15',
    notes: 'Regular prompt arrival'
  },
  {
    id: 'att-blr-2',
    dealerId: 'dealer-1',
    employeeId: 'emp-blr-2',
    employeeName: 'Divya Rao',
    date: '2026-06-22',
    status: 'Late',
    clockIn: '10:05',
    clockOut: '18:00',
    notes: 'Delayed due to traffic'
  },
  {
    id: 'att-blr-3',
    dealerId: 'dealer-1',
    employeeId: 'emp-blr-3',
    employeeName: 'Anup Mathew',
    date: '2026-06-22',
    status: 'Present',
    clockIn: '09:12',
    clockOut: '18:10'
  },
  // Bangalore previous day records
  {
    id: 'att-blr-4',
    dealerId: 'dealer-1',
    employeeId: 'emp-blr-1',
    employeeName: 'Karthik Gowda',
    date: '2026-06-21',
    status: 'Present',
    clockIn: '09:15',
    clockOut: '18:00'
  },
  {
    id: 'att-blr-5',
    dealerId: 'dealer-1',
    employeeId: 'emp-blr-2',
    employeeName: 'Divya Rao',
    date: '2026-06-21',
    status: 'Present',
    clockIn: '09:20',
    clockOut: '18:12'
  },
  {
    id: 'att-blr-6',
    dealerId: 'dealer-1',
    employeeId: 'emp-blr-3',
    employeeName: 'Anup Mathew',
    date: '2026-06-21',
    status: 'Leave',
    notes: 'Prior permission granted for personal work'
  },

  // --- Mumbai (dealer-2) for today ---
  {
    id: 'att-mum-1',
    dealerId: 'dealer-2',
    employeeId: 'emp-mum-1',
    employeeName: 'Rohan Deshmukh',
    date: '2026-06-22',
    status: 'Present',
    clockIn: '09:05',
    clockOut: ''
  },
  {
    id: 'att-mum-2',
    dealerId: 'dealer-2',
    employeeId: 'emp-mum-2',
    employeeName: 'Pooja Chawla',
    date: '2026-06-22',
    status: 'Absent',
    notes: 'No-show / Sick leave'
  }
];

export const INITIAL_SALES: Sale[] = [
  // --- Bangalore (dealer-1) ---
  {
    id: 'sale-blr-1',
    dealerId: 'dealer-1',
    invoiceNo: 'TAX-BLR-2026-015',
    customerName: 'Aravind Swamy',
    customerPhone: '+91 99887 76655',
    items: [
      { itemId: 'inv-blr-1', name: 'Axigear Carbon Fury Helmet', quantity: 1, pricePerUnit: 18500 }
    ],
    totalAmount: 18500,
    paymentMethod: 'UPI',
    date: '2026-06-22',
    salespersonId: 'emp-blr-1',
    salespersonName: 'Karthik Gowda'
  },
  {
    id: 'sale-blr-2',
    dealerId: 'dealer-1',
    invoiceNo: 'TAX-BLR-2026-014',
    customerName: 'Nisha Hegde',
    customerPhone: '+91 88776 65544',
    items: [
      { itemId: 'inv-blr-3', name: 'Kevlar Pro Riding Gloves', quantity: 2, pricePerUnit: 3800 },
      { itemId: 'inv-blr-5', name: 'Brake Pad Ceramic Set (V-1)', quantity: 1, pricePerUnit: 1450 }
    ],
    totalAmount: 9050,
    paymentMethod: 'Card',
    date: '2026-06-21',
    salespersonId: 'emp-blr-1',
    salespersonName: 'Karthik Gowda'
  },
  {
    id: 'sale-blr-3',
    dealerId: 'dealer-1',
    invoiceNo: 'TAX-BLR-2026-013',
    customerName: 'Rahul Deshpande',
    customerPhone: '+91 77665 54433',
    items: [
      { itemId: 'inv-blr-2', name: 'All-Terrain Mesh Riding Jacket', quantity: 1, pricePerUnit: 12500 }
    ],
    totalAmount: 12500,
    paymentMethod: 'Bank Transfer',
    date: '2026-06-20',
    salespersonId: 'emp-blr-2',
    salespersonName: 'Divya Rao'
  },

  // --- Mumbai (dealer-2) ---
  {
    id: 'sale-mum-1',
    dealerId: 'dealer-2',
    invoiceNo: 'TAX-MUM-2026-009',
    customerName: 'Karan Mehra',
    customerPhone: '+91 98112 23344',
    items: [
      { itemId: 'inv-mum-4', name: 'Heavy Duty Quad-Intercom V3', quantity: 2, pricePerUnit: 7900 }
    ],
    totalAmount: 15800,
    paymentMethod: 'UPI',
    date: '2026-06-22',
    salespersonId: 'emp-mum-2',
    salespersonName: 'Pooja Chawla'
  },
  {
    id: 'sale-mum-2',
    dealerId: 'dealer-2',
    invoiceNo: 'TAX-MUM-2026-008',
    customerName: 'Rohini Sen',
    customerPhone: '+91 96112 88812',
    items: [
      { itemId: 'inv-mum-1', name: 'Axigear Carbon Fury Helmet', quantity: 1, pricePerUnit: 18500 },
      { itemId: 'inv-mum-3', name: 'Kevlar Pro Riding Gloves', quantity: 1, pricePerUnit: 3800 }
    ],
    totalAmount: 22300,
    paymentMethod: 'Card',
    date: '2026-06-19',
    salespersonId: 'emp-mum-1',
    salespersonName: 'Rohan Deshmukh'
  }
];

export const INITIAL_TICKETS: ServiceTicket[] = [
  // --- Bangalore (dealer-1) ---
  {
    id: 'tkt-001',
    dealerId: 'dealer-1',
    subject: 'Carbon Fury Visor Replacement Claim',
    category: 'Warranty Claim',
    priority: 'Medium',
    status: 'In Progress',
    description: 'A customer reported that the tinted visor locking mechanism cracked within 2 weeks of use. Seeking warranty approval for replacement visor SKU HELM-AV3.',
    createdAt: '2026-06-20 14:30',
    lastUpdated: '2026-06-21 11:20',
    unreadCount: 1
  },
  {
    id: 'tkt-002',
    dealerId: 'dealer-1',
    subject: 'Bulk Request: Gravel-Pro Pants Spare Knee Shields',
    category: 'Parts Support',
    priority: 'Low',
    status: 'Open',
    description: 'Urgent stock request for Level 2 knee inserts compatible with Gravel-Pro Waterproof Pants series. We have received 5 inquiries this week.',
    createdAt: '2026-06-21 18:00',
    lastUpdated: '2026-06-21 18:00',
    unreadCount: 0
  },

  // --- Mumbai (dealer-2) ---
  {
    id: 'tkt-003',
    dealerId: 'dealer-2',
    subject: 'Intercom V3 Bluetooth Pairing Bug',
    category: 'Technical Query',
    priority: 'High',
    status: 'Resolved',
    description: '3 units sold on June 15 have been brought back because they fail to chain-link mesh pairing with legacy V2 firmware. Need official patch or replacement units.',
    createdAt: '2026-06-18 10:15',
    lastUpdated: '2026-06-19 16:45',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: ServiceMessage[] = [
  // --- Bangalore Ticket 1 ---
  {
    id: 'msg-1',
    ticketId: 'tkt-001',
    sender: 'dealer',
    senderName: 'Rajesh Kumar (Bangalore)',
    content: 'Hi Team, claiming warranty replacement for Axigear Carbon Fury helmet visor. Visor lock broke during normal wear. Standard photos attached below.',
    timestamp: '2026-06-20 14:30'
  },
  {
    id: 'msg-2',
    ticketId: 'tkt-001',
    sender: 'service_center',
    senderName: 'Axigear Global Service HQ',
    content: 'Ticket received. Could you please double check if the customer used a high-performance cleaning solvent or if there was any physical impact? Standard replacement visors are ready at HQ.',
    timestamp: '2026-06-21 10:10'
  },
  {
    id: 'msg-3',
    ticketId: 'tkt-001',
    sender: 'dealer',
    senderName: 'Rajesh Kumar (Bangalore)',
    content: 'Double checked. No chemicals used, and helmet body is pristine with no impact scratches. Appears to be a stress fracture during latching.',
    timestamp: '2026-06-19 11:20'
  }
];

// Service HQ canned system replies for responsive interactions
export const HQ_AUTOREPLIES: { [key: string]: string[] } = {
  'Warranty Claim': [
    "Thank you for the update. Our regional technician team has reviewed your query. Under our 'Global Protection Warranty', your claim has been standard-approved. We are dispatching the replacement unit via BlueDart today. Docket ID: AXI-TRK-74912.",
    "We have reviewed the submitted photos. Please secure the damaged item at your physical dealership and mark it 'WARRANTY RETURNED'. Our logistics collector will pick it up on our weekly rounds this Friday.",
    "Initial evaluation shows potential physical impact marks. Please arrange to ship the item back to our main Hosur factory for diagnostic assessment. We will issue a credit voucher immediately once the inspection evaluates it as a mechanical failure."
  ],
  'Parts Support': [
    "Confirmed. We have checked our central fulfillment hub in Pune, and we have enough buffers available. A consignment of 15x units has been reserved for your branch and is being billed. Expect delivery within 36 hours.",
    "Currently, that particular spare part (Knee shield inserts) is heavily backed up in transit from our overseas factory. Temporary ETA is 10 days. We suggest transferring shares from Delhi branch if urgent.",
    "Parts list has been parsed. We have logged this under your Dealer Consignment account. A shipping manifest has been created and logged in the Axigear Central system."
  ],
  'Technical Query': [
    "Please update the firmware of standard units immediately. Note our manual step: Press & hold Power+Mesh buttons for 6 seconds until green lights pulsate, then connect to PC via type-C for the v2.2 flash update.",
    "Our central product tech lead Rajesh has analyzed this query. This is a known batch variation. We have released an OTA patch. Please consult the service bulletin sent to your branch's registered email.",
    "We are setting up a specialized online remote debugging session for your technical technician with our head developer tomorrow at 11 AM. Please keep the unit charged and ready."
  ],
  'Return Merchandise Support': [
    "Merchandise Return authorized. Please print the RMA slip and drop inside the return carton. Ensure all components and retail boxes are in place to receive full dealer credit.",
    "We can only process returns on units sold / allocated within the past 30 days. Let us verify the original consignment dispatch date for this batch before we issue authorization.",
    "We have received the returned goods at the Central Depot. Stock count verified. A credit note matching the invoice amount has been adjusted in your dealer portal billing workspace."
  ]
};
export const SYSTEM_CATEGORIES = [
  'Helmets',
  'Riding Jackets',
  'Riding Pants',
  'Gloves',
  'Footwear',
  'Electronics',
  'Spare Parts'
];
