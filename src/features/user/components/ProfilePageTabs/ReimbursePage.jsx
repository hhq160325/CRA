import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const initialRequests = [
  { id: 1, date: '2025-10-02', category: 'Fuel', amount: 35.5, status: 'approved', ref: 'RB-0001', note: 'Fuel for rental #1234' },
  { id: 2, date: '2025-10-08', category: 'Toll', amount: 12.0, status: 'pending', ref: 'RB-0002', note: 'Highway tolls' },
  { id: 3, date: '2025-10-11', category: 'Parking', amount: 9.0, status: 'rejected', ref: 'RB-0003', note: 'Airport parking' }
];

const currency = (n) => `$${n.toFixed(2)}`;

const ReimbursePage = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(initialRequests);
  const [form, setForm] = useState({ date: '', category: 'Fuel', amount: '', note: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return requests.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (query && !(r.ref.toLowerCase().includes(query.toLowerCase()) || r.note.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    }).sort((a,b) => b.id - a.id);
  }, [requests, statusFilter, query]);

  const totalByStatus = useMemo(() => {
    const acc = { total: 0, approved: 0, pending: 0, rejected: 0 };
    requests.forEach(r => {
      acc.total += r.amount;
      acc[r.status] += r.amount;
    });
    return acc;
  }, [requests]);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(form.amount);
    if (!form.date || !form.category || !form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
      alert('Please fill all required fields with valid values.');
      return;
    }
    const next = {
      id: requests.length ? Math.max(...requests.map(r => r.id)) + 1 : 1,
      date: form.date,
      category: form.category,
      amount: amountNum,
      status: 'pending',
      ref: `RB-${String(Math.floor(Math.random()*9000)+1000).padStart(4,'0')}`,
      note: form.note || ''
    };
    setRequests(prev => [next, ...prev]);
    setForm({ date: '', category: 'Fuel', amount: '', note: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{t('reimburse')}</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-500">{t('totalSubmitted')}</div>
          <div className="text-lg font-semibold text-gray-900">{currency(totalByStatus.total)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-500">{t('approved')}</div>
          <div className="text-lg font-semibold text-green-700">{currency(totalByStatus.approved)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-500">{t('pending')}</div>
          <div className="text-lg font-semibold text-amber-700">{currency(totalByStatus.pending)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-500">{t('rejected')}</div>
          <div className="text-lg font-semibold text-red-700">{currency(totalByStatus.rejected)}</div>
        </div>
      </div>

      {/* Submit form */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('submitReimbursement')}</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('date')}</label>
            <input name="date" type="date" value={form.date} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('category')}</label>
            <select name="category" value={form.category} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>{t('fuel')}</option>
              <option>{t('toll')}</option>
              <option>{t('parking')}</option>
              <option>{t('maintenance')}</option>
              <option>{t('other')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('amount')}</label>
            <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={onChange} placeholder="$0.00" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('note')}</label>
            <input name="note" value={form.note} onChange={onChange} placeholder={t('optionalDetails')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button type="reset" onClick={()=>setForm({ date: '', category: 'Fuel', amount: '', note: '' })} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">{t('reset')}</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{t('submit')}</button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{t('history')}</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('searchRefOrNotes')} className="w-56 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="all">{t('all')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="rejected">{t('rejected')}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left font-medium">{t('ref')}</th>
                <th className="px-3 py-2 text-left font-medium">{t('date')}</th>
                <th className="px-3 py-2 text-left font-medium">{t('category')}</th>
                <th className="px-3 py-2 text-right font-medium">{t('amount')}</th>
                <th className="px-3 py-2 text-left font-medium">{t('status')}</th>
                <th className="px-3 py-2 text-left font-medium">{t('note')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">{r.ref}</td>
                  <td className="px-3 py-2 text-gray-700">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-gray-700">{r.category}</td>
                  <td className="px-3 py-2 text-right text-gray-900">{currency(r.amount)}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${r.status==='approved'?'bg-green-100 text-green-700':r.status==='pending'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{t(r.status)}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-700 truncate max-w-xs">{r.note}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="px-3 py-6 text-center text-gray-500">{t('noRequestsFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReimbursePage;


