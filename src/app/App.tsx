
import { useEffect, useState } from 'react';
import {
  Moon,
  Sun,
  ArrowUpRight,
  Sparkles,
  ArrowLeft,
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
import { supabase } from '../lib/supabase';

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
          height: 76,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 6%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--brand-accent)',
              fontWeight: 900,
              fontSize: 17,
            }}
          >
            MX
          </div>

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
      </section>
    </main>
  );
}

function DestinationPage({ destination }: { destination: 'onboarding' | 'app' }) {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!supabase) {
        if (active) {
          setHasSession(false);
          setChecking(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (active) {
        setHasSession(Boolean(data.session));
        setChecking(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <main className="auth-page" style={{ display: 'grid', placeItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Checking your session...</p>
      </main>
    );
  }

  if (!hasSession) {
    return <Navigate to="/auth" replace />;
  }

  const isOnboarding = destination === 'onboarding';

  return (
    <main
      className="auth-page"
      style={{ display: 'grid', placeItems: 'center' }}
    >
      <section className="auth-card" style={{ width: 'min(100%, 460px)' }}>
        <div className="auth-card-icon" style={{ marginBottom: 20 }}>
          <Sparkles size={21} />
        </div>

        <h1 style={{ fontSize: 27, margin: '0 0 10px' }}>
          {isOnboarding ? 'Account created successfully.' : 'You are signed in.'}
        </h1>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {isOnboarding
            ? 'Your MXVERSE account is ready. We are building the academic profile setup next.'
            : 'Your session is active. The MXVERSE home experience is the next build step.'}
        </p>

        <p className="auth-alert auth-success" style={{ marginTop: 20 }}>
          Authentication is connected. This is a temporary checkpoint, not the finished onboarding or home feed.
        </p>

        <Link
          to="/"
          className="auth-back"
          style={{ marginTop: 12 }}
        >
          <ArrowLeft size={16} />
          Back to MXVERSE home
        </Link>
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
      <Route
        path="/app"
        element={<DestinationPage destination="app" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
