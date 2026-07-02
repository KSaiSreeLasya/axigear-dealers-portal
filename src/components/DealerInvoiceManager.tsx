import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Edit2, Download, Search, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Dealer } from '../types';

interface InvoiceProductRow {
  product: string;
  description: string;
  unit: number;
  amount: number;
  gstRate: number; // e.g. 18 for 18%
}

interface SavedInvoice {
  id: string;
  type: 'product' | 'spare';
  invoiceNumber: string;
  dealerName: string;
  contactNo: string;
  location: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;
  sentTo: string;
  shipTo: string;
  paymentMode: string;
  leadSource: string;
  labourCharges: number;
  items: InvoiceProductRow[];
  totalAmount: number;
  taxableValue: number;
  gstAmount: number;
}

interface DealerInvoiceManagerProps {
  dealers: Dealer[];
  currentDealer: Dealer;
}

export default function DealerInvoiceManager({ dealers, currentDealer }: DealerInvoiceManagerProps) {
  const [activeTab, setActiveTab] = useState<'product' | 'spare'>('product');

  // --- Saved Invoices Database synced to localStorage ---
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>(() => {
    const disk = localStorage.getItem('axigear_dealer_invoice_data');
    if (disk) return JSON.parse(disk);
    
    // Seed initial invoices from Image 9 & 10
    return [
      {
        id: 'inv-seed-1',
        type: 'product',
        invoiceNumber: 'DLR/2026-27/001',
        dealerName: 'RAMYARAJ Enterprises LLP',
        contactNo: '9700869247',
        location: 'Hyderabad',
        invoiceDate: '2026-06-18',
        dueDate: '2026-07-22',
        poNumber: 'PO-98442',
        sentTo: 'Ramyaraj Officer',
        shipTo: 'Main Branch Hyderabad',
        paymentMode: 'Cash',
        leadSource: 'Corporate Referral',
        labourCharges: 0,
        items: [
          { product: 'Axigear Electric Bike', description: 'Dual Battery Pro', unit: 1, amount: 730462.71, gstRate: 18 }
        ],
        totalAmount: 861946.00,
        taxableValue: 730462.71,
        gstAmount: 131483.29
      },
      {
        id: 'inv-seed-2',
        type: 'spare',
        invoiceNumber: 'SPARE/2026-27/001',
        dealerName: 'fghjkl',
        contactNo: '4567890',
        location: 'Bangalore',
        invoiceDate: '2026-06-22',
        dueDate: '2026-07-22',
        poNumber: 'PO-3245',
        sentTo: 'Branch Admin',
        shipTo: 'Aisle 3 Depot',
        paymentMode: 'Cash',
        leadSource: 'Walk In',
        labourCharges: 0,
        items: [
          { product: 'Brake Shoe Spark', description: 'Heavy duty spares', unit: 1, amount: 12118.64, gstRate: 18 }
        ],
        totalAmount: 14300.00,
        taxableValue: 12118.64,
        gstAmount: 2181.36
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('axigear_dealer_invoice_data', JSON.stringify(savedInvoices));
  }, [savedInvoices]);

  // --- Form States (Product & Spares share key visual bindings) ---
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedDealerId, setSelectedDealerId] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [location, setLocation] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('2026-06-22');
  const [dueDate, setDueDate] = useState('2026-07-22');
  const [poNumber, setPoNumber] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [shipTo, setShipTo] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [leadSource, setLeadSource] = useState('');
  const [labourCharges, setLabourCharges] = useState<number>(0);

  // Dynamic Line items list
  const [lineItems, setLineItems] = useState<InvoiceProductRow[]>([
    { product: '', description: '', unit: 1, amount: 0, gstRate: 18 }
  ]);

  // Autofill invoice numbers depending on type tab toggles
  useEffect(() => {
    const nextNum = savedInvoices.filter(i => i.type === activeTab).length + 1;
    const pad = String(nextNum).padStart(3, '0');
    if (activeTab === 'product') {
      setInvoiceNumber(`DLR/2026-${~~(Math.random()*10)+26}/${pad}`);
    } else {
      setInvoiceNumber(`SPARE/2026-${~~(Math.random()*10)+26}/${pad}`);
    }
  }, [activeTab, savedInvoices]);

  // Autofill properties on select dealer
  const handleDealerChange = (id: string) => {
    setSelectedDealerId(id);
    const del = dealers.find(d => d.id === id);
    if (del) {
      setContactNo(del.phone);
      setLocation(del.location);
    }
  };

  // Line item modifiers
  const handleAddLineRow = () => {
    setLineItems([...lineItems, { product: '', description: '', unit: 1, amount: 0, gstRate: 18 }]);
  };

  const handleRemoveLineRow = (idx: number) => {
    if (lineItems.length === 1) {
      setLineItems([{ product: '', description: '', unit: 1, amount: 0, gstRate: 18 }]);
    } else {
      setLineItems(lineItems.filter((_, i) => i !== idx));
    }
  };

  const handleLineChange = (index: number, field: keyof InvoiceProductRow, value: any) => {
    const next = [...lineItems];
    if (field === 'unit' || field === 'amount' || field === 'gstRate') {
      next[index][field] = Number(value);
    } else {
      next[index][field] = value;
    }
    setLineItems(next);
  };

  // Calculations
  const calculateTotals = () => {
    let taxableValue = 0;
    let gstAmount = 0;
    
    lineItems.forEach(item => {
      const lineSub = item.unit * item.amount;
      taxableValue += lineSub;
      gstAmount += (lineSub * (item.gstRate / 100));
    });

    const totalAmount = taxableValue + gstAmount + Number(labourCharges);

    return {
      taxableValue,
      gstAmount,
      totalAmount
    };
  };

  const totals = calculateTotals();

  // Save the invoice
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceNumber) {
      alert('Invoice number is required.');
      return;
    }

    const selectedDealer = dealers.find(d => d.id === selectedDealerId);
    const dName = selectedDealer ? selectedDealer.name : (selectedDealerId || 'Walk In Customer');

    const verifiedItems = lineItems.filter(item => item.product.trim() !== '');
    if (verifiedItems.length === 0) {
      alert('Invoice must have at least one valid product product row.');
      return;
    }

    const newInvoice: SavedInvoice = {
      id: `saved-dlr-inv-${Math.floor(1000 + Math.random() * 9000)}`,
      type: activeTab,
      invoiceNumber,
      dealerName: dName,
      contactNo,
      location,
      invoiceDate,
      dueDate,
      poNumber,
      sentTo,
      shipTo,
      paymentMode,
      leadSource,
      labourCharges,
      items: verifiedItems,
      totalAmount: Math.round(totals.totalAmount * 100) / 100,
      taxableValue: Math.round(totals.taxableValue * 100) / 100,
      gstAmount: Math.round(totals.gstAmount * 100) / 100
    };

    setSavedInvoices([newInvoice, ...savedInvoices]);

    // Cleanup form
    setSelectedDealerId('');
    setContactNo('');
    setLocation('');
    setPoNumber('');
    setSentTo('');
    setShipTo('');
    setLabourCharges(0);
    setLeadSource('');
    setLineItems([{ product: '', description: '', unit: 1, amount: 0, gstRate: 18 }]);
    alert('Invoice saved successfully!');
  };

  const handleDeleteInvoice = (id: string) => {
    setSavedInvoices(savedInvoices.filter(x => x.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-sans">Dealer Invoice</h1>
        <p className="text-gray-500 text-xs mt-1">Create and manage dealer product invoices.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('product')}
          className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
            activeTab === 'product' 
              ? 'bg-emerald-700 text-white shadow' 
              : 'bg-gray-105 text-gray-500 hover:text-gray-800'
          }`}
        >
          Product Invoices
        </button>
        <button
          onClick={() => setActiveTab('spare')}
          className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
            activeTab === 'spare' 
              ? 'bg-emerald-700 text-white shadow' 
              : 'bg-gray-105 text-gray-500 hover:text-gray-800'
          }`}
        >
          Spares Invoices
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleCreateInvoiceSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">
          {activeTab === 'product' ? 'Create New Invoice' : 'Create New Spares Invoice'}
        </h2>

        {/* Master Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Invoice Number</label>
            <input
              type="text"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-white text-gray-850 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Dealer Name</label>
            <select
              required
              value={selectedDealerId}
              onChange={(e) => handleDealerChange(e.target.value)}
              className="w-full bg-white text-gray-850 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            >
              <option value="">Select or enter dealer name</option>
              {dealers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
              <option value="Custom Walk-In">Custom Walk-In</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Contact No</label>
            <input
              type="text"
              placeholder="Contact number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Location</label>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Invoice Date</label>
            <input
              type="date"
              required
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">P.O.# (Purchase Order Number)</label>
            <input
              type="text"
              placeholder="e.g., PO-12345"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Sent To</label>
            <input
              type="text"
              placeholder="Contact person name"
              value={sentTo}
              onChange={(e) => setSentTo(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Ship To</label>
            <input
              type="text"
              placeholder="Shipping address"
              value={shipTo}
              onChange={(e) => setShipTo(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Mode of Payment</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Lead Source</label>
            <input
              type="text"
              placeholder="Lead source"
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Labour Charges</label>
            <input
              type="number"
              value={labourCharges}
              onChange={(e) => setLabourCharges(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Products line list table matching styling of image 9 */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-800 border-b pb-1 uppercase tracking-wide">
            {activeTab === 'product' ? 'Products' : 'Spares Products'}
          </h3>

          <div className="overflow-x-auto border rounded-xl bg-gray-50/50">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-gray-100 border-b text-[10px] text-gray-500 font-mono uppercase">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 w-16 text-center">Unit</th>
                  <th className="py-2.5 px-3 w-28 text-right">Amount</th>
                  <th className="py-2.5 px-3 w-24 text-center">GST Rate</th>
                  <th className="py-2.5 px-3 w-28 text-right">Total</th>
                  <th className="py-2.5 px-3 w-28 text-right">GST Amt</th>
                  <th className="py-2.5 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white">
                {lineItems.map((item, idx) => {
                  const lineTotal = item.unit * item.amount;
                  const itemGst = lineTotal * (item.gstRate / 100);
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50/30">
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          placeholder={activeTab === 'product' ? "Product name" : "Spare name"}
                          value={item.product}
                          onChange={(e) => handleLineChange(idx, 'product', e.target.value)}
                          className="w-full bg-white text-xs border border-gray-200 rounded py-1 px-2 focus:outline-none focus:border-emerald-600"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                          className="w-full bg-white text-xs border border-gray-200 rounded py-1 px-2 focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          value={item.unit}
                          onChange={(e) => handleLineChange(idx, 'unit', e.target.value)}
                          className="w-full text-center bg-white text-xs border border-gray-200 rounded py-1 px-1 focus:outline-none font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="any"
                          value={item.amount}
                          onChange={(e) => handleLineChange(idx, 'amount', e.target.value)}
                          className="w-full text-right bg-white text-xs border border-gray-200 rounded py-1 px-1 focus:outline-none font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={item.gstRate}
                          onChange={(e) => handleLineChange(idx, 'gstRate', e.target.value)}
                          className="w-full bg-white text-xs border border-gray-200 rounded py-1 px-1 focus:outline-none font-mono"
                        >
                          <option value="18">GST 18%</option>
                          <option value="12">GST 12%</option>
                          <option value="5">GST 5%</option>
                          <option value="0">GST 0%</option>
                        </select>
                      </td>
                      <td className="p-2 text-right font-mono font-semibold text-gray-800">
                        ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 text-right font-mono text-gray-500 text-[11px]">
                        ₹{itemGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineRow(idx)}
                          className="text-rose-500 hover:text-rose-800 hover:bg-rose-50 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddLineRow}
            className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-bold text-gray-600 hover:text-emerald-700 bg-white border border-dashed border-gray-300 hover:border-emerald-600 rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'product' ? 'Add Product' : 'Add Spare'}</span>
          </button>
        </div>

        {/* Calculating Brick */}
        <div className="bg-gray-100/50 rounded-xl p-4 md:p-6 border flex flex-col md:flex-row justify-between items-end gap-6 text-xs font-mono font-semibold">
          <div className="text-gray-500 max-w-sm font-sans normal-case text-center md:text-left">
            Review taxable value and consolidated GST logs automatically derived from line items. Includes customizable labor charges and precomputed outputs.
          </div>
          <div className="w-full md:w-80 space-y-2 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="flex justify-between text-gray-505">
              <span>Product Total:</span>
              <span>₹{totals.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-505">
              <span>Taxable Value:</span>
              <span>₹{totals.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-505 pb-2 border-b">
              <span>GST (18% Avg):</span>
              <span>₹{totals.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-950 font-black text-sm pt-1">
              <span>TOTAL AMOUNT:</span>
              <span className="text-emerald-800">₹{totals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Complete Creation Trigger button */}
        <div className="flex justify-start">
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-850 text-white font-bold py-2.5 px-8 rounded-lg text-xs tracking-wider transition-all cursor-pointer shadow-sm shadow-emerald-700/10"
          >
            Create Invoice
          </button>
        </div>
      </form>

      {/* CSV/Excel Import Export Utilities block */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3">
        <button
          onClick={() => alert('Feature simulated: CSV invoices templates loaded successfully')}
          className="flex items-center gap-1.5 bg-white border text-gray-700 py-1.5 px-3 rounded-lg text-xs font-semibold hover:border-emerald-600 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Import CSV/Excel</span>
        </button>
        <button
          onClick={() => alert('Download initiated: Invoice ledger synced')}
          className="flex items-center gap-1.5 bg-white border text-gray-700 py-1.5 px-3 rounded-lg text-xs font-semibold hover:border-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Export CSV</span>
        </button>
        <button
          onClick={() => alert('Excel compilation triggered')}
          className="flex items-center gap-1.5 bg-white border text-gray-700 py-1.5 px-3 rounded-lg text-xs font-semibold hover:border-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Export Excel</span>
        </button>
        <span className="text-[10px] text-gray-400 font-sans italic md:ml-auto">
          CSV/Excel files must have headers matching column names (e.g., dealerInvoiceNo, dealerName, etc.)
        </span>
      </div>

      {/* Saved Invoices table matching styling across Image 9 & 10 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-gray-950 uppercase tracking-wide">
            {activeTab === 'product' ? 'Saved Invoices' : 'Saved Spares Invoices'} ({savedInvoices.filter(i => i.type === activeTab).length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-250 bg-gray-55 text-gray-400 font-mono text-[9px] uppercase font-bold text-center">
                <th className="py-2.5 px-4 text-left">Invoice #</th>
                <th className="py-2.5 px-4 text-left">Dealer</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 font-mono">Payment</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-gray-700 text-center">
              {savedInvoices.filter(i => i.type === activeTab).map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="py-3.5 px-4 text-left font-bold text-gray-950">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 text-left font-semibold text-emerald-800 truncate max-w-[200px]">{inv.dealerName}</td>
                  <td className="py-3.5 px-4 font-mono">{inv.invoiceDate}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-905 font-mono text-right">
                    ₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[10px] text-gray-650 uppercase font-mono">{inv.paymentMode}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => alert(`Reviewing invoice: ${inv.invoiceNumber}\nDealer: ${inv.dealerName}\nTotal Items: ${inv.items.length}\nTotal: ₹${inv.totalAmount}`)}
                        className="px-2.5 py-1 bg-gray-50 border hover:bg-gray-100 rounded text-[11px] font-bold text-gray-700 cursor-pointer"
                      >
                        Preview
                      </button>
                      <button className="p-1 px-1.5 text-gray-500 hover:bg-gray-100 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="p-1 px-1.5 text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {savedInvoices.filter(i => i.type === activeTab).length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">No saved invoices found for this selection.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
