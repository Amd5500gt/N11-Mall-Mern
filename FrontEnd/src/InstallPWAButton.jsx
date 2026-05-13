import React, { useEffect, useState } from "react";

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState(null);

  const [showPopup, setShowPopup] =
    useState(false);

  const [installing, setInstalling] =
    useState(false);

  const [installed, setInstalled] =
    useState(false);

  /* ================= CHECK INSTALLED ================= */

  useEffect(() => {
    const isInstalled =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      window.navigator.standalone === true;

    if (isInstalled) {
      setInstalled(true);
    }
  }, []);

  /* ================= INSTALL EVENTS ================= */

  useEffect(() => {
    const beforeInstallHandler = (e) => {
      e.preventDefault();

      setDeferredPrompt(e);

      setShowPopup(true);
    };

    const installedHandler = () => {
      setInstalling(false);

      setInstalled(true);

      navigator.vibrate?.(200);

      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    };

    window.addEventListener(
      "beforeinstallprompt",
      beforeInstallHandler
    );

    window.addEventListener(
      "appinstalled",
      installedHandler
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallHandler
      );

      window.removeEventListener(
        "appinstalled",
        installedHandler
      );
    };
  }, []);

  /* ================= INSTALL APP ================= */

  const installApp = async () => {
    if (!deferredPrompt) return;

    setInstalling(true);

    deferredPrompt.prompt();

    const { outcome } =
      await deferredPrompt.userChoice;

    if (outcome !== "accepted") {
      setInstalling(false);
    }

    setDeferredPrompt(null);
  };

  /* ================= OPEN APP ================= */

  const openApp = () => {
    window.location.href = "/";
  };

  if (!showPopup && !installed) return null;

  return (
    <>
      {/* BACKDROP */}

      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          zIndex: 99999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        {/* CARD */}

        <div
          style={{
            width: "100%",
            maxWidth: "370px",
            borderRadius: "28px",
            background:
              "linear-gradient(145deg,#0f172a,#1e293b)",
            padding: "30px",
            border:
              "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.55)",
            textAlign: "center",
            animation:
              "popupShow 0.35s ease",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* GLOW */}

          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              background:
                "rgba(34,197,94,0.18)",
              borderRadius: "50%",
              top: "-60px",
              right: "-60px",
              filter: "blur(40px)",
            }}
          />

          {/* ICON */}

          <div
            style={{
              width: "90px",
              height: "90px",
              margin: "0 auto 20px",
              borderRadius: "26px",
              background:
                "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              boxShadow:
                "0 15px 35px rgba(34,197,94,0.4)",
            }}
          >
            📱
          </div>

          {/* TITLE */}

          <h2
            style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            NexXcart
          </h2>

          {/* TEXT */}

          {!installing && !installed && (
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "15px",
                lineHeight: "1.7",
                marginBottom: "26px",
              }}
            >
              Install NexXcart for
              lightning fast access,
              smoother performance &
              app-like experience 🚀
            </p>
          )}

          {/* INSTALLING UI */}

          {installing && (
            <div>
              {/* SPINNER */}

              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 20px",
                  border:
                    "6px solid rgba(255,255,255,0.1)",
                  borderTop:
                    "6px solid #22c55e",
                  borderRadius: "50%",
                  animation:
                    "spin 1s linear infinite",
                }}
              />

              <h3
                style={{
                  color: "#fff",
                  marginBottom: "10px",
                }}
              >
                Installing...
              </h3>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Please wait while
                NexXcart is being added
                to your device
              </p>
            </div>
          )}

          {/* INSTALLED UI */}

          {installed && (
            <div>
              {/* SUCCESS ICON */}

              <div
                style={{
                  width: "90px",
                  height: "90px",
                  margin: "0 auto 18px",
                  borderRadius: "50%",
                  background:
                    "rgba(34,197,94,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  color: "#22c55e",
                  border:
                    "2px solid rgba(34,197,94,0.35)",
                  animation:
                    "successPop 0.5s ease",
                }}
              >
                ✅
              </div>

              <h3
                style={{
                  color: "#4ade80",
                  marginBottom: "12px",
                  fontSize: "24px",
                }}
              >
                App Installed
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.7",
                  marginBottom: "24px",
                }}
              >
                NexXcart has been
                successfully installed on
                your device 🎉
              </p>

              <button
                onClick={openApp}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "15px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow:
                    "0 12px 30px rgba(34,197,94,0.35)",
                }}
              >
                🚀 Open App
              </button>
            </div>
          )}

          {/* INSTALL BUTTON */}

          {!installing && !installed && (
            <button
              onClick={installApp}
              style={{
                width: "100%",
                border: "none",
                padding: "15px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow:
                  "0 12px 30px rgba(34,197,94,0.35)",
                transition: "0.3s",
              }}
            >
              📥 Install App
            </button>
          )}
        </div>
      </div>

      {/* ANIMATIONS */}

      <style>
        {`
          @keyframes popupShow {
            from {
              opacity: 0;
              transform: scale(0.85) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes successPop {
            from {
              transform: scale(0.5);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default InstallPWAButton;