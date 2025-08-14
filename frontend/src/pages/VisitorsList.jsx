// VM-11.3 + Search (persistent via ?q=)
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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

  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // --- Search state (read from URL, keep in sync) ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (q) next.set('q', q);
    else next.delete('q');
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [q, searchParams, setSearchParams]);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/visitors');
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message || 'Could not load visitors. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { (async () => { await load(); })(); }, []);

  // Flash banner — keep existing query string when clearing state
  const flash = location.state?.flash;
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => {
      navigate(`${location.pathname}${location.search}`, { replace: true, state: {} });
    }, 2500);
    return () => clearTimeout(t);
  }, [flash, location.pathname, location.search, navigate]);

  // Filtered view
  const table = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((v) => {
      const name = (v.name ?? '').toLowerCase();
      const phone = (v.phone ?? '').toLowerCase();
      const purpose = (v.purpose ?? '').toLowerCase();
      const host = (v.host ?? '').toLowerCase();
      const status = (v.status ?? '').toLowerCase();
      return (
        name.includes(needle) ||
        phone.includes(needle) ||
        purpose.includes(needle) ||
        host.includes(needle) ||
        status.includes(needle)
      );
    });
  }, [rows, q]);

  const askDelete = (id) => setConfirmId(id);

  const doDelete = async () => {
    if (!confirmId) return;
    try {
      setDeletingId(confirmId);
      await api.delete(`/visitors/${confirmId}`);
      setToast({ type: 'success', msg: 'Visitor deleted successfully.' });
      setConfirmId(null);
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message || 'Delete failed. Please retry or contact support.';
      setToast({ type: 'error', msg });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Visitors</h1>

        {/* Search + Add */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, phone, purpose…"
              aria-label="Search visitors"
              className="w-64 md:w-80 p-2 pr-8 border rounded"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
                title="Clear"
              >
                ×
              </button>
            )}
          </div>

          <Link to="/visitors/new" className="text-blue-600 underline whitespace-nowrap">
            Add Visitor
          </Link>
        </div>
      </div>

      {flash && (
        <div className="mb-4 bg-green-50 border border-green-300 text-green-800 px-3 py-2 rounded">
          {flash}
        </div>
      )}

      {toast && (
        <div className={`mb-4 px-3 py-2 rounded border ${
          toast.type === 'success'
            ? 'bg-green-50 border-green-300 text-green-800'
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {toast.msg}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading visitors…</div>
      ) : table.length === 0 ? (
        <div className="text-gray-600">
          {q ? 'No matching visitors.' : 'No visitors yet. Use “Add Visitor” to create one.'}
        </div>
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
                const isDel = deletingId === id;
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
                          v.status === 'In' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
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
                          disabled={isDel}
                          className={`text-red-600 hover:underline ${isDel ? 'opacity-50' : ''}`}
                          aria-label="Delete visitor"
                          title="Delete"
                        >
                          {isDel ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="p-3 text-xs text-gray-600 border-t">
            Showing {table.length} of {rows.length}
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete visitor?</h2>
            <p className="mb-4 text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
