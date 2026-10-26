import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Users, Shield, ArrowLeft } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/admin/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center space-x-3 border-b border-zinc-800/80 pb-6">
        <Link to="/admin" className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">Registered Users</h1>
          <p className="text-sm text-zinc-400 font-normal">View user database accounts and role permissions</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching user directory..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchUsers} />
      ) : (
        <div className="bg-[#14141d] border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-semibold tracking-wider border-b border-zinc-800/80">
                <tr>
                  <th className="py-4.5 px-6">Name</th>
                  <th className="py-4.5 px-6">Email</th>
                  <th className="py-4.5 px-6">Role</th>
                  <th className="py-4.5 px-6">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-normal">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-zinc-900 border border-red-500/40 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-heading">{u.name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-400">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
