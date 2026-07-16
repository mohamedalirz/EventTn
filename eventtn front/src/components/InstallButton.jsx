import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

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

    const { outcome } = await deferredPrompt.userChoice;

    console.log(outcome);

    setDeferredPrompt(null);
    setCanInstall(false);
  };

  if (!canInstall) return null;

  return (
  <button
    onClick={installApp}
    className="flex items-center gap-2 rounded-xl border border-orange-500 bg-transparent px-6 py-3 font-medium text-orange-500 transition hover:bg-orange-500 hover:text-white"
  >
    <Download size={18} />
    Install App
  </button>
);
}