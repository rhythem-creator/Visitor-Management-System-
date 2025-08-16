import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const empty = { name: '', email: '', university: '', address: '' };

export default function Profile() {
  const { user } = useAuth(); // just for showing who’s logged in if needed
  const [form, setForm] = useState(empty);

  const [loading, setLoading] = useState(true);     // initial fetch
  const [saving, setSaving] = useState(false);      // PUT in progress
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  // load profile on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      setError('');
      try {
        const { data } = await api.get('/auth/profile'); // baseURL handles /api
        if (!alive) return;
        setForm({
          name: data?.name ?? '',
          email: data?.email ?? '',
          university: data?.university ?? '',
          address: data?.address ?? '',
        });
      } catch (e) {
        if (!alive) return;
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          'Failed to fetch profile.';
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // small delay purely to make the loading state visible in demos
      await new Promise(r => setTimeout(r, 600));

      await api.put('/auth/profile', form);
      setSuccess('Profile updated successfully.');
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to update profile.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-300 text-green-800 px-3 py-2 rounded">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white p-6 shadow rounded space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            placeholder="Email address"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">University</label>
          <input
            name="university"
            value={form.university}
            onChange={onChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            placeholder="University"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={onChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            placeholder="Address"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full p-2 rounded text-white ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {saving ? 'Saving…' : 'Update Profile'}
        </button>
      </form>

      {/* Optional: small footer to show current user */}
      {user?.email && (
        <p className="text-xs text-gray-500 mt-3">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>
      )}
    </div>
  );
}
