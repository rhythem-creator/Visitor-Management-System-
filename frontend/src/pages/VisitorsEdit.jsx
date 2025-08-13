// src/pages/VisitorsEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig'; // same import path you use in other pages

export default function VisitorsEdit() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    purpose: '',
    host: '',
    checkIn: '',
    status: 'In',
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setApiError('');

    api
      .get(`/visitors/${id}`)
      .then(({ data }) => {
        if (!alive) return;
        const v = data || {};
        // keep shape we’ll reuse for the edit form in 12.3
        setForm({
          name: v.name || '',
          phone: v.phone || '',
          purpose: v.purpose || '',
          host: v.host || '',
          // if your API stores ISO string, keep it as-is for now;
          // we’ll adapt to input[type="datetime-local"] in 12.3
          checkIn: v.checkIn || '',
          status: v.status || 'In',
        });
      })
      .catch((err) => {
        if (!alive) return;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to load visitor.';
        setApiError(msg);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Visitor</h1>
        <p className="text-gray-600">Loading visitor…</p>
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

      {/* Preview for now; form fields come in 12.3 */}
      <div className="bg-white shadow rounded p-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" value={form.name} />
          <Field label="Phone" value={form.phone} />
          <Field label="Purpose" value={form.purpose} />
          <Field label="Host" value={form.host} />
          <Field
            label="Check-in"
            value={form.checkIn ? new Date(form.checkIn).toLocaleString() : '—'}
          />
          <Field label="Status" value={form.status} />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Form UI + validation and PUT submit come next (12.3/12.4).
        </p>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium">{value || '—'}</div>
    </div>
  );
}