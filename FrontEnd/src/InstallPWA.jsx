import React, {
  useEffect,
  useState
} from "react";

const InstallPWA = () => {

  const [
    deferredPrompt,
    setDeferredPrompt
  ] = useState(null);

  const [
    canInstall,
    setCanInstall
  ] = useState(false);

  const [
    showPopup,
    setShowPopup
  ] = useState(false);

  const [
    installing,
    setInstalling
  ] = useState(false);

  const [
    installed,
    setInstalled
  ] = useState(false);

  const [
    progress,
    setProgress
  ] = useState(0);

  /* =========================
     CHECK INSTALLED
  ========================= */

  useEffect(() => {

    const isInstalled =

      window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

    if (isInstalled) {

      setInstalled(true);

      setCanInstall(false);

    }

  }, []);

  /* =========================
     BEFORE INSTALL PROMPT
  ========================= */

  useEffect(() => {

    const handleBeforeInstall =
      (e) => {

        e.preventDefault();

        setDeferredPrompt(e);

        const isInstalled =

          window.matchMedia(
            "(display-mode: standalone)"
          ).matches;

        if (!isInstalled) {

          setCanInstall(true);

        }
      };

    const handleInstalled =
      () => {

        setProgress(100);

        navigator.vibrate?.(200);

        setTimeout(() => {

          setInstalling(false);

          setInstalled(true);

          setCanInstall(false);

        }, 700);

        setTimeout(() => {

          setShowPopup(false);

        }, 6000);
      };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    return () => {

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };

  }, []);

  /* =========================
     OPEN POPUP
  ========================= */

  const openPopup = () => {

    setShowPopup(true);

  };

  /* =========================
     START INSTALL
  ========================= */

  const startInstall =
    async () => {

      try {

        if (
          !deferredPrompt
        ) return;

        setInstalling(true);

        setProgress(0);

        /* FAKE PROGRESS */

        let current = 0;

        const fakeProgress =
          setInterval(() => {

            current +=
              Math.floor(
                Math.random() * 8
              ) + 2;

            if (current >= 90) {

              current = 90;

              clearInterval(
                fakeProgress
              );
            }

            setProgress(current);

          }, 300);

        /* NATIVE INSTALL */

        deferredPrompt.prompt();

        const { outcome } =

          await deferredPrompt.userChoice;

        /* USER CANCEL */

        if (
          outcome !==
          "accepted"
        ) {

          clearInterval(
            fakeProgress
          );

          setInstalling(false);

          setProgress(0);

          return;
        }

        /* WAIT FOR:
           appinstalled
        */

        setDeferredPrompt(null);

      }

      catch (error) {

        console.log(error);

        setInstalling(false);

        setProgress(0);
      }
    };

  /* =========================
     OPEN APP
  ========================= */

  const openApp = () => {

    window.location.reload();

  };

  /* =========================
     CLOSE
  ========================= */

  const closePopup =
    () => {

      if (!installing) {

        setShowPopup(false);

      }

    };

  /* =========================
     HIDE EVERYTHING
  ========================= */

  if (
    !canInstall &&
    !installed
  ) return null;

  return (

    <>

      {/* INSTALL BUTTON */}

      {!installed && (

        <button
          onClick={openPopup}
          style={{

            position: "fixed",

            bottom: "20px",

            right: "20px",

            zIndex: 9999,

            border: "none",

            padding:
              "14px 22px",

            borderRadius:
              "16px",

            background:
              "linear-gradient(135deg,#14b8a6,#0f766e)",

            color: "#fff",

            fontWeight: "700",

            cursor: "pointer",

            fontSize: "15px",

            boxShadow:
              "0 12px 30px rgba(20,184,166,0.25)"
          }}
        >
          📥 Install App
        </button>

      )}

      {/* POPUP */}

      {showPopup && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.65)",
            backdropFilter:
              "blur(8px)",
            zIndex: 99999,
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            padding: "20px",
          }}
        >

          {/* CARD */}

          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              background:
                "#f7f7f7",
              borderRadius:
                "28px",
              padding: "30px",
              position:
                "relative",
              textAlign:
                "center",
              overflow:
                "hidden",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.35)",
            }}
          >

            {/* CLOSE */}

            {!installing && (

              <button
                onClick={
                  closePopup
                }
                style={{
                  position:
                    "absolute",
                  top: "14px",
                  right: "14px",
                  border:
                    "none",
                  background:
                    "transparent",
                  fontSize:
                    "22px",
                  cursor:
                    "pointer",
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
                margin:
                  "0 auto 20px",
                borderRadius:
                  "24px",
                background:
                  installed
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : "linear-gradient(135deg,#14b8a6,#0f766e)",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize:
                  "42px",
                color:
                  "#fff",
              }}
            >
              {installed
                ? "✅"
                : "📱"}
            </div>

            {/* TITLE */}

            <h2
              style={{
                fontSize:
                  "28px",
                marginBottom:
                  "12px",
              }}
            >
              NexXcart
            </h2>

            {/* INSTALLING */}

            {installing && (

              <>

                {/* PROGRESS */}

                <div
                  style={{
                    position:
                      "relative",
                    width:
                      "95px",
                    height:
                      "95px",
                    margin:
                      "0 auto 22px",
                  }}
                >

                  <div
                    style={{
                      width:
                        "95px",
                      height:
                        "95px",
                      borderRadius:
                        "50%",
                      background:
                        `conic-gradient(
                          #14b8a6 ${
                            progress *
                            3.6
                          }deg,
                          #e5e7eb 0deg
                        )`,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >

                    <div
                      style={{
                        width:
                          "74px",
                        height:
                          "74px",
                        borderRadius:
                          "50%",
                        background:
                          "#f7f7f7",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontWeight:
                          "700",
                        color:
                          "#14b8a6",
                      }}
                    >
                      {progress}%
                    </div>

                  </div>

                </div>

                <h3>
                  Installing...
                </h3>

                <div
                  style={{
                    width:
                      "100%",
                    height:
                      "10px",
                    background:
                      "#e5e7eb",
                    borderRadius:
                      "999px",
                    overflow:
                      "hidden",
                    marginTop:
                      "18px",
                  }}
                >

                  <div
                    style={{
                      width:
                        `${progress}%`,
                      height:
                        "100%",
                      background:
                        "linear-gradient(90deg,#14b8a6,#0f766e)",
                      transition:
                        "0.25s linear",
                    }}
                  />

                </div>

              </>

            )}

            {/* INSTALLED */}

            {!installing &&
              installed && (

              <>

                <p
                  style={{
                    marginBottom:
                      "24px",
                    color:
                      "#4b5563",
                  }}
                >
                  App Installed
                  Successfully 🎉
                </p>

                <button
                  onClick={
                    openApp
                  }
                  style={{
                    width:
                      "100%",
                    border:
                      "none",
                    padding:
                      "15px",
                    borderRadius:
                      "16px",
                    background:
                      "linear-gradient(135deg,#22c55e,#16a34a)",
                    color:
                      "#fff",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  🚀 Open App
                </button>

              </>

            )}

            {/* DEFAULT */}

            {!installing &&
              !installed && (

              <>

                <p
                  style={{
                    lineHeight:
                      "1.7",
                    color:
                      "#4b5563",
                    marginBottom:
                      "24px",
                  }}
                >
                  Install NexXcart
                  for better app
                  experience 🚀
                </p>

                <button
                  onClick={
                    startInstall
                  }
                  style={{
                    width:
                      "100%",
                    border:
                      "none",
                    padding:
                      "15px",
                    borderRadius:
                      "16px",
                    background:
                      "linear-gradient(135deg,#14b8a6,#0f766e)",
                    color:
                      "#fff",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  📥 Install Now
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </>

  );
};

export default InstallPWA;