import React, {
  useEffect,
  useRef,
  useState
} from "react";

import "@khmyznikov/pwa-install";

const InstallPWA = () => {
  const pwaRef = useRef(null);
  
  const [showPopup, setShowPopup] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [progress, setProgress] = useState(0);

  /* CHECK IF ALREADY INSTALLED */
  useEffect(() => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    if (isInstalled) {
      setInstalled(true);
      setShowPopup(false); // Don't show popup if already installed
    }
  }, []);

  /* PWA INSTALL EVENTS */
  useEffect(() => {
    const pwa = pwaRef.current;

    const successHandler = () => {
      console.log("App Installed");
      
      // Complete progress
      setProgress(100);
      
      // Vibrate if supported
      navigator.vibrate?.(200);
      
      // Show installed state after delay
      setTimeout(() => {
        setInstalling(false);
        setInstalled(true);
      }, 800);
      
      // Auto close after 6 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 6000);
    };

    const failHandler = () => {
      console.log("Install Failed");
      setInstalling(false);
      setProgress(0);
    };

    const userChoiceHandler = (e) => {
      console.log(e.detail.outcome);
      
      if (e.detail.outcome !== "accepted") {
        // User cancelled
        setInstalling(false);
        setProgress(0);
      }
      // If accepted, wait for success event
    };

    pwa?.addEventListener("pwa-install-success-event", successHandler);
    pwa?.addEventListener("pwa-install-fail-event", failHandler);
    pwa?.addEventListener("pwa-user-choice-result-event", userChoiceHandler);

    return () => {
      pwa?.removeEventListener("pwa-install-success-event", successHandler);
      pwa?.removeEventListener("pwa-install-fail-event", failHandler);
      pwa?.removeEventListener("pwa-user-choice-result-event", userChoiceHandler);
    };
  }, []);

  /* HANDLE INSTALL CLICK */
  const handleInstallClick = () => {
    // Show custom popup instead of default dialog
    setShowPopup(true);
  };

  /* START INSTALLATION */
  const startInstallation = async () => {
    try {
      setInstalling(true);
      setProgress(0);

      // Fake progress
      let current = 0;
      const fakeLoader = setInterval(() => {
        current += Math.floor(Math.random() * 8) + 2;
        if (current >= 90) {
          current = 90;
          clearInterval(fakeLoader);
        }
        setProgress(current);
      }, 300);

      // Show the actual install dialog
      pwaRef.current?.showDialog();

    } catch (error) {
      console.log(error);
      setInstalling(false);
      setProgress(0);
    }
  };

  /* OPEN APP */
  const openApp = () => {
    window.location.reload();
  };

  /* CLOSE POPUP */
  const closePopup = () => {
    if (!installing) {
      setShowPopup(false);
    }
  };

  /* Don't render anything if already installed and popup isn't showing */
  if (installed && !showPopup) {
    return (
      <div>
        <button
          onClick={openApp}
          style={{
            padding: "14px 22px",
            border: "none",
            borderRadius: "16px",
            background: "linear-gradient(135deg,#14b8a6,#0f766e)",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 10px 30px rgba(20,184,166,0.25)"
          }}
        >
          🚀 Open App
        </button>
        
        <pwa-install
          ref={pwaRef}
          manual-chrome
          manual-apple
          use-local-storage
          disable-screenshots={false}
          manifest-url="/manifest.json"
        ></pwa-install>
      </div>
    );
  }

  return (
    <div>
      {/* CUSTOM BUTTON */}
      <button
        onClick={handleInstallClick}
        style={{
          padding: "14px 22px",
          border: "none",
          borderRadius: "16px",
          background: "linear-gradient(135deg,#14b8a6,#0f766e)",
          color: "#fff",
          fontWeight: "700",
          cursor: "pointer",
          fontSize: "16px",
          boxShadow: "0 10px 30px rgba(20,184,166,0.25)"
        }}
      >
        {installed ? "🚀 Open App" : "📥 Install App"}
      </button>

      {/* PWA INSTALL */}
      <pwa-install
        ref={pwaRef}
        manual-chrome
        manual-apple
        use-local-storage
        disable-screenshots={false}
        manifest-url="/manifest.json"
      ></pwa-install>

      {/* CUSTOM POPUP */}
      {showPopup && (
        <>
          {/* BACKDROP */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
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
                maxWidth: "360px",
                background: "#f7f7f7",
                borderRadius: "28px",
                padding: "30px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
                animation: "popupShow 0.35s ease",
              }}
            >
              {/* GLOW */}
              <div
                style={{
                  position: "absolute",
                  width: "200px",
                  height: "200px",
                  background: "rgba(34,197,94,0.12)",
                  borderRadius: "50%",
                  top: "-80px",
                  right: "-80px",
                  filter: "blur(40px)",
                }}
              />

              {/* CLOSE */}
              {!installing && (
                <button
                  onClick={closePopup}
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    border: "none",
                    background: "transparent",
                    color: "#555",
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
                  width: "90px",
                  height: "90px",
                  margin: "0 auto 20px",
                  borderRadius: "24px",
                  background: installed 
                    ? "linear-gradient(135deg,#22c55e,#16a34a)" 
                    : "linear-gradient(135deg,#14b8a6,#0f766e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  color: "#fff",
                  boxShadow: installed 
                    ? "0 15px 35px rgba(34,197,94,0.35)" 
                    : "0 15px 35px rgba(20,184,166,0.35)",
                }}
              >
                {installed ? "✅" : "📱"}
              </div>

              {/* TITLE */}
              <h2
                style={{
                  color: "#111827",
                  marginBottom: "12px",
                  fontSize: "28px",
                  fontWeight: "800",
                }}
              >
                NexXcart
              </h2>

              {/* INSTALLING UI */}
              {installing && (
                <>
                  {/* PROGRESS CIRCLE */}
                  <div
                    style={{
                      position: "relative",
                      width: "95px",
                      height: "95px",
                      margin: "0 auto 22px",
                    }}
                  >
                    <div
                      style={{
                        width: "95px",
                        height: "95px",
                        borderRadius: "50%",
                        background: `conic-gradient(#14b8a6 ${progress * 3.6}deg, #e5e7eb 0deg)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "pulse 1.5s infinite",
                      }}
                    >
                      <div
                        style={{
                          width: "74px",
                          height: "74px",
                          borderRadius: "50%",
                          background: "#f7f7f7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "18px",
                          color: "#14b8a6",
                        }}
                      >
                        {progress}%
                      </div>
                    </div>
                  </div>

                  <h3 style={{ color: "#111827", marginBottom: "10px" }}>
                    Installing App...
                  </h3>
                  
                  <p
                    style={{
                      color: "#6b7280",
                      lineHeight: "1.7",
                      fontSize: "14px",
                      marginBottom: "20px",
                    }}
                  >
                    Preparing premium experience for your device 🚀
                  </p>

                  {/* PROGRESS BAR */}
                  <div
                    style={{
                      width: "100%",
                      height: "10px",
                      background: "#e5e7eb",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: "linear-gradient(90deg,#14b8a6,#0f766e)",
                        borderRadius: "999px",
                        transition: "0.25s linear",
                      }}
                    />
                  </div>
                </>
              )}

              {/* INSTALLED UI */}
              {!installing && installed && (
                <>
                  <p
                    style={{
                      color: "#4b5563",
                      lineHeight: "1.7",
                      marginBottom: "24px",
                    }}
                  >
                    NexXcart has been installed successfully 🎉
                  </p>
                  
                  <button
                    onClick={openApp}
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "15px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg,#22c55e,#16a34a)",
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 12px 30px rgba(34,197,94,0.25)",
                    }}
                  >
                    🚀 Open App
                  </button>
                </>
              )}

              {/* DEFAULT UI */}
              {!installing && !installed && (
                <>
                  <p
                    style={{
                      color: "#4b5563",
                      lineHeight: "1.7",
                      fontSize: "15px",
                      marginBottom: "24px",
                    }}
                  >
                    Install NexXcart for faster access, smoother performance 
                    and app-like experience 🚀
                  </p>
                  
                  <button
                    onClick={startInstallation}
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "15px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg,#14b8a6,#0f766e)",
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 12px 30px rgba(20,184,166,0.25)",
                    }}
                  >
                    📥 Install App
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
                  transform: scale(0.9) translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
            `}
          </style>
        </>
      )}
    </div>
  );
};

export default InstallPWA;