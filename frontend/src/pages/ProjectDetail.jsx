import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI, taskAPI, userAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineX, HiOutlineTrash, HiOutlineUserAdd, HiOutlineArrowLeft } from 'react-icons/hi';

const statusCols = ['To Do', 'In Progress', 'Completed'];
const statusColors = {
  'To Do': 'border-t-[var(--color-info)]',
  'In Progress': 'border-t-[var(--color-warning)]',
  'In Review': 'border-t-[var(--color-primary)]',
  Completed: 'border-t-[var(--color-success)]',
};
const priorityBadge = {
  Low: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  Medium: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  High: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  Urgent: 'bg-red-100 text-red-700',
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignee: '', priority: 'Medium', dueDate: '', status: 'To Do' });
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      const [pRes, uRes] = await Promise.all([projectAPI.getById(id), userAPI.getAll()]);
      setProject(pRes.data.data);
      setTasks(pRes.data.data.tasks || []);
      setUsers(uRes.data.data);
    } catch(e) { toast.error('Failed to load project'); }
    finally { setLoading(false); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create({ ...taskForm, project: id });
      toast.success('Task created!');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', assignee: '', priority: 'Medium', dueDate: '', status: 'To Do' });
      fetchAll();
    } catch(e) { toast.error(e.response?.data?.message || 'Failed to create task'); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.updateStatus(taskId, status);
      fetchAll();
    } catch(e) { toast.error('Failed to update status'); }
  };

  const handleAssigneeChange = async (taskId, assigneeId) => {
    try {
      await taskAPI.updateAssignee(taskId, assigneeId);
      toast.success('Assignee updated');
      fetchAll();
    } catch(e) { toast.error('Failed to update assignee'); }
  };

  const handleDeleteTask = async (taskId) => {
    try { await taskAPI.delete(taskId); toast.success('Task deleted'); fetchAll(); }
    catch(e) { toast.error('Failed to delete task'); }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      await projectAPI.addMember(id, { userId: selectedUser });
      toast.success('Member added!');
      setShowMemberModal(false);
      setSelectedUser('');
      fetchAll();
    } catch(e) { toast.error(e.response?.data?.message || 'Failed to add member'); }
  };

  const handleRemoveMember = async (userId) => {
    try { await projectAPI.removeMember(id, userId); toast.success('Member removed'); fetchAll(); }
    catch(e) { toast.error('Failed to remove member'); }
  };

  if (loading) return <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></div>;
  if (!project) return <p className="text-center py-20">Project not found</p>;

  return (
    <div>
      <Toaster position="top-right"/>
      <button onClick={() => navigate('/projects')} className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-4 cursor-pointer">
        <HiOutlineArrowLeft className="w-4 h-4"/> Back to Projects
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-headline-lg">{project.name}</h1>
          <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1 max-w-xl">{project.description}</p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'Admin' && (
            <>
              <button onClick={() => setShowMemberModal(true)} className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] text-sm font-medium hover:bg-[var(--color-surface-container)] cursor-pointer">
                <HiOutlineUserAdd className="w-4 h-4"/> Add Member
              </button>
              <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-default)] bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] shadow-[var(--shadow-md)] cursor-pointer">
                <HiOutlinePlus className="w-4 h-4"/> New Task
              </button>
            </>
          )}
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/15 p-5 mb-6">
        <h3 className="text-label-md text-[var(--color-on-surface-variant)] mb-3">TEAM MEMBERS</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-light)]/50 border border-[var(--color-primary)]/20">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-[10px] font-bold">{project.owner?.name?.charAt(0)}</div>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">{project.owner?.name} (Owner)</span>
          </div>
          {project.members?.map(m => (
            <div key={m.user?._id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/20 group">
              <div className="w-6 h-6 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center text-[10px] font-bold text-[var(--color-secondary)]">{m.user?.name?.charAt(0)}</div>
              <span className="text-xs font-medium text-[var(--color-on-surface)]">{m.user?.name}</span>
              {user?.role === 'Admin' && (
                <button onClick={() => handleRemoveMember(m.user?._id)} className="opacity-0 group-hover:opacity-100 text-[var(--color-danger)] cursor-pointer"><HiOutlineX className="w-3 h-3"/></button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusCols.map(status => {
          const colTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status} className={`bg-[var(--color-surface-container-low)] rounded-[var(--radius-lg)] p-4 border-t-4 ${statusColors[status]}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">{status}</h3>
                <span className="w-6 h-6 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center text-xs font-bold text-[var(--color-on-surface-variant)]">{colTasks.length}</span>
              </div>
              <div className="space-y-3">
                {colTasks.map(task => (
                  <div key={task._id} className="bg-white rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/15 p-3.5 hover:shadow-[var(--shadow-sm)] ">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-[var(--color-on-surface)] flex-1">{task.title}</h4>
                      {user?.role === 'Admin' && (
                        <button onClick={() => handleDeleteTask(task._id)} className="text-[var(--color-outline)] hover:text-[var(--color-danger)] cursor-pointer"><HiOutlineTrash className="w-3.5 h-3.5"/></button>
                      )}
                    </div>
                    {task.description && <p className="text-xs text-[var(--color-on-surface-variant)] mb-2 line-clamp-2">{task.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityBadge[task.priority]}`}>{task.priority}</span>
                      {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[10px] font-bold text-[var(--color-primary-dark)]" title={task.assignee.name}>{task.assignee.name?.charAt(0)}</div>
                      )}
                    </div>
                    {task.dueDate && <p className="text-[10px] text-[var(--color-outline)] mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                    
                    <div className="mt-3 space-y-2">
                      <div>
                        <label className="text-[9px] font-bold text-[var(--color-outline)] uppercase tracking-wider block mb-1">Status</label>
                        <select 
                          value={task.status} 
                          onChange={e => handleStatusChange(task._id, e.target.value)} 
                          disabled={task.status === 'Completed'}
                          className={`w-full text-xs px-2 py-1 rounded border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] outline-none cursor-pointer ${task.status === 'Completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {statusCols.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      {user?.role === 'Admin' ? (
                        <div>
                          <label className="text-[9px] font-bold text-[var(--color-outline)] uppercase tracking-wider block mb-1">Assignee</label>
                          <select 
                            value={task.assignee?._id || ''} 
                            onChange={e => handleAssigneeChange(task._id, e.target.value)} 
                            disabled={task.status === 'Completed'}
                            className={`w-full text-xs px-2 py-1 rounded border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] outline-none cursor-pointer ${task.status === 'Completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="">Unassigned</option>
                            {[project.owner, ...project.members.map(m => m.user)].filter(Boolean).map(u => (
                              <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="pt-2 flex items-center gap-2">
                          <label className="text-[9px] font-bold text-[var(--color-outline)] uppercase tracking-wider">Assignee:</label>
                          <span className="text-xs text-[var(--color-on-surface)]">{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-[var(--radius-xl)] w-full max-w-md p-6 shadow-[var(--shadow-xl)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-headline-sm">New Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="p-1 rounded-[var(--radius-default)] hover:bg-[var(--color-surface-container)] cursor-pointer"><HiOutlineX className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">TITLE</label>
                <input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required placeholder="Task title" className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"/>
              </div>
              <div>
                <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">DESCRIPTION</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} rows={2} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none resize-none"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">ASSIGNEE</label>
                  <select value={taskForm.assignee} onChange={e => setTaskForm({...taskForm, assignee: e.target.value})} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm outline-none cursor-pointer">
                    <option value="">Unassigned</option>
                    {[project.owner, ...project.members.map(m => m.user)].filter(Boolean).map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">PRIORITY</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm outline-none cursor-pointer">
                    {['Low','Medium','High','Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">STATUS</label>
                  <select value={taskForm.status} onChange={e => setTaskForm({...taskForm, status: e.target.value})} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm outline-none cursor-pointer">
                    {statusCols.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md text-[var(--color-on-surface-variant)] mb-1.5">DUE DATE</label>
                  <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm outline-none"/>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-[var(--radius-default)] bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)] cursor-pointer">Create Task</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-[var(--radius-xl)] w-full max-w-md p-6 shadow-[var(--shadow-xl)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-headline-sm">Add Member</h2>
              <button onClick={() => setShowMemberModal(false)} className="p-1 cursor-pointer"><HiOutlineX className="w-5 h-5"/></button>
            </div>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="w-full px-3 py-2.5 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/60 text-sm outline-none mb-4 cursor-pointer">
              <option value="">Select user...</option>
              {users.filter(u => !project.members?.some(m => m.user?._id === u._id) && u._id !== project.owner?._id).map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
            </select>
            <button onClick={handleAddMember} className="w-full py-2.5 rounded-[var(--radius-default)] bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)] cursor-pointer">Add to Project</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
