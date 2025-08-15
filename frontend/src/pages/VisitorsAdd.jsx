// src/pages/VisitorsAdd.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const initial = { name: '', phone: '', purpose: '', host: '', checkIn: '', status: 'In' };

export default function VisitorsAdd() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 15);
      setForm((f) => ({ ...f, phone: digits }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (!/^[^\p{L}\s'.-]*[\p{L}\s'.-]{2,}$/u.test(form.name.trim()))
      e.name = 'Please enter a valid name';

    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10,15}$/.test(form.phone)) e.phone = 'Phone must be 10–15 digits';

    if (!form.purpose.trim()) e.purpose = 'Purpose is required';
    if (!form.host.trim()) e.host = 'Host is required';

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
    setSuccess('');
    if (!validate()) return;

    try {
      setSubmitting(true);

      const res = await api.post('/visitors', form);
      // treat any non-2xx as failure
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`Unexpected status ${res.status}`);
      }

      setSuccess('Visitor created successfully.');
      // tiny delay so the banner is visible, then redirect
      setTimeout(() => navigate('/visitors', { replace: true }), 900);

      // optional: reset fields (doesn’t interfere with redirect)
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

  const inputBase =
    'w-full p-2 border rounded focus:outline-none focus:ring disabled:opacity-60';
  const errText = 'text-red-600 text-sm mt-1';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Visitor</h1>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded">
          {apiError}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-300 text-green-800 px-3 py-2 rounded">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white p-6 shadow rounded">
        <label className="block mb-3">
          <span className="block mb-1">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Full name"
            className={`${inputBase} ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && <p className={errText}>{errors.name}</p>}
        </label>

        <label className="block mb-3">
          <span className="block mb-1">Phone</span>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            inputMode="numeric"
            pattern="\d*"
            placeholder="e.g. 0412345678"
            className={`${inputBase} ${errors.phone ? 'border-red-400' : ''}`}
          />
          {errors.phone && <p className={errText}>{errors.phone}</p>}
        </label>

        <label className="block mb-3">
          <span className="block mb-1">Purpose</span>
          <input
            name="purpose"
            value={form.purpose}
            onChange={onChange}
            className={`${inputBase} ${errors.purpose ? 'border-red-400' : ''}`}
          />
          {errors.purpose && <p className={errText}>{errors.purpose}</p>}
        </label>

        <label className="block mb-3">
          <span className="block mb-1">Host</span>
          <input
            name="host"
            value={form.host}
            onChange={onChange}
            className={`${inputBase} ${errors.host ? 'border-red-400' : ''}`}
          />
          {errors.host && <p className={errText}>{errors.host}</p>}
        </label>

        <label className="block mb-4">
          <span className="block mb-1">Check-in (optional)</span>
          <input
            type="datetime-local"
            name="checkIn"
            value={form.checkIn}
            onChange={onChange}
            className={`${inputBase} ${errors.checkIn ? 'border-red-400' : ''}`}
          />
          {errors.checkIn && <p className={errText}>{errors.checkIn}</p>}
        </label>

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
          className={`w-full p-2 rounded text-white ${
            submitting ? 'bg-blue-400' : 'bg-blue-600'
          }`}
        >
          {submitting ? 'Creating…' : 'Create Visitor'}
        </button>
      </form>
    </div>
  );
}
