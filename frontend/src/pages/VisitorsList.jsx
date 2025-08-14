// frontend/src/pages/VisitorsList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function VisitorsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // read initial query from URL so it persists across page changes/refresh
  const initialQ = searchParams.get('q') ?? '';
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/visitors');
        if (!mounted) return;
        setRows(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // keep URL in sync with the search box (so going to Edit and back keeps the query)
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (q) next.set('q', q);
    else next.delete('q');
    // only replace if something actually changed
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [q, searchParams, setSearchParams]);

  // flash banner after successful update
  const flash = location.state?.flash;
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => {
      navigate(location.pathname + (q ? `?q=${encodeURIComponent(q)}` : ''), { replace: true, state: {} });
    }, 2500);
    return () => clearTimeout(t);
  }, [flash, location.pathname, navigate, q]);

  const filtered = useMemo(() => {
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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Visitors</h1>
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Visitors</h1>
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, phone, purpose…"
              aria-label="Search visitors"
              className="w-64 md:w-80 p-2 pr-8 border rounded"
            />
            {/* clear button */}
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

      {filtered.length === 0 ? (
        <div className="text-gray-600">
          {q ? 'No matching visitors.' : 'No visitors yet.'}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Purpose</th>
                <th className="text-left p-3">Host</th>
                <th className="text-left p-3">Check-in</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v._id || v.id} className="border-t">
                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.phone}</td>
                  <td className="p-3">{v.purpose}</td>
                  <td className="p-3">{v.host}</td>
                  <td className="p-3">{v.checkIn ? new Date(v.checkIn).toLocaleString() : '—'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        v.status === 'Out' ? 'bg-gray-200 text-gray-800' : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {v.status === 'Out' ? 'Out' : 'In'}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      className="text-blue-600 underline"
                      to={`/visitors/${v._id || v.id}/edit`}
                      state={{ visitor: v }}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* small count helper */}
          <div className="p-3 text-xs text-gray-600 border-t">
            Showing {filtered.length} of {rows.length}
          </div>
        </div>
      )}
    </div>
  );
}
