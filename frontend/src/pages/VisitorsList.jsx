// src/pages/VisitorsList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleString();
};

export default function VisitorsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/visitors');
        if (!mounted) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message || 'Failed to load visitors';
        setApiError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const table = useMemo(() => rows, [rows]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Visitors</h1>
        <div className="flex gap-3">
          <Link to="/visitors/new" className="text-blue-600 underline">Add Visitor</Link>
        </div>
      </div>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {apiError}
        </div>
      )}
      {loading && <p className="text-gray-600">Loading…</p>}
      {!loading && table.length === 0 && <p className="text-gray-600">No visitors yet.</p>}

      {!loading && table.length > 0 && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Phone</th>
                <th className="text-left px-4 py-2">Purpose</th>
                <th className="text-left px-4 py-2">Host</th>
                <th className="text-left px-4 py-2">Check-in</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {table.map((v) => {
                const id = v.id ?? v._id ?? v.uuid;
                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-2">
                      <Link
                        to={`/visitors/${id}/edit`}
                        state={{ visitor: v }}
                        className="text-blue-600 hover:underline"
                      >
                        {v.name || '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{v.phone || '—'}</td>
                    <td className="px-4 py-2">{v.purpose || '—'}</td>
                    <td className="px-4 py-2">{v.host || '—'}</td>
                    <td className="px-4 py-2">{fmt(v.checkIn)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${v.status === 'In' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                        {v.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/visitors/${id}/edit`}
                        state={{ visitor: v }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
