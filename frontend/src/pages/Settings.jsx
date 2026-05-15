import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await userAPI.updateProfile({ name, email });
      setUser(r.data.data);
      localStorage.setItem('user', JSON.stringify(r.data.data));
      toast.success('Profile updated!');
    } catch(e) { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <Toaster position="top-right"/>
      <div className="mb-8">
        <h1 className="text-headline-lg">Settings</h1>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/15 p-6">
        <h2 className="text-headline-sm mb-5">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-2xl font-bold text-[var(--color-primary-dark)]">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-[var(--color-on-surface)]">{user?.name}</p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"/>
          </div>
          <div>
            <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"/>
          </div>
          <div>
            <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">ROLE</label>
            <input value={user?.role || ''} disabled className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] cursor-not-allowed"/>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-[var(--radius-default)] bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)] disabled:opacity-60  cursor-pointer">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
