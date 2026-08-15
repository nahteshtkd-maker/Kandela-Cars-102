import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
}

const CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();


let scriptLoadPromise: Promise<void> | null = null;
function loadGoogleScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

// google.accounts.id.initialize() must only ever be called once per client_id —
// calling it again (e.g. React StrictMode's intentional double-mount in dev)
// triggers "[GSI_LOGGER]: initialize() is called multiple times" and can leave
// the sign-in popup blank. renderButton() is safe to call repeatedly and is
// what actually needs to run on every mount (to (re)attach to the container).
let googleInitializedForClientId: string | null = null;

function ensureGoogleInitialized(clientId: string, callback: (response: { credential: string }) => void) {
  if (googleInitializedForClientId === clientId) return;
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback,
    // FedCM is the newer, browser-mediated sign-in flow — it doesn't rely on
    // third-party cookies the way the classic popup/iframe flow does, so it
    // isn't affected by Chrome's third-party cookie blocking (which is what
    // caused the blank popup during testing).
    use_fedcm_for_button: true
  });
  googleInitializedForClientId = clientId;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onCredential }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;
        ensureGoogleInitialized(CLIENT_ID, (response: { credential: string }) => onCredential(response.credential));
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: containerRef.current.offsetWidth || 320
        });
        setReady(true);
      })
      .catch(err => {
        console.error('[google-signin] Failed to load/initialize Google Identity Services:', err);
        setReady(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        title="Google sign-in isn't configured yet — set VITE_GOOGLE_CLIENT_ID"
        className="w-full flex items-center justify-center gap-2 bg-white border border-kandela-border text-kandela-muted font-semibold text-sm py-2.5 rounded-full cursor-not-allowed"
        id="google-signin-btn-disabled"
      >
        Continue with Google (not configured)
      </button>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} id="google-signin-btn-container" className="w-full flex justify-center" />
      {!ready && (
        <div className="w-full bg-white border border-kandela-border text-kandela-muted text-sm py-2.5 rounded-full text-center animate-pulse">
          Loading Google Sign-In…
        </div>
      )}
    </div>
  );
};
