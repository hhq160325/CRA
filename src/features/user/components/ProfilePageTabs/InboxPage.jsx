import React, { useMemo, useState } from 'react';

const sampleMessages = [
  { id: 1, sender: 'Support', subject: 'Welcome to MORENT', body: 'Thanks for joining!', date: '2025-10-01T09:15:00Z', read: true, tag: 'system' },
  { id: 2, sender: 'Billing', subject: 'Payment received', body: 'Your last payment succeeded.', date: '2025-10-03T12:00:00Z', read: false, tag: 'billing' },
  { id: 3, sender: 'Host', subject: 'Booking approved', body: 'Your booking has been approved.', date: '2025-10-05T08:30:00Z', read: false, tag: 'booking' },
  { id: 4, sender: 'Promotions', subject: 'Weekend sale -15%', body: 'Save on luxury cars.', date: '2025-10-06T10:00:00Z', read: true, tag: 'promo' },
  { id: 5, sender: 'Support', subject: 'Policy update', body: 'We updated our ToS.', date: '2025-10-10T18:40:00Z', read: false, tag: 'system' }
];

const formatDateTime = (iso) => new Date(iso).toLocaleString();

const InboxPage = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    let data = messages;
    if (tag !== 'all') data = data.filter(m => m.tag === tag);
    if (onlyUnread) data = data.filter(m => !m.read);
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(m =>
        m.sender.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q)
      );
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [messages, tag, onlyUnread, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !m.read } : m));
  };

  const deleteMsg = (id) => {
    const msg = messages.find(m => m.id === id);
    const title = msg ? `“${msg.subject}”` : 'this message';
    const confirmed = window.confirm(`Delete ${title}? This action cannot be undone.`);
    if (!confirmed) return;
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const markAllAsRead = () => setMessages(prev => prev.map(m => ({ ...m, read: true })));

  const TagBadge = ({ name }) => {
    const color = name === 'booking' ? 'bg-green-100 text-green-700' : name === 'billing' ? 'bg-indigo-100 text-indigo-700' : name === 'promo' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700';
    return <span className={`text-xs px-2 py-0.5 rounded ${color}`}>{name}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Inbox</h2>
        <button onClick={markAllAsRead} className="text-sm px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Mark all as read</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input value={query} onChange={e=>{setQuery(e.target.value); setPage(1);}} placeholder="Search messages..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <select value={tag} onChange={e=>{setTag(e.target.value); setPage(1);}} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="all">All tags</option>
            <option value="booking">Booking</option>
            <option value="billing">Billing</option>
            <option value="promo">Promo</option>
            <option value="system">System</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={onlyUnread} onChange={e=>{setOnlyUnread(e.target.checked); setPage(1);}} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Only unread
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
        {current.length === 0 && (
          <div className="p-8 text-center text-gray-500">No messages found.</div>
        )}
        {current.map(m => (
          <div key={m.id} className={`p-4 flex items-start justify-between ${m.read ? 'bg-white' : 'bg-blue-50/30'}`}>
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${m.read ? 'bg-gray-300' : 'bg-blue-500'}`}></span>
                <span className="font-medium text-gray-900 truncate">{m.subject}</span>
                <TagBadge name={m.tag} />
              </div>
              <div className="text-sm text-gray-600 mt-1 truncate">{m.body}</div>
              <div className="text-xs text-gray-400 mt-1">{m.sender} • {formatDateTime(m.date)}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={()=>toggleRead(m.id)} className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">{m.read ? 'Mark unread' : 'Mark read'}</button>
              <button onClick={()=>deleteMsg(m.id)} className="px-2 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">Page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1, p-1))} className={`px-3 py-1 rounded border ${page===1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Prev</button>
          <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages, p+1))} className={`px-3 py-1 rounded border ${page===totalPages ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;


