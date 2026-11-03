import mxverseIcon from '../../assets/mxverse-icon.svg';
import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    if (localStorage.getItem('mxverse-install-dismissed') === 'true') {
      setDismissed(true);
    }

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstall
    );

    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall
      );

      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) {
      setShowInstructions(true);
      return;
    }

    await installEvent.prompt();

    const choice = await installEvent.userChoice;

    if (choice.outcome === 'accepted') {
      setInstallEvent(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('mxverse-install-dismissed', 'true');
    setDismissed(true);
  };

  if (installed || dismissed) {
    return null;
  }

  return (
    <section className="pwa-install-card">
      <div className="pwa-install-icon">
        <img
  src={mxverseIcon}
  alt="MXVERSE"
/>
      </div>

      <div className="pwa-install-content">
        <div className="pwa-install-heading">
          <Smartphone size={17} />
          <strong>Take MXVERSE with you</strong>
        </div>

        <p>
          Add MXVERSE to your home screen for quick access
          to your campus universe.
        </p>

        {showInstructions && (
          <div className="pwa-install-instructions">
            {isIOS ? (
              <>
                Open this page in Safari, tap the Share
                button, then select <strong>Add to Home Screen</strong>.
              </>
            ) : (
              <>
                Open your browser menu and select
                <strong> Install app</strong> or
                <strong> Add to Home screen</strong>.
              </>
            )}
          </div>
        )}

        <button
          className="pwa-install-button"
          onClick={handleInstall}
        >
          <Download size={17} />
          {installEvent ? 'Install MXVERSE' : 'Add to Home Screen'}
        </button>
      </div>

      <button
        className="pwa-install-close"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
      >
        <X size={18} />
      </button>
    </section>
  );
}

export default PwaInstallPrompt;
