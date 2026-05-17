import React, {
  useEffect,
  useState
} from "react";

import "./css/SplashScreen.css";

const SplashScreen = ({
  children
}) => {

  const [
    loading,
    setLoading
  ] = useState(false);

  useEffect(() => {

    const alreadyVisited =

      localStorage.getItem(
        "nexxcart_splash_seen"
      );

    /* FIRST TIME ONLY */

    if (!alreadyVisited) {

      setLoading(true);

      const timer =
        setTimeout(() => {

          setLoading(false);

          localStorage.setItem(
            "nexxcart_splash_seen",
            "true"
          );

        }, 2600);

      return () =>
        clearTimeout(timer);

    }

  }, []);

  /* SHOW SPLASH */

  if (loading) {

    return (

      <div className="splash-screen">

        {/* GLOW */}

        <div className="splash-glow"></div>

        {/* LOGO */}

        <div className="splash-logo">

          <img
            src="/icon-192.png"
            alt="NexXcart"
          />

        </div>

        {/* TITLE */}

        <h1>

          NexXcart

        </h1>

        {/* LOADER */}

        <div className="splash-loader">

          <span></span>

        </div>

      </div>

    );

  }

  return children;
};

export default SplashScreen;