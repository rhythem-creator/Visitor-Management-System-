// VM-11.1 version (fixed)
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const [error, setError] = useState('');

  // NEW (VM-11.1): UI state for confirm modal only
  const [confirmId, setConfirmId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // fetch list
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/visitors');
        if (!alive) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message || 'Failed to load visitors';
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // flash banner support
  const flash = location.state?.flash;
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => {
      navigate(location.pathname, { replace: true, state: {} });
    }, 2500);
    return () => clearTimeout(t);
  }, [flash, location.pathname, navigate]);

  const table = useMemo(() => rows, [rows]);

  // VM-11.1: open/close confirm
  const askDelete = (id) => setConfirmId(id);
  const closeConfirm = () => setConfirmId(null);
  // VM-11.1: placeholder confirm action (no API yet)
  const confirmDeleteNow = () => {
    // no API yet; just close dialog
    setConfirmId(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Visitors</h1>
        <Link to="/visitors/new" className="text-blue-600 underline">Add Visitor</Link>
      </div>

      {flash && (
        <div className="mb-4 bg-green-50 border border-green-300 text-green-800 px-3 py-2 rounded">
          {flash}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : table.length === 0 ? (
        <div className="text-gray-600">No visitors yet.</div>
      ) : (
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
                const id = v._id ?? v.id ?? v.uuid;
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
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          v.status === 'In'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {v.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/visitors/${id}/edit`}
                          state={{ visitor: v }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => askDelete(id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VM-11.1: confirm modal only */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete visitor?</h2>
            <p className="mb-4 text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeConfirm} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmDeleteNow} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
