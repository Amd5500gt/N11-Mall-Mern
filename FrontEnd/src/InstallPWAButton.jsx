import React, {
  useEffect,
  useState
} from "react";

const InstallPWAButton = () => {

  const [deferredPrompt, setDeferredPrompt] =
    useState(null);

  const [showInstall, setShowInstall] =
    useState(false);

  /* ================= CAPTURE INSTALL EVENT ================= */

  useEffect(() => {

    const handler = (e) => {

      e.preventDefault();

      setDeferredPrompt(e);

      setShowInstall(true);

    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () => {

      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );

    };

  }, []);

  /* ================= INSTALL APP ================= */

  const handleInstallClick = async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } =
      await deferredPrompt.userChoice;

    if (outcome === "accepted") {

      console.log("PWA Installed");

    }

    setDeferredPrompt(null);

    setShowInstall(false);

  };

  /* ================= HIDE IF NOT AVAILABLE ================= */

  if (!showInstall) return null;

  return (

    <button
      onClick={handleInstallClick}
      style={{

        padding: "12px 22px",

        border: "none",

        borderRadius: "14px",

        background:
          "linear-gradient(135deg,#22c55e,#16a34a)",

        color: "#fff",

        fontWeight: "700",

        cursor: "pointer",

        boxShadow:
          "0 10px 25px rgba(34,197,94,0.25)"

      }}
    >

      📱 Install NexXcart

    </button>

  );

};

export default InstallPWAButton;