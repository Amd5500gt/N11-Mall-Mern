import React, {
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import Login
from "./pages/Login";

import Register
from "./pages/Register";

import "./Auth.css";

import GoogleAuth
from "./components/GoogleAuth";

import PageForward
from "./components/PageForward";

import {
  useSearch
} from "../context/SearchContext";

import ForgetPassword
from "./pages/ForgetPassword/ForgetPassword";
import toast from "react-hot-toast";
import BASE_URL from "../config/config";



const AuthPage = () => {
  const navigate =
  useNavigate();

  const {
    token,
    setToken
  } = useSearch();

  /* AUTH MODE */

  const [
    authMode,
    setAuthMode
  ] = useState("login");

  /* FORM */

  const [
    formData,
    setFormData
  ] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""

  });

  /* UI */

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  const [
    isLoading,
    setIsLoading
  ] = useState(false);

  const [
    passwordStrength,
    setPasswordStrength
  ] = useState(0);

  /* INPUT CHANGE */

  const handleChange =
  (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:value
    }));

    if (name === "password") {

      checkPasswordStrength(
        value
      );

    }

  };

  /* PASSWORD STRENGTH */

  const checkPasswordStrength =
  (password) => {

    let strength = 0;

    if (
      password.length >= 8
    ) strength++;

    if (
      password.match(/[a-z]/) &&
      password.match(/[A-Z]/)
    ) strength++;

    if (
      password.match(/\d/)
    ) strength++;

    if (
      password.match(
        /[^a-zA-Z\d]/
      )
    ) strength++;

    setPasswordStrength(
      strength
    );

  };

  /* SWITCH MODE */

  const switchMode =
  (mode) => {

    setAuthMode(mode);

    resetForm();

  };

  /* RESET FORM */

  const resetForm =
  () => {

    setFormData({

      name:"",
      email:"",
      password:"",
      confirmPassword:""

    });

    setPasswordStrength(0);

    setShowPassword(false);

    setShowConfirmPassword(false);

  };

  /* LOGIN */

  const handleLogin =
  async (e) => {

    e.preventDefault();

    const {
      email,
      password
    } = formData;

    if (
      !email ||
      !password
    ) {

      return toast.error(
        "All fields are required"
      );
    }

    try {

      setIsLoading(true);

      const response =
      await fetch(
        `${BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const result =
      await response.json();

      if (result.success) {

        const userProfile = {

          id:
          result.user.id,

          name:
          result.user.name,

          email:
          result.user.email,

          picture:
          result.user.picture || "",

          address:
          result.user.address || "",

          cart:
          result.user.cart || []

        };

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(userProfile)
        );

        localStorage.setItem(
          "jwtToken",
          result.token
        );

        setToken(
          result.token
        );
      
        toast.success(
          "Login successful"
        );

        setTimeout(() => {

          navigate("/");

        }, 1500);

      } else {
        toast.error(
          result.message ||
          "Login failed"
        );
      }

    }

   catch (err) {

  localStorage.removeItem("jwtToken");

  setToken(null);

  toast.error(
    err.message ||
    "Login failed"
  );



    }

    finally {

      setIsLoading(false);

    }

  };

  /* REGISTER */

  const handleRegister =
  async (e) => {

    e.preventDefault();

    const {

      name,
      email,

      password,
      confirmPassword

    } = formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      return toast.error(
        "All fields are required"
      );

    }

    if (
      password !==
      confirmPassword
    ) {

      return toast.error(
        "Passwords do not match"
      );

    }

    if (
      password.length < 8
    ) {

      return toast.error(
        "Password must be at least 8 characters"
      );

    }

    try {

      setIsLoading(true);

      const response =
      await fetch(
        `${BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const result =
      await response.json();

      if (result.success) {

        const userProfile = {

          id:
          result.user.id,

          name:
          result.user.name,

          email:
          result.user.email,

          picture:
          result.user.picture || "",

          address:
          result.user.address || "",

          cart:
          result.user.cart || []

        };

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(userProfile)
        );

        localStorage.setItem(
          "jwtToken",
          result.token
        );

        setToken(
          result.token
        );

        toast.success(
          "Registration successful"
        );

        setTimeout(() => {

          navigate("/");

        }, 1500);

      } else {
        toast.error(
          result.message ||
          "Registration failed"
        );
      }

    }

    catch (err) {

      toast.error(
        err.message ||
        "Registration failed"
      );

    }

    finally {

      setIsLoading(false);

    }

  };

  /* GOOGLE AUTH */

  const handleGoogleAuth =
  async (
    credentialResponse
  ) => {

    try {

      setIsLoading(true);

      const response =
      await fetch(
        `${BASE_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            credential:
            credentialResponse.credential
          })
        }
      );

      const result =
      await response.json();

      if (result.success) {

        const userProfile = {

          id:
          result.user._id,

          name:
          result.user.name,

          email:
          result.user.email,

          picture:
          result.user.picture || "",

          address:
          result.user.address || "",

          cart:
          result.user.cart || []

        };

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(userProfile)
        );

        localStorage.setItem(
          "jwtToken",
          result.token
        );

        setToken(
          result.token
        );

        toast.success(
          "Google login successful"
        );

        setTimeout(() => {

          navigate("/");

        }, 1500);

      } else {
        toast.error(
          result.message ||
          "Authentication failed"
        );
      }

    }

    catch (err) {

      console.log(err);

      toast.error(
        err.message ||
        "Authentication failed"
      );

    }

    finally {

      setIsLoading(false);

    }

  };

  /* GOOGLE INIT */

  useEffect(() => {

    const initializeGoogle =
    () => {

      if (!window.google)
        return;

      window.google.accounts.id.initialize({

        client_id:
        "544841424268-ouptou7q8ca2j72gajck8ckrcr4btl7h.apps.googleusercontent.com",

        callback:
        handleGoogleAuth,

        ux_mode:"popup",

      });

      const googleBtn =
      document.getElementById(
        "googleBtn"
      );

      if (googleBtn) {

        googleBtn.innerHTML =
        "";

        window.google.accounts.id.renderButton(

          googleBtn,

          {

            theme:"outline",

            size:"large",

            width:320,

            type:"standard",

            shape:"pill",

            text:"continue_with",

            logo_alignment:
            "left",

          }

        );

        window.google.accounts.id.cancel();

      }

    };

    const existingScript =
    document.getElementById(
      "google-script"
    );

    if (!existingScript) {

      const script =
      document.createElement(
        "script"
      );

      script.src =
      "https://accounts.google.com/gsi/client";

      script.async = true;

      script.defer = true;

      script.id =
      "google-script";

      script.onload =
      initializeGoogle;

      document.body.appendChild(
        script
      );

    }

    else {

      initializeGoogle();

    }

  }, []);

  /* REDIRECT */

  useEffect(() => {
if (
  token &&
  localStorage.getItem("jwtToken")
) {

  navigate("/", {
    replace: true
  });

}

  }, [token,navigate]);

  /* PASSWORD UI */

  const getPasswordStrengthText =
  () => {

    const texts = [

      "",
      "Weak",
      "Fair",
      "Good",
      "Strong"

    ];

    return (
      texts[
        passwordStrength
      ] || ""
    );

  };

  const getPasswordStrengthColor =
  () => {

    const colors = [

      "transparent",

      "#ff4444",

      "#ffbb33",

      "#00C851",

      "#007E33"

    ];

    return (
      colors[
        passwordStrength
      ] || "transparent"
    );

  };

  return (

    <div>

      <div className="container">

        <Login

          authMode={authMode}

          formData={formData}

          handleChange={handleChange}

          handleLogin={handleLogin}

          isLoading={isLoading}

          showPassword={showPassword}

          setShowPassword={
            setShowPassword
          }

          switchMode={switchMode}

        />

        <Register

          authMode={authMode}

          formData={formData}

          handleChange={handleChange}

          handleRegister={handleRegister}

          isLoading={isLoading}

          showPassword={showPassword}

          setShowPassword={
            setShowPassword
          }

          showConfirmPassword={
            showConfirmPassword
          }

          setShowConfirmPassword={
            setShowConfirmPassword
          }

          passwordStrength={
            passwordStrength
          }

          getPasswordStrengthText={
            getPasswordStrengthText
          }

          getPasswordStrengthColor={
            getPasswordStrengthColor
          }

        />

        <ForgetPassword

          authMode={authMode}

          formData={formData}

          isLoading={isLoading}

          setAuthMode={
            setAuthMode
          }

          resetForm={resetForm}

        />

        <PageForward

          authMode={authMode}

          switchMode={switchMode}

        />

        <GoogleAuth

          authMode={authMode}

          isLoading={isLoading}

        />

      </div>

    </div>

  );

};

export default AuthPage;