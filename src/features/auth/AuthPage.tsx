
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  AtSign,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

type AuthMode = 'signup' | 'login' | 'forgot';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage('');
    setError('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!supabase) {
      setError('MXVERSE is not connected to its backend yet. Please try again later.');
      return;
    }

    if (mode === 'signup') {
      const cleanUsername = username.trim().toLowerCase();

      if (!/^[a-z0-9_]{3,24}$/.test(cleanUsername)) {
        setError('Username must be 3–24 characters using letters, numbers or underscores.');
        return;
      }

      if (password.length < 8) {
        setError('Your password must contain at least 8 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              display_name: displayName.trim(),
              username: username.trim().toLowerCase(),
            },
          },
        });

        if (signupError) throw signupError;

        if (!data.session) {
          throw new Error(
            'No active session was returned. Please check that Confirm email is OFF in your Supabase Email provider settings.'
          );
        }

        window.location.assign('/onboarding');
        return;
      }

      if (mode === 'login') {
  const { data, error: loginError } =
  await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  
  if (loginError) throw loginError;
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed_at')
    .eq('id', data.user.id)
    .single();
  
  if (profileError) throw profileError;
  
  if (!profile.onboarding_completed_at) {
    window.location.assign('/onboarding');
  } else {
    window.location.assign('/app');
  }
  
  return;
}

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) throw resetError;

      setMessage('If an account exists for this email, a password reset link will be sent.');
    } catch (err) {
      const authError = err as { message?: string };
      setError(authError.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === 'signup';
  const isLogin = mode === 'login';
  const isForgot = mode === 'forgot';

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <header className="auth-header">
        <Link to="/" className="auth-brand">
  <img
    src="/icon/mxverse-icon.svg"
    alt="MXVERSE logo"
    className="auth-brand-mark"
  />
  <span>
    <strong>MXVERSE</strong>
    <small>FUTMINNA</small>
  </span>
</Link>

        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          <span>Back home</span>
        </Link>
      </header>

      <section className="auth-content">
        <div className="auth-intro">
          <div className="auth-eyebrow">
            <Sparkles size={15} />
            THE FUTMINNA SOCIAL UNIVERSE
          </div>

          <h1>
            {isSignup ? (
              <>Your people are <span>here.</span></>
            ) : isLogin ? (
              <>Welcome <span>back.</span></>
            ) : (
              <>Let's get you <span>back in.</span></>
            )}
          </h1>

          <p>
            {isSignup
              ? 'Create your space. Discover your campus. Connect with your people.'
              : isLogin
              ? 'Your campus conversations are waiting for you.'
              : 'Enter your account email and we will send you a password reset link.'}
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <div>
              <h2>
                {isSignup ? 'Create your account' : isLogin ? 'Sign in' : 'Reset password'}
              </h2>
              <p>
                {isSignup
                  ? 'Start your MXVERSE journey.'
                  : isLogin
                  ? 'Continue where you left off.'
                  : 'We will help you regain access.'}
              </p>
            </div>
            <div className="auth-card-icon">
              {isSignup ? <User size={21} /> : isLogin ? <LockKeyhole size={21} /> : <Mail size={21} />}
            </div>
          </div>

          {error && <div className="auth-alert auth-error">{error}</div>}
          {message && <div className="auth-alert auth-success">{message}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignup && (
              <>
                <label className="auth-field">
                  <span>Full name</span>
                  <div className="auth-input-wrap">
                    <User size={18} />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      maxLength={60}
                      autoComplete="name"
                      required
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Username</span>
                  <div className="auth-input-wrap">
                    <AtSign size={18} />
                    <input
                      type="text"
                      placeholder="your_username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      maxLength={24}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <small>3–24 characters. Letters, numbers and underscores.</small>
                </label>
              </>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            {!isForgot && (
              <label className="auth-field">
                <span>Password</span>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
            )}

            {isLogin && (
              <button
                type="button"
                className="auth-forgot"
                onClick={() => changeMode('forgot')}
              >
                Forgot password?
              </button>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : isSignup
                ? 'Create account'
                : isLogin
                ? 'Sign in to MXVERSE'
                : 'Send reset link'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button onClick={() => changeMode('login')}>Sign in</button>
              </>
            ) : isLogin ? (
              <>
                New to MXVERSE?{' '}
                <button onClick={() => changeMode('signup')}>Create account</button>
              </>
            ) : (
              <button onClick={() => changeMode('login')}>
                <ArrowLeft size={14} /> Back to sign in
              </button>
            )}
          </div>
        </div>

        <p className="auth-footer">
          Built for the FUTMINNA community.
        </p>
      </section>
    </main>
  );
}
