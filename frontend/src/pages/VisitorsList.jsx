// src/pages/VisitorsList.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function VisitorsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/visitors');
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        if (alive) setRows(list);
      } catch (err) {
        if (alive) {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Failed to load visitors.';
          setError(msg);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="p-6 text-gray-700">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Visitors</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {!error && rows.length === 0 ? (
        <div className="text-gray-600">No visitors found.</div>
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Host</th>
                <th className="px-4 py-3">Check‑in</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.map((v, i) => (
                <tr key={v.id ?? i} className="border-t">
                  <td className="px-4 py-3">{v?.name ?? '—'}</td>
                  <td className="px-4 py-3">{v?.phone ?? '—'}</td>
                  <td className="px-4 py-3">{v?.purpose ?? '—'}</td>
                  <td className="px-4 py-3">{v?.host ?? '—'}</td>
                  <td className="px-4 py-3">{v?.checkIn ?? '—'}</td>
                  <td className="px-4 py-3">{v?.status ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}