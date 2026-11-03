
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  GraduationCap,
  UserRound,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

type AcademicOption = {
  id: string;
  name: string;
};

type ProfileData = {
  display_name: string;
  username: string | null;
  bio: string | null;
  institution_id: string | null;
  faculty_id: string | null;
  department_id: string | null;
  academic_level_id: string | null;
};

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const [institutions, setInstitutions] = useState<AcademicOption[]>([]);
  const [faculties, setFaculties] = useState<AcademicOption[]>([]);
  const [departments, setDepartments] = useState<AcademicOption[]>([]);
  const [levels, setLevels] = useState<AcademicOption[]>([]);

  const [institutionId, setInstitutionId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [levelId, setLevelId] = useState('');

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      if (!supabase) {
        setError('MXVERSE is not connected to its backend.');
        setLoading(false);
        return;
      }

      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        const user = authData.user;

        if (!user) {
          navigate('/auth', { replace: true });
          return;
        }

        const [
          profileResult,
          institutionResult,
        ] = await Promise.all([
          supabase
            .from('profiles')
            .select(
              'display_name, username, bio, institution_id, faculty_id, department_id, academic_level_id'
            )
            .eq('id', user.id)
            .single(),
          supabase
            .from('institutions')
            .select('id, name')
            .eq('is_active', true)
            .order('name'),
        ]);

        if (profileResult.error) throw profileResult.error;
        if (institutionResult.error) throw institutionResult.error;

        if (!active) return;

        const profile = profileResult.data as ProfileData;

        setUserId(user.id);
        setDisplayName(profile.display_name || '');
        setUsername(profile.username || '');
        setBio(profile.bio || '');
        setInstitutions(institutionResult.data || []);

        if (profile.institution_id) {
          setInstitutionId(profile.institution_id);

          const [facultyResult, levelResult] = await Promise.all([
            supabase
              .from('faculties')
              .select('id, name')
              .eq('institution_id', profile.institution_id)
              .eq('is_active', true)
              .order('name'),
            supabase
              .from('academic_levels')
              .select('id, name')
              .eq('institution_id', profile.institution_id)
              .eq('is_active', true)
              .order('sort_order'),
          ]);

          if (facultyResult.error) throw facultyResult.error;
          if (levelResult.error) throw levelResult.error;

          if (!active) return;

          setFaculties(facultyResult.data || []);
          setLevels(levelResult.data || []);
        }

        if (profile.faculty_id) {
          setFacultyId(profile.faculty_id);

          const { data, error: departmentError } = await supabase
            .from('departments')
            .select('id, name')
            .eq('faculty_id', profile.faculty_id)
            .eq('is_active', true)
            .order('name');

          if (departmentError) throw departmentError;

          if (!active) return;
          setDepartments(data || []);
        }

        setDepartmentId(profile.department_id || '');
        setLevelId(profile.academic_level_id || '');
      } catch (err) {
        const message = err as { message?: string };
        if (active) {
          setError(message.message || 'Could not load your profile.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleInstitutionChange(value: string) {
    setInstitutionId(value);
    setFacultyId('');
    setDepartmentId('');
    setLevelId('');
    setFaculties([]);
    setDepartments([]);
    setLevels([]);
    setError('');

    if (!supabase || !value) return;

    const [facultyResult, levelResult] = await Promise.all([
      supabase
        .from('faculties')
        .select('id, name')
        .eq('institution_id', value)
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('academic_levels')
        .select('id, name')
        .eq('institution_id', value)
        .eq('is_active', true)
        .order('sort_order'),
    ]);

    if (facultyResult.error || levelResult.error) {
      setError(
        facultyResult.error?.message ||
        levelResult.error?.message ||
        'Could not load academic options.'
      );
      return;
    }

    setFaculties(facultyResult.data || []);
    setLevels(levelResult.data || []);
  }

  async function handleFacultyChange(value: string) {
    setFacultyId(value);
    setDepartmentId('');
    setDepartments([]);
    setError('');

    if (!supabase || !value) return;

    const { data, error: departmentError } = await supabase
      .from('departments')
      .select('id, name')
      .eq('faculty_id', value)
      .eq('is_active', true)
      .order('name');

    if (departmentError) {
      setError(departmentError.message);
      return;
    }

    setDepartments(data || []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!supabase) {
      setError('Backend connection is unavailable.');
      return;
    }

    if (!userId) {
      setError('Your session could not be verified. Please sign in again.');
      return;
    }

    if (!/^[a-z0-9_]{3,24}$/.test(username.trim().toLowerCase())) {
      setError('Username must be 3–24 characters using letters, numbers or underscores.');
      return;
    }

    if (!institutionId || !facultyId || !departmentId || !levelId) {
      setError('Please complete all four academic selections.');
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          username: username.trim().toLowerCase(),
          bio: bio.trim() || null,
          institution_id: institutionId,
          faculty_id: facultyId,
          department_id: departmentId,
          academic_level_id: levelId,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      navigate('/app', { replace: true });
    } catch (err) {
      const message = err as { message?: string };
      setError(message.message || 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="auth-page" style={{ display: 'grid', placeItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Preparing your campus profile...
        </p>
      </main>
    );
  }

  if (error && !userId) {
    return (
      <main className="auth-page" style={{ display: 'grid', placeItems: 'center' }}>
        <section className="auth-card" style={{ width: 'min(100%, 440px)' }}>
          <h2>We couldn't load your account</h2>
          <p className="auth-alert auth-error">{error}</p>
          <button className="auth-submit" onClick={() => navigate('/auth')}>
            Return to sign in
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <header className="auth-header">
        <div className="auth-brand">
          <span className="auth-brand-mark">MX</span>
          <span>
            <strong>MXVERSE</strong>
            <small>FUTMINNA</small>
          </span>
        </div>

        <span className="auth-eyebrow">PROFILE SETUP</span>
      </header>

      <section className="onboarding-content">
        <div className="onboarding-progress">
          <span className="onboarding-progress-active" />
          <span />
          <span />
        </div>

        <div className="auth-intro">
          <div className="auth-eyebrow">
            <Sparkles size={15} />
            YOUR CAMPUS IDENTITY
          </div>

          <h1>
            Make it <span>yours.</span>
          </h1>

          <p>
            Set up your profile so people across your campus can discover and connect with you.
          </p>
        </div>

        <form className="auth-card onboarding-card" onSubmit={handleSubmit}>
          <div className="auth-card-heading">
            <div>
              <h2>Personal details</h2>
              <p>These details help shape your MXVERSE identity.</p>
            </div>
            <div className="auth-card-icon">
              <UserRound size={21} />
            </div>
          </div>

          {error && <div className="auth-alert auth-error">{error}</div>}

          <div className="auth-form">
            <label className="auth-field">
              <span>Display name</span>
              <div className="auth-input-wrap">
                <UserRound size={18} />
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="How should people know you?"
                  maxLength={60}
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Username</span>
              <div className="auth-input-wrap">
                <span>@</span>
                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value.toLowerCase().replace(/\s/g, ''))
                  }
                  placeholder="your_username"
                  maxLength={24}
                  required
                />
              </div>
              <small>Your unique MXVERSE identity.</small>
            </label>

            <label className="auth-field">
              <span>Short bio <span className="mx-muted">(optional)</span></span>
              <textarea
                className="onboarding-textarea"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="A little about you..."
                maxLength={280}
                rows={3}
              />
              <small>{bio.length}/280 characters</small>
            </label>
          </div>

          <div className="onboarding-section-heading">
            <div className="auth-card-icon">
              <GraduationCap size={21} />
            </div>
            <div>
              <h2>Academic identity</h2>
              <p>Let's place you in the FUTMINNA community.</p>
            </div>
          </div>

          <div className="auth-form">
            <label className="auth-field">
              <span>Institution</span>
              <select
                className="onboarding-select"
                value={institutionId}
                onChange={(event) => handleInstitutionChange(event.target.value)}
                required
              >
                <option value="">Select institution</option>
                {institutions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label className="auth-field">
              <span>School / Faculty</span>
              <select
                className="onboarding-select"
                value={facultyId}
                onChange={(event) => handleFacultyChange(event.target.value)}
                disabled={!institutionId}
                required
              >
                <option value="">Select school</option>
                {faculties.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label className="auth-field">
              <span>Department</span>
              <select
                className="onboarding-select"
                value={departmentId}
                onChange={(event) => setDepartmentId(event.target.value)}
                disabled={!facultyId}
                required
              >
                <option value="">Select department</option>
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label className="auth-field">
              <span>Current level</span>
              <select
                className="onboarding-select"
                value={levelId}
                onChange={(event) => setLevelId(event.target.value)}
                disabled={!institutionId}
                required
              >
                <option value="">Select level</option>
                {levels.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
          </div>

          <button className="auth-submit" type="submit" disabled={saving}>
            {saving ? 'Saving your profile...' : 'Complete profile'}
            {!saving && <ArrowRight size={18} />}
          </button>

          <p className="onboarding-privacy">
            <CheckCircle2 size={14} />
            You can update your profile details later.
          </p>
        </form>

        <p className="auth-footer">
          YOUR CAMPUS. YOUR PEOPLE. YOUR UNIVERSE.
        </p>
      </section>
    </main>
  );
}
