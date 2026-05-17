import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  BsDownload
} from "react-icons/bs";


const InstallPWA = () => {

  const deferredPromptRef =
    useRef(null);

  const [
    deferredAvailable,
    setDeferredAvailable
  ] = useState(false);

  const [
    showPrompt,
    setShowPrompt
  ] = useState(false);

  const [
    installing,
    setInstalling
  ] = useState(false);

  const [
    installed,
    setInstalled
  ] = useState(false);

  /* =========================
     CHECK INSTALL
  ========================= */

  useEffect(() => {

    const handleBeforeInstall =
      (e) => {

        e.preventDefault();

        deferredPromptRef.current =
          e;

        setDeferredAvailable(true);

      };

    const handleInstalled =
      () => {

        setInstalled(true);

        setShowPrompt(false);

        setDeferredAvailable(false);

        deferredPromptRef.current =
          null;

      };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    /* CHECK STANDALONE */

    const standalone =

      window.matchMedia?.(
        "(display-mode: standalone)"
      )?.matches ||

      window.navigator.standalone ||

      document.referrer.includes(
        "android-app://"
      );

    if (standalone) {

      setInstalled(true);

    }

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
     OPEN INSTALL
  ========================= */

  const openPrompt =
    async () => {

      if (
        !deferredPromptRef.current
      ) return;

      try {

        setInstalling(true);

        const promptEvent =
          deferredPromptRef.current;

        promptEvent.prompt();

        const choice =
          await promptEvent.userChoice;

        if (
          choice.outcome ===
          "accepted"
        ) {

          setInstalled(true);

        }

      }

      catch (err) {

        console.error(err);

      }

      finally {

        setInstalling(false);

        deferredPromptRef.current =
          null;

        setDeferredAvailable(false);

      }

    };

  return (

    <>

      {/* INSTALL BUTTON */}

      {!installed &&
        deferredAvailable && (

        <button
          onClick={() =>
            setShowPrompt(true)
          }
          className="install-pwa-btn"
        >

          <BsDownload />

          <span>
            Install App
          </span>

        </button>

      )}

      {/* POPUP */}

      {showPrompt && (

        <div className="install-popup-overlay">

          <div className="install-popup-card">

            {/* CLOSE */}

            <button
              onClick={() =>
                setShowPrompt(false)
              }
              className="install-close-btn"
            >
              ×
            </button>

            {/* ICON */}

            <div className="install-icon">

              📱

            </div>

            {/* TITLE */}

            <h2 className="install-title">

              NexXcart

            </h2>

            {/* DESC */}

            <p className="install-desc">

              Install NexXcart
              for faster access,
              offline support,
              and app-like
              experience 🚀

            </p>

            {/* INSTALL BTN */}

            {!installing && (

              <button
                onClick={
                  openPrompt
                }
                className="install-now-btn"
              >

                <BsDownload />

                Install Now

              </button>

            )}

            {/* LOADING */}

            {installing && (

              <p className="install-loading">

                Opening install
                dialog...

              </p>

            )}

          </div>

        </div>

      )}

    </>

  );

};

export default InstallPWA;