import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const checkStandalone = () => {
      const w = window as any;
      const isStandaloneMode = Boolean(
        w.navigator?.standalone || 
        window.matchMedia?.('(display-mode: standalone)').matches ||
        window.matchMedia?.('(display-mode: fullscreen)').matches ||
        window.matchMedia?.('(display-mode: minimal-ui)').matches
      );
      setIsStandalone(isStandaloneMode);
    };

    // Detect iOS
    const checkIos = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(ua);
      setIsIos(isIosDevice);
    };

    checkStandalone();
    checkIos();

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
      console.log('PWA: beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`PWA: Install prompt outcome: ${outcome}`);
    
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return {
    isInstallable: !!installPrompt,
    isStandalone,
    isIos,
    showInstallPrompt,
  };
}
