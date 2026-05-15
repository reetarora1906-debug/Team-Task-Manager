import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI, userAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineFolder, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', category: '', deadline: '' });

  useEffect(() => { fetchProjects(); fetchUsers(); }, []);

  const fetchProjects = async () => {
    try { const r = await projectAPI.getAll(); setProjects(r.data.data); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try { const r = await userAPI.getAll(); setUsers(r.data.data); } catch(e) {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create(form);
      toast.success('Project created!');
      setShowModal(false);
      setForm({ name: '', description: '', category: '', deadline: '' });
      fetchProjects();
    } catch(e) { toast.error(e.response?.data?.message || 'Failed to create project'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await projectAPI.delete(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch(e) { toast.error('Failed to delete project'); }
  };

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <Toaster position="top-right"/>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-headline-lg">Projects</h1>
          <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1">Manage your team's projects</p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-default)] bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)]  shadow-[var(--shadow-md)] cursor-pointer">
            <HiOutlinePlus className="w-4 h-4"/> New Project
          </button>
        )}
      </div>

      <div className="mb-6 flex items-center gap-2 px-3 py-2.5 bg-white rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/30 w-full max-w-md focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-light)] ">
        <HiOutlineSearch className="w-4 h-4 text-[var(--color-outline)]"/>
        <input type="text" placeholder="Search projects..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full"/>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineFolder className="w-12 h-12 text-[var(--color-outline-variant)] mx-auto mb-3"/>
          <p className="text-[var(--color-on-surface-variant)]">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {filtered.map(p => (
            <div key={p._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/15 p-5 hover:shadow-[var(--shadow-md)]  group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-primary-light)] flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                  <HiOutlineFolder className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-colors"/>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status==='Active'?'bg-[var(--color-success-bg)] text-[var(--color-success)]':p.status==='On Hold'?'bg-[var(--color-warning-bg)] text-[var(--color-warning)]':'bg-[var(--color-info-bg)] text-[var(--color-info)]'}`}>{p.status}</span>
              </div>
              <Link to={`/projects/${p._id}`}>
                <h3 className="text-[15px] font-semibold text-[var(--color-on-surface)] mb-1 hover:text-[var(--color-primary)] transition-colors">{p.name}</h3>
              </Link>
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-4 line-clamp-2">{p.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {p.members?.slice(0,3).map((m,i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] border-2 border-white flex items-center justify-center text-[10px] font-semibold text-[var(--color-primary-dark)]">
                        {m.user?.name?.charAt(0)||'?'}
                      </div>
                    ))}
                    {p.members?.length > 3 && <span className="text-xs text-[var(--color-outline)] ml-1">+{p.members.length-3}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{p.taskCount||0} tasks</span>
                  {user?.role === 'Admin' && (
                    <button onClick={()=>handleDelete(p._id)} className="text-xs text-[var(--color-danger)] hover:underline cursor-pointer">Delete</button>
                  )}
                </div>
              </div>
              {/* Progress */}
              <div className="mt-3 w-full h-1.5 rounded-full bg-[var(--color-surface-container-high)]">
                <div className="h-full rounded-full bg-[var(--color-primary)] " style={{width:`${p.progress||0}%`}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-[var(--radius-xl)] w-full max-w-md p-6 animate-scale-in shadow-[var(--shadow-xl)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-headline-sm">Create Project</h2>
              <button onClick={()=>setShowModal(false)} className="p-1 rounded-[var(--radius-default)] hover:bg-[var(--color-surface-container)] cursor-pointer"><HiOutlineX className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">PROJECT NAME</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="e.g. Website Redesign" className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"/>
              </div>
              <div>
                <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">DESCRIPTION</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} placeholder="Brief project description..." className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none resize-none"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">CATEGORY</label>
                  <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Engineering" className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"/>
                </div>
                <div>
                  <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">DEADLINE</label>
                  <input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"/>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-[var(--radius-default)] bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)]  cursor-pointer">Create Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
