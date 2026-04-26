import * as React from 'react';
import { registerSW } from 'virtual:pwa-register';
import toast from 'react-hot-toast';
import { Button } from './ui/Button';
import { InlineAlert } from './ui/InlineAlert';

const isStandaloneMode = () => {
  const w = window as any;
  const iOSStandalone = typeof w.navigator?.standalone === 'boolean' ? w.navigator.standalone : false;
  const displayStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const displayFullscreen = window.matchMedia?.('(display-mode: fullscreen)').matches ?? false;
  const displayMinimal = window.matchMedia?.('(display-mode: minimal-ui)').matches ?? false;
  return Boolean(iOSStandalone || displayStandalone || displayFullscreen || displayMinimal);
};

export const PwaUpdatePrompt: React.FC = () => {
  const [needRefresh, setNeedRefresh] = React.useState(false);
  const updateSWRef = React.useRef<null | ((reloadPage?: boolean) => Promise<void>)>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (updateSWRef.current) return;

    updateSWRef.current = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        toast.success('App pronto para uso offline.');
      },
    });

    const checkForUpdates = () => {
      updateSWRef.current?.();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkForUpdates();
    };

    const onFocus = () => {
      checkForUpdates();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    const interval = window.setInterval(checkForUpdates, 30 * 60 * 1000);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearInterval(interval);
    };
  }, []);

  if (!needRefresh) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[999]">
      <div className="mx-auto max-w-xl">
        <InlineAlert variant="info" title="Atualização disponível">
          <div className="flex flex-col gap-3">
            <div>Uma nova versão do app está pronta. Atualize para aplicar melhorias e correções.</div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={async () => {
                  if (!isStandaloneMode()) {
                    window.location.reload();
                    return;
                  }
                  await updateSWRef.current?.(true);
                }}
              >
                Atualizar agora
              </Button>
              <Button type="button" variant="secondary" onClick={() => setNeedRefresh(false)}>
                Mais tarde
              </Button>
            </div>
          </div>
        </InlineAlert>
      </div>
    </div>
  );
};

