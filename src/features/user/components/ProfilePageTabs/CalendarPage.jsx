import React, { useMemo, useState } from 'react';

const sampleEvents = [
  { id: 1, title: 'Pickup: Toyota Camry', date: '2025-10-07', time: '09:00' },
  { id: 2, title: 'Drop-off: Honda Civic', date: '2025-10-12', time: '17:30' },
  { id: 3, title: 'Pickup: BMW X5', date: '2025-10-18', time: '10:00' },
  { id: 4, title: 'Payment due', date: '2025-10-20', time: '12:00' }
];

function getMonthMatrix(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // week starts Mon
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      days.push(date);
    }
    weeks.push(days);
  }
  return weeks;
}

const CalendarPage = () => {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events] = useState(sampleEvents);
  const [search, setSearch] = useState('');

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const monthMatrix = useMemo(() => getMonthMatrix(year, monthIndex), [year, monthIndex]);
  const monthLabel = cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const eventsByDate = useMemo(() => {
    const map = new Map();
    events.forEach(e => {
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return;
      const key = e.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    return map;
  }, [events, search]);

  const changeMonth = (delta) => {
    setCursor(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const dayCell = (date) => {
    const inMonth = date.getMonth() === monthIndex;
    const key = date.toISOString().slice(0,10);
    const dayEvents = eventsByDate.get(key) || [];
    return (
      <div key={key} className={`min-h-[96px] p-2 border ${inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} border-gray-100`}> 
        <div className="text-xs font-medium">{date.getDate()}</div>
        <div className="mt-1 space-y-1">
          {dayEvents.slice(0,3).map(ev => (
            <div key={ev.id} className="text-[11px] px-2 py-1 rounded bg-blue-50 text-blue-700 truncate">{ev.time} • {ev.title}</div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-[11px] text-gray-500">+{dayEvents.length - 3} more</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={()=>changeMonth(-1)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Prev</button>
          <div className="px-3 py-2 text-gray-900 font-medium">{monthLabel}</div>
          <button onClick={()=>changeMonth(1)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Next</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-gray-50 text-xs text-gray-500 rounded-t-2xl overflow-hidden border border-b-0 border-gray-100">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} className="px-3 py-2 border-r last:border-r-0 border-gray-100">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 rounded-b-2xl overflow-hidden border border-gray-100">
        {monthMatrix.flat().map(dayCell)}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Upcoming</h3>
        <div className="divide-y">
          {events
            .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
            .sort((a,b) => a.date.localeCompare(b.date))
            .map(e => (
            <div key={e.id} className="py-2 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{e.title}</div>
                <div className="text-xs text-gray-500">{new Date(e.date + 'T' + e.time).toLocaleString()}</div>
              </div>
              <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;


