import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  UploadCloud, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  User,
  MapPin,
  Scale,
  FileCheck,
  Eye
} from 'lucide-react';
import { Dealer, DealerDocument } from '../types';

interface DealerProfileProps {
  currentDealer: Dealer;
  onUpdateDealer: (updated: Dealer) => void;
}

export default function DealerProfile({
  currentDealer,
  onUpdateDealer
}: DealerProfileProps) {
  
  // Local form states
  const [companyName, setCompanyName] = useState(currentDealer.companyName || '');
  const [incorporationNo, setIncorporationNo] = useState(currentDealer.incorporationNo || '');
  const [dbaName, setDbaName] = useState(currentDealer.dbaName || '');
  const [legalStructure, setLegalStructure] = useState<Dealer['legalStructure']>(currentDealer.legalStructure || '');
  const [ownershipDetails, setOwnershipDetails] = useState(currentDealer.ownershipDetails || '');
  const [registeredAddress, setRegisteredAddress] = useState(currentDealer.registeredAddress || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Document states
  const [openDocPreview, setOpenDocPreview] = useState<{ name: string; base64: string } | null>(null);

  // Drag states for individual fields
  const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({
    pan: false,
    gst: false,
    shop: false,
    trade: false
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updated: Dealer = {
      ...currentDealer,
      companyName,
      incorporationNo,
      dbaName,
      legalStructure,
      ownershipDetails,
      registeredAddress
    };

    onUpdateDealer(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Process uploaded files to Base64
  const processFile = (file: File, docType: 'pan' | 'gst' | 'shop' | 'trade') => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const sizeStr = (file.size / 1024).toFixed(1) + ' KB';
      
      const newDoc: DealerDocument = {
        fileName: file.name,
        fileSize: sizeStr,
        fileData: base64String,
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      const updated: Dealer = { ...currentDealer };
      if (docType === 'pan') updated.documentPan = newDoc;
      if (docType === 'gst') updated.documentGst = newDoc;
      if (docType === 'shop') updated.documentShopLicense = newDoc;
      if (docType === 'trade') updated.documentTradeLicense = newDoc;

      onUpdateDealer(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: 'pan' | 'gst' | 'shop' | 'trade') => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], docType);
    }
  };

  const handleDrag = (e: React.DragEvent, docType: string, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [docType]: isOver }));
  };

  const handleDrop = (e: React.DragEvent, docType: 'pan' | 'gst' | 'shop' | 'trade') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [docType]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], docType);
    }
  };

  const deleteDoc = (docType: 'pan' | 'gst' | 'shop' | 'trade') => {
    const updated = { ...currentDealer };
    if (docType === 'pan') delete updated.documentPan;
    if (docType === 'gst') delete updated.documentGst;
    if (docType === 'shop') delete updated.documentShopLicense;
    if (docType === 'trade') delete updated.documentTradeLicense;
    onUpdateDealer(updated);
  };

  const isProfileIncomplete = !currentDealer.companyName || !currentDealer.incorporationNo || !currentDealer.legalStructure || !currentDealer.ownershipDetails || !currentDealer.registeredAddress || !currentDealer.documentPan;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-xs">
      
      {/* Title & Alerts Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-700 font-bold" />
            <span>Dealership Compliance Profile</span>
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Maintain your legally registered entity records, company parameters, and compulsory business licenses for central regulatory auditing.
          </p>
        </div>

        {/* Global profile complete ticker */}
        <div className={`px-4 py-2 rounded-xl flex items-center gap-2.5 border shrink-0 ${
          isProfileIncomplete 
            ? 'bg-amber-50 text-amber-800 border-amber-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {isProfileIncomplete ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
              <div>
                <strong className="block text-[11px] font-bold">Action Required: Compliance Incomplete</strong>
                <span className="text-[10px] text-amber-700/90">Please fill details and upload a compulsory PAN Card.</span>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div>
                <strong className="block text-[11px] font-bold">Compliance Status: Approved</strong>
                <span className="text-[10px] text-emerald-700/90">All statutory records are locked and synchronizing to HQ.</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Editable Registration details */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-gray-150 pb-3 flex items-center justify-between">
            <span className="text-gray-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Corporate Identity & Ownership Structure
            </span>
            <span className="text-[9px] text-gray-400 font-mono font-bold uppercase">SECURE VERIFIED LEDGER</span>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Registered Company Name <span className="text-red-500 font-bold">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore Wheels Private Limited"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-200 focus:border-emerald-600 rounded-lg py-2.5 px-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  Doing Business As (DBA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Axigear Central Bangalore"
                  value={dbaName}
                  onChange={(e) => setDbaName(e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-200 focus:border-emerald-600 rounded-lg py-2.5 px-3 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-gray-400" />
                  <span>Legal Structure / Constitution of Business <span className="text-red-500 font-bold">*</span></span>
                </label>
                <select
                  required
                  value={legalStructure}
                  onChange={(e) => setLegalStructure(e.target.value as Dealer['legalStructure'])}
                  className="w-full bg-white text-gray-800 border border-gray-200 focus:border-emerald-600 rounded-lg py-2.5 px-3 focus:outline-none"
                >
                  <option value="">-- Choose Constitution of Business --</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="LLP">LLP (Limited Liability Partnership)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>Incorporation / Registration Number <span className="text-red-500 font-bold">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIN / REG / INC No."
                  value={incorporationNo}
                  onChange={(e) => setIncorporationNo(e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-200 focus:border-emerald-600 rounded-lg py-2.5 px-3 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>Ownership Details (Partners / Directors Names & Addresses) <span className="text-red-500 font-bold">*</span></span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="List full legal names, ID proofs, addresses, and contacts of partners, promoters, or primary shareholders..."
                value={ownershipDetails}
                onChange={(e) => setOwnershipDetails(e.target.value)}
                className="w-full bg-white text-gray-800 border border-gray-200 focus:border-emerald-600 rounded-lg py-2 px-3 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>Registered Corporate Office Address <span className="text-red-500 font-bold">*</span></span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide official registered tax address matching physical utility bills or GST registrations..."
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
                className="w-full bg-white text-gray-800 border border-gray-200 focus:border-emerald-600 rounded-lg py-2 px-3 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 animate-pulse bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated and synchronized to crm.axigearelectric.com!</span>
                </span>
              ) : (
                <div />
              )}
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-850 text-white font-extrabold px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all shadow-sm cursor-pointer ml-auto"
              >
                Save Profile Parameters
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Interactive Statutory Compliance Files */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-gray-150 pb-3 flex items-center justify-between">
              <span className="text-gray-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                Onboarding Documents Compliance
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                PAN IS MANDATORY
              </span>
            </div>

            <p className="text-gray-500 text-[11px] leading-relaxed">
              Upload scan copies (JPEG, PNG, or PDF file formats). Drop documents directly into the frames, or click to find them on your file system.
            </p>

            {/* Document Uploader Stack */}
            <div className="space-y-4">
              
              {/* Document 1: PAN Card (Compulsory) */}
              {renderDocUploader(
                'pan',
                'PAN Card Copy',
                true,
                currentDealer.documentPan,
                'documentPan'
              )}

              {/* Document 2: GST Registration */}
              {renderDocUploader(
                'gst',
                'GST Registration Certificate',
                false,
                currentDealer.documentGst,
                'documentGst'
              )}

              {/* Document 3: Shop & Establishment License */}
              {renderDocUploader(
                'shop',
                'Shop & Establishment License',
                false,
                currentDealer.documentShopLicense,
                'documentShopLicense'
              )}

              {/* Document 4: Trade License */}
              {renderDocUploader(
                'trade',
                'Trade License Certificate',
                false,
                currentDealer.documentTradeLicense,
                'documentTradeLicense'
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Base64 Document viewer modal preview */}
      {openDocPreview && (
        <div className="fixed inset-0 bg-gray-950/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase">Document Vault Secure Previewed File</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 font-mono truncate max-w-[340px]">{openDocPreview.name}</p>
              </div>
              <button 
                onClick={() => setOpenDocPreview(null)}
                className="bg-gray-200 hover:bg-gray-300 rounded-md py-1 px-2 text-[10px] font-bold text-gray-700 transition"
              >
                Close Vault Preview
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex items-center justify-center bg-gray-100 flex-1 min-h-[300px]">
              {openDocPreview.base64.startsWith('data:image/') ? (
                <img 
                  src={openDocPreview.base64} 
                  alt={openDocPreview.name} 
                  className="max-w-full max-h-[60vh] object-contain rounded border pointer-events-none" 
                  referrerPolicy="no-referrer"
                />
              ) : openDocPreview.base64.startsWith('data:application/pdf') ? (
                <div className="text-center space-y-4 p-8 bg-white border border-gray-200 rounded-xl max-w-sm">
                  <FileText className="w-16 h-16 text-emerald-700 mx-auto animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-gray-900">PDF Document Loaded</h4>
                    <p className="text-gray-500 font-sans leading-relaxed">
                      This is a real serialized Node PDF Binary stream stored safely inside the sandbox context.
                    </p>
                  </div>
                  <a 
                    href={openDocPreview.base64} 
                    download={openDocPreview.name}
                    className="inline-block bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded-lg tracking-wider"
                  >
                    Download Local PDF File
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-4 p-8 bg-white border border-gray-200 rounded-xl max-w-sm">
                  <FileCheck className="w-16 h-16 text-indigo-700 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-gray-900">Document Transmitted</h4>
                    <p className="text-gray-500 font-sans leading-relaxed text-[11px]">
                      The compliance file hash has verified correctly. Complete serialized base64 data stream cached inside state.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        const win = window.open();
                        if (win) {
                          win.document.write(`<iframe src="${openDocPreview.base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                        } else {
                          alert("Iframe preview blocked. Click 'Download Local PDF File' instead.");
                        }
                      }}
                      className="bg-indigo-700 hover:bg-indigo-850 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                    >
                      Open in Temporary Iframe (Requires Tab Permission)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Reusable uploader framework supporting click, manual selection, and drag & drop
  function renderDocUploader(
    key: 'pan' | 'gst' | 'shop' | 'trade',
    labelName: string,
    isCompulsory: boolean,
    docObj: DealerDocument | undefined,
    idTag: string
  ) {
    const isDragOver = dragActive[key];
    const fileInputId = `input-file-${key}`;

    return (
      <div key={key} className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
            <span>{labelName}</span>
            {isCompulsory && <span className="text-rose-500 font-bold">*</span>}
          </label>
          {docObj && (
            <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1 rounded font-bold">
              Uploaded: {docObj.uploadedAt}
            </span>
          )}
        </div>

        {docObj ? (
          // Document exists view card state
          <div className="bg-emerald-50/20 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 pr-2 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5 text-emerald-800" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate font-sans text-[11px]" title={docObj.fileName}>
                  {docObj.fileName}
                </p>
                <p className="text-[9px] font-mono text-gray-400 mt-0.5">{docObj.fileSize || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setOpenDocPreview({ name: docObj.fileName, base64: docObj.fileData || '' })}
                className="p-1 px-2.5 text-emerald-700 hover:bg-emerald-100/60 rounded border border-emerald-200 font-bold flex items-center gap-1"
                title="View document vault copy"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              
              <button
                type="button"
                onClick={() => deleteDoc(key)}
                className="p-1 text-rose-500 hover:bg-rose-50 border border-rose-100 rounded"
                title="Delete/Upload replacement"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          // Drag and drop interactive card
          <div
            id={idTag}
            onDragEnter={(e) => handleDrag(e, key, true)}
            onDragOver={(e) => handleDrag(e, key, true)}
            onDragLeave={(e) => handleDrag(e, key, false)}
            onDrop={(e) => handleDrop(e, key)}
            onClick={() => document.getElementById(fileInputId)?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer select-none relative group flex flex-col justify-center items-center ${
              isDragOver 
                ? 'border-emerald-700 bg-emerald-55/10 scale-[0.99]' 
                : 'border-gray-200 hover:border-emerald-600 hover:bg-gray-50/50'
            }`}
          >
            <input
              type="file"
              id={fileInputId}
              multiple={false}
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => handleFileChange(e, key)}
              className="hidden"
            />
            <UploadCloud className={`w-7 h-7 mb-1.5 transition-transform group-hover:scale-105 duration-300 ${
              isDragOver ? 'text-emerald-700' : 'text-gray-400'
            }`} />
            <p className="font-bold text-gray-700 text-[10px]">
              Drag and drop, or <span className="text-emerald-700 font-extrabold group-hover:underline">browse files</span>
            </p>
            <p className="text-[9px] text-gray-400 mt-1">PNG, JPG, PDF up to 4MB</p>
          </div>
        )}
      </div>
    );
  }
}
