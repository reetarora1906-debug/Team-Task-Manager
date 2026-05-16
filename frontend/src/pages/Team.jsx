import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineSearch } from 'react-icons/hi';

const Team = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { const r = await userAPI.getAll(); setUsers(r.data.data); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      toast.success('Role updated');
      fetchUsers();
    } catch(e) { toast.error('Failed to update role'); }
  };

  const handleToggleTeam = async (userId, isOnTeam) => {
    try {
      await userAPI.toggleTeam(userId, isOnTeam);
      toast.success(isOnTeam ? 'Added to team' : 'Removed from team');
      fetchUsers();
    } catch(e) { toast.error('Failed to update team'); }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  
  // Sections
  const teamMembers = filtered.filter(u => u.isOnTeam || u._id === user._id);
  const availableUsers = filtered.filter(u => !u.isOnTeam && u._id !== user._id);

  if (loading) return <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></div>;

  const UserCard = ({ u }) => (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-outline)]/15 p-5 hover:shadow-[var(--shadow-md)] ">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-dark)] font-bold text-lg">
          {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full rounded-full object-cover"/> : u.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{u.name}</p>
          <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{u.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'Admin' && u._id !== user._id && (
            u.isOnTeam ? (
              <button 
                onClick={() => handleToggleTeam(u._id, false)}
                className="text-[10px] px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold uppercase tracking-wider"
              >
                Remove
              </button>
            ) : (
              <button 
                onClick={() => handleToggleTeam(u._id, true)}
                className="text-[10px] px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition-colors font-bold uppercase tracking-wider"
              >
                Add to Team
              </button>
            )
          )}

          {user?.role === 'Admin' && u._id !== user._id && (
            <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} className="text-xs px-2 py-1 rounded-full border border-[var(--color-outline)]/30 bg-[var(--color-surface)] text-[var(--color-on-surface)] outline-none cursor-pointer font-medium">
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
          )}
          
          {u._id === user._id || user?.role !== 'Admin' && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'Admin' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]'}`}>{u.role}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <Toaster position="top-right"/>
      <div className="mb-8">
        <h1 className="text-headline-lg">Team</h1>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1">Manage your team members and roles</p>
      </div>

      <div className="mb-6 flex items-center gap-2 px-3 py-2.5 bg-[var(--color-surface)] rounded-[var(--radius-default)] border border-[var(--color-outline)]/30 w-full max-w-md focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-light)] ">
        <HiOutlineSearch className="w-4 h-4 text-[var(--color-outline)]"/>
        <input type="text" placeholder="Search team members..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full"/>
      </div>

      {teamMembers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-label-md text-[var(--color-on-surface-variant)] font-bold tracking-widest mb-4">TEAM MEMBERS ({teamMembers.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {teamMembers.map(u => <UserCard key={u._id} u={u}/>)}
          </div>
        </div>
      )}

      {user?.role === 'Admin' && availableUsers.length > 0 && (
        <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/30">
          <h2 className="text-label-md text-[var(--color-on-surface-variant)] font-bold tracking-widest mb-4">AVAILABLE USERS ({availableUsers.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {availableUsers.map(u => <UserCard key={u._id} u={u}/>)}
          </div>
        </div>
      )}

      {teamMembers.length === 0 && (user?.role !== 'Admin' || availableUsers.length === 0) && (
        <div className="text-center py-20 bg-[var(--color-surface-container-low)] rounded-[var(--radius-lg)]">
          <p className="text-[var(--color-on-surface-variant)]">No users found.</p>
        </div>
      )}
    </div>
  );
};

export default Team;
