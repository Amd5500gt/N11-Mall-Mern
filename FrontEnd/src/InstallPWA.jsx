import React, { useEffect, useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";

const InstallPWA = () => {
  const deferredPromptRef = useRef(null);
  const [deferredAvailable, setDeferredAvailable] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setDeferredAvailable(true);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
      deferredPromptRef.current = null;
      setDeferredAvailable(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // check if already installed (standalone)
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://");

    if (isStandalone) setInstalled(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const openPrompt = async () => {
    if (!deferredPromptRef.current) return;
    setShowPrompt(false);
    setInstalling(true);
    try {
      const promptEvent = deferredPromptRef.current;
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
    } catch (err) {
      console.error("Install prompt failed:", err);
    } finally {
      setInstalling(false);
      deferredPromptRef.current = null;
      setDeferredAvailable(false);
    }
  };

  return (
    <>
      {!installed && deferredAvailable && (
        <button
          onClick={() => setShowPrompt(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            border: "none",
            borderRadius: "16px",
            padding: "14px 22px",
            background: "linear-gradient(135deg,#14b8a6,#0f766e)",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
          }}
        >
          <BsDownload />
          Install App
        </button>
      )}

      {showPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              background: "#fff",
              borderRadius: "16px",
              padding: "22px",
              position: "relative",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}
          >
            <button
              onClick={() => setShowPrompt(false)}
              style={{ position: "absolute", top: 12, right: 14, border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }}
            >
              ×
            </button>

            <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Install NexXcart</h3>
            <p style={{ color: "#4b5563", marginBottom: 18 }}>Get an app-like experience with offline support and quicker access.</p>

            {!installing && (
              <button
                onClick={openPrompt}
                style={{ width: "100%", border: "none", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg,#14b8a6,#0f766e)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
              >
                <BsDownload />
                &nbsp;Install Now
              </button>
            )}

            {installing && <p style={{ color: "#6b7280" }}>Opening install dialog…</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;