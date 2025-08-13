// src/pages/VisitorsAdd.jsx
import React, { useState } from 'react';

export default function VisitorsAdd() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    purpose: '',
    host: '',
    checkIn: '',
    status: 'In',
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    alert('Submit disabled in VM-8.2 (UI only).');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Add Visitor</h1>

      <form onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={onChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={onChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          name="host"
          placeholder="Host"
          value={form.host}
          onChange={onChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="datetime-local"
          name="checkIn"
          value={form.checkIn}
          onChange={onChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              name="status"
              value="In"
              checked={form.status === 'In'}
              onChange={onChange}
              className="mr-2"
            />
            In
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Out"
              checked={form.status === 'Out'}
              onChange={onChange}
              className="mr-2"
            />
            Out
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Create Visitor
        </button>
      </form>
    </div>
  );
}
