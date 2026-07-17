import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  const isIOS =
    /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setCanInstall(false);
  };

  // iPhone / iPad
  if (isIOS && !isStandalone) {
    return (
      <div className="rounded-xl border border-orange-500 p-4 text-sm text-orange-500">
        📲 Install this app<br />
        Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>.
      </div>
    );
  }

  if (!canInstall) return null;

  return (
    <button
      onClick={installApp}
      className="flex items-center gap-2 rounded-xl border border-orange-500 px-6 py-3 text-orange-500 hover:bg-orange-500 hover:text-white"
    >
      <Download size={18} />
      Install App
    </button>
  );
}
