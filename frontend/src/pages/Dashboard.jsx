import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI, projectAPI } from '../services/api';
import { HiOutlineFolder, HiOutlineClipboardCheck, HiOutlineTrendingUp, HiOutlineExclamation, HiOutlineClock } from 'react-icons/hi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const statusColors = {
  'To Do': 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  'In Progress': 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  'In Review': 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
  Completed: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [s, p] = await Promise.all([taskAPI.getStats(), projectAPI.getAll()]);
      setStats(s.data.data);
      setProjects(p.data.data.slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <svg className="animate-spin w-8 h-8 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects||0, icon: HiOutlineFolder, bg: 'var(--color-primary-light)', fg: 'var(--color-primary)' },
    { label: 'Total Tasks', value: stats?.totalTasks||0, icon: HiOutlineClipboardCheck, bg: 'var(--color-info-bg)', fg: 'var(--color-info)' },
    { label: 'In Progress', value: stats?.inProgressTasks||0, icon: HiOutlineTrendingUp, bg: 'var(--color-warning-bg)', fg: 'var(--color-warning)' },
    { label: 'Overdue', value: stats?.overdueTasks||0, icon: HiOutlineExclamation, bg: 'var(--color-danger-bg)', fg: 'var(--color-danger)' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Dashboard Overview</h1>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1">
          {user?.role === 'Admin' ? "Here's what's happening with your projects today." : `Welcome back, ${user?.name}. Here's your overview.`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 stagger-children">
        {cards.map(c => (
          <div key={c.label} className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-outline)]/20 p-5 hover:shadow-[var(--shadow-md)]  duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-md text-[var(--color-on-surface-variant)]">{c.label}</span>
              <div className="w-9 h-9 rounded-[var(--radius-default)] flex items-center justify-center" style={{backgroundColor:c.bg}}>
                <c.icon className="w-4.5 h-4.5" style={{color:c.fg}}/>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--color-on-surface)]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-outline)]/20 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-headline-sm">Active Projects</h2>
            <Link to="/projects" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">View all →</Link>
          </div>
          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-center py-8 text-sm text-[var(--color-on-surface-variant)]">No projects yet</p>
            ) : projects.map(p => (
              <Link key={p._id} to={`/projects/${p._id}`} className="flex items-center justify-between p-4 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/15 hover:shadow-[var(--shadow-sm)]  group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-primary-light)] flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                    <HiOutlineFolder className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-colors"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-on-surface)]">{p.name}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{p.category||'General'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-[var(--color-surface-container-high)]">
                      <div className="h-full rounded-full bg-[var(--color-primary)]" style={{width:`${p.progress||0}%`}}/>
                    </div>
                    <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">{p.progress||0}%</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status==='Active'?'bg-[var(--color-success-bg)] text-[var(--color-success)]':p.status==='On Hold'?'bg-[var(--color-warning-bg)] text-[var(--color-warning)]':'bg-[var(--color-info-bg)] text-[var(--color-info)]'}`}>{p.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-outline)]/20 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-headline-sm">Recent Activity</h2>
            <Link to="/activity" className="text-sm font-medium text-[var(--color-primary)]">View all →</Link>
          </div>
          <div className="space-y-4">
            {!stats?.recentTasks?.length ? (
              <p className="text-center py-8 text-sm text-[var(--color-on-surface-variant)]">No recent activity</p>
            ) : stats.recentTasks.slice(0,6).map(t => (
              <div key={t._id} className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">{t.assignee?.name?.charAt(0)||t.creator?.name?.charAt(0)||'?'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm"><span className="font-semibold">{t.assignee?.name||t.creator?.name}</span> updated <span className="font-medium">{t.title}</span></p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status]}`}>{t.status}</span>
                    <span className="text-xs text-[var(--color-outline)]">{new Date(t.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-outline)]/20 p-6">
        <h2 className="text-headline-sm mb-5">Task Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:'To Do', count:stats?.todoTasks||0, color:'var(--color-info)' },
            { label:'In Progress', count:stats?.inProgressTasks||0, color:'var(--color-warning)' },
            { label:'Completed', count:stats?.completedTasks||0, color:'var(--color-success)' },
          ].map(i => (
            <div key={i.label} className="text-center p-4 rounded-[var(--radius-default)] bg-[var(--color-surface-container-low)]">
              <p className="text-2xl font-bold" style={{color:i.color}}>{i.count}</p>
              <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mt-1">{i.label}</p>
              {stats?.totalTasks > 0 && (
                <div className="mt-2 w-full h-1 rounded-full bg-[var(--color-surface-container-high)]">
                  <div className="h-full rounded-full" style={{width:`${(i.count/stats.totalTasks)*100}%`, backgroundColor:i.color}}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-outline)]/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline-sm">Performance Tracking</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div>
            <span className="text-xs text-[var(--color-on-surface-variant)]">Tasks Completed (Last 7 Days)</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.performanceData || []}>
              <defs>
                <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: 'var(--color-on-surface-variant)'}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: 'var(--color-on-surface-variant)'}}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: 'var(--shadow-lg)',
                  fontSize: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPerf)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
