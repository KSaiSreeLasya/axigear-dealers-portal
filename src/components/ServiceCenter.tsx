import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  LifeBuoy,
  CornerDownRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ServiceTicket, ServiceMessage, Dealer } from '../types';
import { HQ_AUTOREPLIES } from '../data/mockData';

interface ServiceCenterProps {
  currentDealer: Dealer;
  tickets: ServiceTicket[];
  messages: ServiceMessage[];
  onSubmitTicket: (ticket: Omit<ServiceTicket, 'id' | 'dealerId' | 'createdAt' | 'lastUpdated'>) => void;
  onSendMessage: (ticketId: string, content: string, sender: 'dealer' | 'service_center') => void;
}

export default function ServiceCenter({
  currentDealer,
  tickets,
  messages,
  onSubmitTicket,
  onSendMessage
}: ServiceCenterProps) {
  
  // Isolated tickets
  const dealerTickets = tickets.filter(t => t.dealerId === currentDealer.id);
  
  // Active ticket selection
  const [activeTicketId, setActiveTicketId] = useState<string | null>(dealerTickets[0]?.id || null);
  const activeTicket = dealerTickets.find(t => t.id === activeTicketId) || null;

  // Messages thread for active ticket
  const activeMessages = messages.filter(m => m.ticketId === activeTicketId);

  // Form input states
  const [typedMessage, setTypedMessage] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState<'Warranty Claim' | 'Parts Support' | 'Technical Query' | 'Return Merchandise Support'>('Warranty Claim');
  const [formPriority, setFormPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [formDescription, setFormDescription] = useState('');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  useEffect(() => {
    if (!activeTicketId && dealerTickets.length > 0) {
      setActiveTicketId(dealerTickets[0].id);
    }
  }, [dealerTickets, activeTicketId]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject || !formDescription) return;

    onSubmitTicket({
      subject: formSubject,
      category: formCategory,
      priority: formPriority,
      status: 'Open',
      description: formDescription
    });

    setFormSubject('');
    setFormDescription('');
    setIsNewTicketOpen(false);
    alert('Support claim successfully generated.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeTicketId) return;

    const currentMsg = typedMessage.trim();
    onSendMessage(activeTicketId, currentMsg, 'dealer');
    setTypedMessage('');

    // Simulated reply from central HQ representative
    setTimeout(() => {
      const categoryReplies = HQ_AUTOREPLIES[activeTicket?.category || 'Warranty Claim'] || [
        "Your message is received. An Axigear support representative has been assigned to verify this query."
      ];
      const randomReply = categoryReplies[Math.floor(Math.random() * categoryReplies.length)];
      onSendMessage(activeTicketId, randomReply, 'service_center');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-sans">Service Center Support</h1>
          <p className="text-gray-500 text-xs mt-1">
            Initiate parts replacement tickets or message the Axigear support headquarters directly.
          </p>
        </div>
        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-850 text-white font-bold py-2.5 px-5 rounded-lg text-xs tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-emerald-205" />
          <span>New support ticket</span>
        </button>
      </div>

      {/* Main chat interface grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[580px] items-stretch">
        
        {/* Left Hand side: Ticket Roster */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b bg-gray-50 shrink-0">
            <h3 className="font-bold text-gray-950 text-xs uppercase tracking-wide">Support Tickets List</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Dealer station tickets ({dealerTickets.length})</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-150">
            {dealerTickets.length === 0 ? (
              <div className="text-center p-8 py-24 text-gray-400 space-y-2">
                <Wrench className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-bold text-gray-800">No active tickets</p>
                <p className="text-[10px]">Create a new ticket using the button above.</p>
              </div>
            ) : (
              dealerTickets.map((tkt) => {
                const isActive = tkt.id === activeTicketId;
                const isHigh = tkt.priority === 'High';
                
                return (
                  <button
                    key={tkt.id}
                    onClick={() => setActiveTicketId(tkt.id)}
                    className={`w-full text-left p-4 transition-all flex flex-col gap-2 relative cursor-pointer ${
                      isActive ? 'bg-emerald-50/40 border-l-4 border-emerald-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        tkt.category === 'Warranty Claim' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        tkt.category === 'Parts Support' ? 'bg-orange-50 text-orange-750 border border-orange-100' :
                        'bg-blue-50 text-blue-750 border border-blue-100'
                      }`}>
                        {tkt.category}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase ${
                        isHigh ? 'text-rose-600 font-extrabold' : 'text-gray-400'
                      }`}>
                        {tkt.priority} Priority
                      </span>
                    </div>

                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{tkt.subject}</p>
                    
                    <div className="flex items-center justify-between text-[10px] text-gray-450 pt-1">
                      <div className="flex items-center gap-1">
                        {tkt.status === 'Resolved' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        {tkt.status === 'In Progress' && <Clock className="w-3.5 h-3.5 text-orange-500" />}
                        {tkt.status === 'Open' && <AlertCircle className="w-3.5 h-3.5 text-blue-500" />}
                        <span className="font-bold uppercase tracking-wider">{tkt.status}</span>
                      </div>
                      <span className="font-mono text-[9px]">{tkt.lastUpdated}</span>
                    </div>

                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Hand side: Chat Messenger Window */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col lg:col-span-2 overflow-hidden h-full">
          {activeTicket ? (
            <>
              {/* Context Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 shrink-0 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                      ID: {activeTicket.id}
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      {activeTicket.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-sans font-bold text-gray-950 truncate mt-1">{activeTicket.subject}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-400 block font-bold uppercase">Ticket Status</span>
                  <span className={`text-xs font-bold uppercase ${
                    activeTicket.status === 'Resolved' ? 'text-emerald-700' :
                    activeTicket.status === 'In Progress' ? 'text-orange-600' : 'text-blue-600'
                  }`}>{activeTicket.status}</span>
                </div>
              </div>

              {/* Chat view frame */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/20 space-y-4">
                
                {/* Description card */}
                <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-1 mx-auto max-w-[95%]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-black text-gray-400 tracking-wider">
                      Initial Issue description
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">{activeTicket.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">{activeTicket.description}</p>
                </div>

                {/* Messages stream */}
                {activeMessages.map((msg) => {
                  const isDealer = msg.sender === 'dealer';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col gap-1 max-w-[85%] ${isDealer ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1">
                        {isDealer ? `${currentDealer.name} Dealership` : 'Axigear Headquarters representative'}
                      </span>

                      <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        isDealer 
                          ? 'bg-emerald-700 text-white border-emerald-800 rounded-tr-none shadow-xs'
                          : 'bg-white text-gray-800 border-gray-200 rounded-tl-none shadow-xs'
                      }`}>
                        <p>{msg.content}</p>
                      </div>

                      <span className="font-mono text-[8px] text-gray-400 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat action footer bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type a support claim response or query specs..."
                  className="flex-1 bg-white border border-gray-200 text-xs text-gray-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-emerald-700"
                />
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-850 text-white p-2.5 rounded-lg transition-all cursor-pointer active:scale-95 shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-300 animate-bounce-none" />
              <p className="text-xs font-bold text-gray-800">No ticket is selected</p>
              <p className="text-[11px] text-center">Raise or select a registered support ticket from the side roster list to initiate chat logs.</p>
            </div>
          )}
        </div>

      </div>

      {/* Raised Ticket claim Dialog Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-gray-800">
            
            <div className="bg-gray-50 p-5 flex items-center justify-between border-b">
              <div>
                <h3 className="font-bold text-base text-gray-950 font-sans">Submit Support Request</h3>
                <p className="text-[10px] text-gray-500">Connecting branch terminal {currentDealer.code}</p>
              </div>
              <button 
                onClick={() => setIsNewTicketOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-450 uppercase">Subject Topic</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Broken throttle body claim under warranty"
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-450 uppercase">Category type</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="Warranty Claim">Warranty Claim</option>
                    <option value="Parts Support">Parts Support</option>
                    <option value="Technical Query">Technical Query</option>
                    <option value="Return Merchandise Support">Return Merchandise Support</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-450 uppercase">Priority level</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full text-xs text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="Low">Low - Informational</option>
                    <option value="Medium">Medium - Regular replacement</option>
                    <option value="High">High - Urgent escalation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-450 uppercase">Detailed Description & SKU Numbers</label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Insert exact problem breakdown. List vehicle model, delivery invoice ID or client registration code if claiming parts warranty."
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-850 text-white font-bold px-5 py-2.5 rounded-lg text-xs"
                >
                  File Support Claim
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
