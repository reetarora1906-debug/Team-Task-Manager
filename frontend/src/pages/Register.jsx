import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Workspace created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center selection:bg-primary selection:text-white font-inter" 
         style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida/ADBb0uifNlx98Wd_t6wPWJsQQ8VES1uFwSEAS02Pbgv5J0qBOxXYae_XwVHy2FUbmHo4t0XBudvEnrc9iNaMeIY9cPrhsUytoSk11b8OS2f6aFGn52SXAXR1y4ysRrMfjXB9kDLjdN5yV0aODESmrX9FUvkaYmwAXG1cLToW5V00WMQDLQtLFrA9Pgrk0TkBuGbdU2F4WlSKilRtZDGxkfHE7AJM7BrseMhgczC_yBc8GLk5tHP_55k6vXgu5Fj2')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Toaster position="top-right" />
      
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col p-16 justify-center">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-container to-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white block leading-tight">Syncro</span>
              <span className="text-[0.65rem] font-semibold tracking-widest text-slate-300 uppercase">Team Task Manager</span>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-md">
            Build your team's <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed-dim to-primary-fixed">dream workflow.</span>
          </h2>

          <div className="space-y-6 mt-8">
            {[
              { title: 'Unified Dashboards', desc: 'Real-time metrics for every project member.' },
              { title: 'Role-Based Control', desc: 'Secure permissions for Admins and Members.' },
              { title: 'Smart Kanban', desc: 'Visualize progress with drag-and-drop simplicity.' }
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-[10px] text-emerald-400">✓</div>
                <div>
                  <p className="text-white font-bold text-sm">{feature.title}</p>
                  <p className="text-slate-300 text-xs mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-lg glass-panel p-10 rounded-2xl animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Workspace</h2>
          </div>

          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/15 hover:bg-white/10 backdrop-blur-md rounded-lg text-sm font-medium text-slate-200  mb-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center py-4 mb-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Or join with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-slate-200 mb-1.5 text-left">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:animate-icon-bounce group-focus-within:text-primary" style={{ fontSize: '18px' }}>person</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary  backdrop-blur-md bg-white/10 border-white/20"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-200 mb-1.5 text-left">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:animate-icon-bounce group-focus-within:text-primary" style={{ fontSize: '18px' }}>mail</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary  backdrop-blur-md bg-white/10 border-white/20"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-slate-200 mb-1.5 text-left">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:animate-icon-bounce group-focus-within:text-primary" style={{ fontSize: '18px' }}>lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-2.5 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary  backdrop-blur-md bg-white/10 border-white/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-200 text-left">Select Your Role</label>
              <div className="grid grid-cols-2 gap-4">
                {['Admin', 'Member'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2  duration-200 cursor-pointer h-24
                      ${
                        role === r
                          ? 'border-primary bg-primary/30 text-white shadow-lg ring-1 ring-primary/50'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    <span className="text-3xl mb-1">{r === 'Admin' ? '🛡️' : '👤'}</span>
                    <span className="font-bold text-sm">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary  cursor-pointer active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-slate-300">
            Already have an account? 
            <Link to="/login" className="font-bold text-primary-fixed-dim hover:text-white transition-colors ml-1">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
