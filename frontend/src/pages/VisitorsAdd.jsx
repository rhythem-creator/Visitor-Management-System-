// 8.2 UI ONLY: src/pages/VisitorsAdd.jsx
import { useState } from 'react';

const initial = { name: '', phone: '', purpose: '', host: '', checkIn: '', status: 'In' };

export default function VisitorsAdd() {
  const [form, setForm] = useState(initial);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    alert('Submit clicked (API disabled in 8.2)');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Visitor</h1>

      <form onSubmit={onSubmit} className="bg-white p-6 shadow rounded">
        <input name="name" placeholder="Name" value={form.name} onChange={onChange}
               className="w-full mb-3 p-2 border rounded" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange}
               className="w-full mb-3 p-2 border rounded" />
        <input name="purpose" placeholder="Purpose" value={form.purpose} onChange={onChange}
               className="w-full mb-3 p-2 border rounded" />
        <input name="host" placeholder="Host" value={form.host} onChange={onChange}
               className="w-full mb-3 p-2 border rounded" />
        <input type="datetime-local" name="checkIn" value={form.checkIn} onChange={onChange}
               className="w-full mb-4 p-2 border rounded" />

        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="In"
                   checked={form.status==='In'} onChange={onChange} /> In
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="Out"
                   checked={form.status==='Out'} onChange={onChange} /> Out
          </label>
        </div>

        <button className="w-full bg-blue-600 text-white p-2 rounded">Create Visitor</button>
      </form>
    </div>
  );
}