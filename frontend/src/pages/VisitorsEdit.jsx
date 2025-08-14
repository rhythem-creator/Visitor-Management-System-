// frontend/src/pages/VisitorsEdit.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const initial = { name: '', phone: '', purpose: '', host: '', checkIn: '', status: 'In' };

export default function VisitorsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromList = location.state?.visitor || null;

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(!fromList);
  const [submitting, setSubmitting] = useState(false);

  // Prefill from list (no fetch), else fetch
  useEffect(() => {
    if (fromList) {
      setForm({
        name: fromList.name ?? '',
        phone: fromList.phone ?? '',
        purpose: fromList.purpose ?? '',
        host: fromList.host ?? '',
        checkIn: fromList.checkIn ? new Date(fromList.checkIn).toISOString().slice(0, 16) : '',
        status: fromList.status === 'Out' ? 'Out' : 'In',
      });
      setApiError('');       // ensure no banner
      setLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        const { data } = await api.get(`/visitors/${id}`);
        if (!alive) return;
        setForm({
          name: data?.name ?? '',
          phone: data?.phone ?? '',
          purpose: data?.purpose ?? '',
          host: data?.host ?? '',
          checkIn: data?.checkIn ? new Date(data.checkIn).toISOString().slice(0, 16) : '',
          status: data?.status === 'Out' ? 'Out' : 'In',
        });
        setApiError('');
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to fetch visitor.';
        setApiError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [fromList, id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 15);
      setForm(f => ({ ...f, phone: digits }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (!/^[^\p{L}_.-]*\p{L}[\p{L} .'-]{1,}$/u.test(form.name.trim())) e.name = 'Please enter a valid name';

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
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        purpose: form.purpose.trim(),
        host: form.host.trim(),
        checkIn: form.checkIn ? new Date(form.checkIn).toISOString() : null,
        status: form.status,
      };
      await api.put(`/visitors/${id}`, payload);

      navigate('/visitors', {
        replace: true,
        state: { flash: 'Visitor updated successfully.' },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update visitor.';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Visitor</h1>
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Visitor</h1>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded">
          {apiError}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white p-6 shadow rounded">
        <label className="block mb-3">
          <span className="block mb-1">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-400' : ''}`}
            placeholder="Full name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </label>

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
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </label>

        <label className="block mb-3">
          <span className="block mb-1">Purpose</span>
          <input
            name="purpose"
            value={form.purpose}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.purpose ? 'border-red-400' : ''}`}
            aria-invalid={Boolean(errors.purpose)}
          />
          {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>}
        </label>

        <label className="block mb-3">
          <span className="block mb-1">Host</span>
          <input
            name="host"
            value={form.host}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.host ? 'border-red-400' : ''}`}
            aria-invalid={Boolean(errors.host)}
          />
          {errors.host && <p className="text-red-600 text-sm mt-1">{errors.host}</p>}
        </label>

        <label className="block mb-4">
          <span className="block mb-1">Check‑in (optional)</span>
          <input
            type="datetime-local"
            name="checkIn"
            value={form.checkIn}
            onChange={onChange}
            className={`w-full p-2 border rounded ${errors.checkIn ? 'border-red-400' : ''}`}
            aria-invalid={Boolean(errors.checkIn)}
          />
          {errors.checkIn && <p className="text-red-600 text-sm mt-1">{errors.checkIn}</p>}
        </label>

        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="In" checked={form.status === 'In'} onChange={onChange}/>
            In
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="Out" checked={form.status === 'Out'} onChange={onChange}/>
            Out
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to="/visitors" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
