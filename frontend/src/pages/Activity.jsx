import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import { HiOutlineClock } from 'react-icons/hi';

const statusColors = {
  'To Do': 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  'In Progress': 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  'In Review': 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
  Completed: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
};

const Activity = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const r = await taskAPI.getAll(); setTasks(r.data.data); }
      catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'Just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  };

  if (loading) return <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-headline-lg">Activity Feed</h1>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1">Recent updates from your team and projects.</p>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/15 divide-y divide-[var(--color-outline-variant)]/15">
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineClock className="w-12 h-12 text-[var(--color-outline-variant)] mx-auto mb-3"/>
            <p className="text-[var(--color-on-surface-variant)]">No activity yet</p>
          </div>
        ) : tasks.map(t => (
          <div key={t._id} className="flex items-start gap-4 p-5 hover:bg-[var(--color-surface-container-low)] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-sm font-bold text-[var(--color-primary-dark)] shrink-0">
              {t.creator?.name?.charAt(0) || t.assignee?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--color-on-surface)]">
                <span className="font-semibold">{t.creator?.name || 'Someone'}</span>
                {' created task '}
                <span className="font-medium text-[var(--color-primary)]">{t.title}</span>
                {t.project?.name && <span className="text-[var(--color-on-surface-variant)]"> in {t.project.name}</span>}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status]}`}>{t.status}</span>
                <span className="text-xs text-[var(--color-outline)]">{timeAgo(t.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
