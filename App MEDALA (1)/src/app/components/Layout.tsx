import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { LayoutGrid, FileText, FileEdit, Calendar, Shield, Settings as SettingsIcon, Activity } from 'lucide-react';
import { useEffect } from 'react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const userId = localStorage.getItem('medala_user_id');
    if (!userId) {
      navigate('/onboarding');
    }
  }, [navigate]);

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutGrid },
    { path: '/log-entry', label: 'Log Entry', icon: FileEdit },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <aside className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold">MEDALA</div>
              <div className="text-sm text-gray-600">Clinical Intelligence</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Security Notice */}
        <div className="p-4 m-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600">
              <span className="font-semibold">Secure:</span> All data encrypted and compliant with healthcare standards.
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Bar - Shown only on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  active ? 'text-emerald-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold">MEDALA</div>
                <div className="text-xs text-gray-600">Clinical Intelligence</div>
              </div>
            </div>
            <Link to="/settings">
              <SettingsIcon className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}