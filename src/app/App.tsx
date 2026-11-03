
import {
  Moon,
  Sun,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

import {
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { useThemeStore } from '../stores/themeStore';
import AuthPage from '../features/auth/AuthPage';
import OnboardingPage from '../features/onboarding/OnboardingPage';
import AppShell from '../features/app-shell/AppShell';
import PwaInstallPrompt from '../components/pwa/PwaInstallPrompt';

import {
  HomeFeedPage,
  ExplorePage,
  CommunitiesPage,
  MessagesPage,
  NotificationsPage,
  EventsPage,
  ProfilePage,
  SettingsPage,
  CreatePostPage,
} from '../features/app-shell/pages/AppPages';

function HomePage() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <header
        style={{
          minHeight: 76,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 6%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/icon/mxverse-icon.svg"
            alt="MXVERSE"
            style={{
              width: 46,
              height: 46,
              objectFit: 'contain',
            }}
          />

          <div>
            <strong style={{ letterSpacing: 2 }}>MXVERSE</strong>
            <div
              style={{
                fontSize: 9,
                letterSpacing: 1.5,
                color: 'var(--text-muted)',
              }}
            >
              FUTMINNA
            </div>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </header>

      <section
        className="mx-container"
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 70,
          paddingBottom: 70,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--brand-accent)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 28,
          }}
        >
          <Sparkles size={16} />
          THE FUTMINNA SOCIAL UNIVERSE
        </div>

        <h1
          style={{
            fontSize: 'clamp(48px, 10vw, 100px)',
            lineHeight: 1.02,
            letterSpacing: '-0.065em',
            maxWidth: 900,
            margin: 0,
          }}
        >
          Your campus.
          <br />
          Your people.
          <br />
          <span className="mx-gradient-text">Your universe.</span>
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.8,
            maxWidth: 520,
            marginTop: 28,
          }}
        >
          Discover conversations, meet people, explore communities
          and stay connected to everything happening around FUTMINNA.
        </p>

        <div style={{ marginTop: 36 }}>
          <Link
            to="/auth"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '15px 22px',
              borderRadius: 14,
              background: 'var(--brand-accent)',
              color: '#080D18',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            Explore MXVERSE
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div
          style={{
            marginTop: 70,
            paddingTop: 22,
            borderTop: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          BUILT FOR THE FUTMINNA COMMUNITY
        </div>

        <div style={{ marginTop: 28 }}>
          <PwaInstallPrompt />
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/auth" element={<AuthPage />} />

      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route path="/app" element={<AppShell />}>
        <Route index element={<HomeFeedPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="create" element={<CreatePostPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
