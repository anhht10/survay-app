import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let pendingInstallEvent: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    pendingInstallEvent = event as BeforeInstallPromptEvent;
  });
}

function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function useInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(pendingInstallEvent);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandalone());
    setIsIos(isIosDevice());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      pendingInstallEvent = event as BeforeInstallPromptEvent;
      setInstallEvent(pendingInstallEvent);
    };
    const handleAppInstalled = () => {
      pendingInstallEvent = null;
      setInstallEvent(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!installEvent) {
      if (isIos) {
        window.alert('Để cài ứng dụng: chạm nút Chia sẻ trong Safari, sau đó chọn “Thêm vào Màn hình chính”.');
      } else {
        window.alert('Nếu hộp thoại cài đặt chưa mở, hãy mở menu ⋮ của Chrome/Edge rồi chọn “Cài đặt SurveyApp”. Ứng dụng cần được mở qua HTTPS hoặc localhost.');
      }
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      pendingInstallEvent = null;
      setInstallEvent(null);
    }
  };

  return {
    canInstall: !isInstalled,
    install
  };
}