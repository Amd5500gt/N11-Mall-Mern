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
      ).matches;

    if (isInstalled) {
      setInstalled(true);
    }
  }, []);

  /* ================= INSTALL EVENTS ================= */

  useEffect(() => {
    const beforeInstallHandler = (e) => {
      e.preventDefault();

      setDeferredPrompt(e);

      if (!installed) {
        setShowPopup(true);
      }
    };

    const installedHandler = () => {
      setInstalling(false);

      setInstalled(true);

      setShowPopup(true);

      navigator.vibrate?.(200);

      setTimeout(() => {
        setShowPopup(false);
      }, 6000);
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
  }, [installed]);

  /* ================= INSTALL APP ================= */

  const installApp = async () => {
    try {
      if (
        !deferredPrompt ||
        installing
      )
        return;

      setInstalling(true);

      deferredPrompt.prompt();

      const { outcome } =
        await deferredPrompt.userChoice;

      if (outcome !== "accepted") {
        setInstalling(false);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.log(error);

      setInstalling(false);
    }
  };

  /* ================= OPEN APP ================= */

  const openApp = () => {
    window.location.reload();
  };

  /* ================= CLOSE ================= */

  const closePopup = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "340px",
            background: "#111827",
            borderRadius: "24px",
            padding: "28px",
            textAlign: "center",
            position: "relative",
            animation:
              "popupShow 0.3s ease",
          }}
        >
          {/* CLOSE */}

          {!installing && (
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                border: "none",
                background: "transparent",
                color: "#94a3b8",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          )}

          {/* ICON */}

          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 18px",
              borderRadius: "22px",
              background:
                "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              color: "#fff",
            }}
          >
            {installed ? "✅" : "📱"}
          </div>

          {/* TITLE */}

          <h2
            style={{
              color: "#fff",
              marginBottom: "12px",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            NexXcart
          </h2>

          {/* INSTALLING */}

          {installing && (
            <>
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  margin:
                    "10px auto 18px",
                  border:
                    "5px solid rgba(255,255,255,0.1)",
                  borderTop:
                    "5px solid #22c55e",
                  borderRadius: "50%",
                  animation:
                    "spin 1s linear infinite",
                }}
              />

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.6",
                  fontSize: "15px",
                }}
              >
                Installing app...
                <br />
                Please wait
              </p>
            </>
          )}

          {/* INSTALLED */}

          {!installing && installed && (
            <>
              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.7",
                  marginBottom: "22px",
                }}
              >
                App has been installed
                successfully 🎉
              </p>

              <button
                onClick={openApp}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "14px",
                  borderRadius: "14px",
                  background:
                    "#22c55e",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Open App
              </button>
            </>
          )}

          {/* DEFAULT */}

          {!installing &&
            !installed && (
              <>
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.7",
                    fontSize: "15px",
                    marginBottom: "22px",
                  }}
                >
                  Install NexXcart
                  for faster access and
                  app-like experience 🚀
                </p>

                <button
                  onClick={installApp}
                  style={{
                    width: "100%",
                    border: "none",
                    padding: "14px",
                    borderRadius: "14px",
                    background:
                      "#22c55e",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  Install App
                </button>
              </>
            )}
        </div>
      </div>

      {/* ANIMATIONS */}

      <style>
        {`
          @keyframes popupShow {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default InstallPWAButton;