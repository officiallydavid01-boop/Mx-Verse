
import { useEffect, useState } from 'react';
import {
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  Home,
  Compass,
  Users,
  MessageCircle,
  Bell,
  CalendarDays,
  UserRound,
  Settings,
  Search,
  Sun,
  Moon,
  LogOut,
  Plus,
  Sparkles,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';

const navigation = [
  { label: 'Home', path: '/app', icon: Home, end: true },
  { label: 'Explore', path: '/app/explore', icon: Compass },
  { label: 'Communities', path: '/app/communities', icon: Users },
  { label: 'Messages', path: '/app/messages', icon: MessageCircle },
  { label: 'Notifications', path: '/app/notifications', icon: Bell },
  { label: 'Events', path: '/app/events', icon: CalendarDays },
];

const mobileNavigation = [
  { label: 'Home', path: '/app', icon: Home, end: true },
  { label: 'Explore', path: '/app/explore', icon: Compass },
  { label: 'Create', path: '/app/create', icon: Plus },
  { label: 'Messages', path: '/app/messages', icon: MessageCircle },
  { label: 'Profile', path: '/app/profile', icon: UserRound },
];

export default function AppShell() {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthenticated(false);
      setChecking(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setAuthenticated(Boolean(data.session));
        setChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setAuthenticated(Boolean(session));
        setChecking(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  async function handleSignOut() {
    if (!supabase || signingOut) return;

    setSigningOut(true);

    const { error } = await supabase.auth.signOut();

    setSigningOut(false);

    if (error) {
      window.alert(`Unable to sign out: ${error.message}`);
      return;
    }

    navigate('/auth', { replace: true });
  }

  if (checking) {
    return (
      <main className="mx-shell-loading">
        <img
  src="/icon/mxverse-icon.svg"
  alt="MXVERSE"
  className="mx-loading-mark"
/>
        <p>Entering your universe...</p>
      </main>
    );
  }

  if (!authenticated) {
  return <Navigate to="/auth" replace />;
}

  return (
    <div className="mx-app-shell">
        <aside
  className={`mx-sidebar ${sidebarCollapsed ? 'is-collapsed' : ''} ${
    mobileMenuOpen ? 'mobile-open' : ''
  }`}
>
        <NavLink to="/app" className="mx-sidebar-brand">
          <img
  src="/icon/mxverse-icon.svg"
  alt="MXVERSE"
  className="mx-brand-mark"
/>
          {!sidebarCollapsed && (
            <span className="mx-brand-copy">
              <strong>MXVERSE</strong>
              <small>FUTMINNA</small>
            </span>
          )}
        </NavLink>

        <div className="mx-sidebar-label">
          {!sidebarCollapsed && 'YOUR CAMPUS'}
        </div>

        <nav className="mx-sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive }) =>
                `mx-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} />
              {!sidebarCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mx-sidebar-bottom">
          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              `mx-nav-link ${isActive ? 'active' : ''}`
            }
            title={sidebarCollapsed ? 'Profile' : undefined}
          >
            <UserRound size={19} />
            {!sidebarCollapsed && <span>My profile</span>}
          </NavLink>

          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `mx-nav-link ${isActive ? 'active' : ''}`
            }
            title={sidebarCollapsed ? 'Settings' : undefined}
          >
            <Settings size={19} />
            {!sidebarCollapsed && <span>Settings</span>}
          </NavLink>

          <button
            type="button"
            className="mx-nav-link mx-sidebar-action"
            onClick={toggleTheme}
            title={sidebarCollapsed ? 'Change theme' : undefined}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            {!sidebarCollapsed && (
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            )}
          </button>

          <button
            type="button"
            className="mx-nav-link mx-sidebar-action mx-signout"
            onClick={handleSignOut}
            disabled={signingOut}
            title={sidebarCollapsed ? 'Sign out' : undefined}
          >
            <LogOut size={19} />
            {!sidebarCollapsed && (
              <span>{signingOut ? 'Signing out...' : 'Sign out'}</span>
            )}
          </button>

          <button
            type="button"
            className="mx-sidebar-collapse"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
            {!sidebarCollapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="mx-mobile-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="mx-shell-main">
        <header className="mx-topbar">
          <button
            type="button"
            className="mx-icon-button mx-mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <div className="mx-topbar-title">
            <span className="mx-topbar-greeting">THE FUTMINNA SOCIAL UNIVERSE</span>
            <strong>Welcome to MXVERSE</strong>
          </div>

          <div className="mx-topbar-actions">
            <button
              type="button"
              className="mx-icon-button"
              onClick={() => navigate('/app/explore')}
              aria-label="Explore MXVERSE"
              title="Explore"
            >
              <Search size={19} />
            </button>

            <button
              type="button"
              className="mx-icon-button"
              onClick={() => navigate('/app/notifications')}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={19} />
            </button>

            <button
              type="button"
              className="mx-topbar-profile"
              onClick={() => navigate('/app/profile')}
              aria-label="Open your profile"
            >
              <UserRound size={18} />
            </button>
          </div>
        </header>

        <div className="mx-shell-content">
          <main className="mx-main-column">
            <Outlet />
          </main>

          <aside className="mx-discovery-column">
            <section className="mx-discovery-card mx-campus-card">
              <div className="mx-discovery-icon">
                <Sparkles size={20} />
              </div>
              <span className="mx-discovery-eyebrow">YOUR CAMPUS</span>
              <h3>Your campus. Your people. Your universe.</h3>
              <p>
                A new space for FUTMINNA students to connect, discover and
                share campus life.
              </p>
            </section>

            <section className="mx-discovery-card">
              <h3>Explore your universe</h3>
              <p>Find communities, conversations and people around campus.</p>
              <button
                type="button"
                className="mx-discovery-link"
                onClick={() => navigate('/app/explore')}
              >
                Start exploring <span>→</span>
              </button>
            </section>

            <p className="mx-sidebar-footer">
              MXVERSE · BUILT FOR FUTMINNA
            </p>
          </aside>
        </div>
      </div>

      <nav className="mx-mobile-nav" aria-label="Mobile navigation">
        {mobileNavigation.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `mx-mobile-nav-item ${isActive ? 'active' : ''} ${
                label === 'Create' ? 'mx-create-nav-item' : ''
              }`
            }
          >
            <span className="mx-mobile-nav-icon">
              <Icon size={20} />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
