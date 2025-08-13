// src/pages/VisitorsAdd.jsx
import { useState } from 'react';
import api from '../api/axiosConfig';

const initial = {
  name: '',
  phone: '',
  purpose: '',
  host: '',
  checkIn: '',
  status: 'In',
};

export default function VisitorsAdd() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // keep digits-only phone, max 15
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 15);
      setForm((f) => ({ ...f, phone: digits }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  // basic client validation
  const validate = () => {
    const e = {};

    // name: at least 2 letters, allow spaces and .'- characters
    if (!form.name.trim()) e.name = 'Name is required';
    else if (!/^[A-Za-z][A-Za-z .'\-]{1,}$/.test(form.name.trim()))
      e.name = 'Please enter a valid name';

    // phone: 10–15 digits
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10,15}$/.test(form.phone))
      e.phone = 'Phone must be 10–15 digits';

    // purpose + host: required
    if (!form.purpose.trim()) e.purpose = 'Purpose is required';
    if (!form.host.trim()) e.host = 'Host is required';

    // checkIn: optional, but if provided it must be a valid datetime
    if (form.checkIn) {
      const dt = new Date(form.checkIn);
      if (Number.isNaN(dt.getTime())) e.checkIn = 'Invalid date/time';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    try {
      setSubmitting(true);
      await api.post('/visitors', form);
      alert('Visitor created!');
      setForm(initial);
      setErrors({});
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to create visitor.';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Visitor</h1>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded">
          {apiError}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white p-6 shadow rounded">
        {/* Name */}
        <label className="block mb-3">
          <span className="block mb-1">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-400' : ''}`}
            placeholder="Full name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </label>

        {/* Phone */}
        <label className="block mb-3">
          <span className="block mb-1">Phone</span>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            inputMode="numeric"
            pattern="\d*"
            className={`w-full p-2 border rounded ${errors.phone ? 'border-red-400' : ''}`}
            placeholder="e.g. 0412345678"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </label>

        {/* Purpose */}
        <label className="block mb-3">
          <span className="block mb-1">Purpose</span>
          <input
            name="purpose"
            value={form.purpose}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.purpose ? 'border-red-400' : ''}`}
            placeholder="Purpose of visit"
          />
          {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>}
        </label>

        {/* Host */}
        <label className="block mb-3">
          <span className="block mb-1">Host</span>
          <input
            name="host"
            value={form.host}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.host ? 'border-red-400' : ''}`}
            placeholder="Person to meet"
          />
          {errors.host && <p className="text-red-600 text-sm mt-1">{errors.host}</p>}
        </label>

        {/* Check-in (optional) */}
        <label className="block mb-4">
          <span className="block mb-1">Check-in (optional)</span>
          <input
            type="datetime-local"
            name="checkIn"
            value={form.checkIn}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.checkIn ? 'border-red-400' : ''}`}
          />
          {errors.checkIn && <p className="text-red-600 text-sm mt-1">{errors.checkIn}</p>}
        </label>

        {/* Status */}
        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="In"
              checked={form.status === 'In'}
              onChange={onChange}
            />
            In
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="Out"
              checked={form.status === 'Out'}
              onChange={onChange}
            />
            Out
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full p-2 rounded text-white ${submitting ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          {submitting ? 'Creating…' : 'Create Visitor'}
        </button>
      </form>
    </div>
  );
}
