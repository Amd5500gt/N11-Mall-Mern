import React, { useEffect, useRef } from 'react'
import BASE_URL from '../config/config'
import toast from 'react-hot-toast'

const GoogleAuth = () => {

  const initialized = useRef(false);

  const handleCredentailResponse = async (response) => {

    try {

      const res = await fetch(`${BASE_URL}/auth/google-login`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          credential: response.credential
        })

      });

      const data = await res.json();

      console.log(data);

      if (data.success) {

        // Save user data to localStorage
        const userProfile = {
          name: data.name,
          email: data.email
        };
        
        localStorage.setItem("loggedInUser", JSON.stringify(userProfile));
        localStorage.setItem("jwtToken", data.token);

        toast.success("Login Success");
        
        // Smooth transition before reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } else {

        toast.error(data.message || "Login Failed");

      }

    } catch (err) {

      console.log(err);

      toast.error("Something went wrong");

    }

  };

  useEffect(() => {

    // Prevent multiple initialization
    if (initialized.current) return;

    initialized.current = true;

    const initGoogle = () => {

      // Check Google Script
      if (!window.google) {

        console.log("Google script not loaded");

        return;

      }

      // Initialize Google Auth
      window.google.accounts.id.initialize({

        client_id: "544841424268-ouptou7q8ca2j72gajck8ckrcr4btl7h.apps.googleusercontent.com",

        callback: handleCredentailResponse

      });

      // Render Google Button
      window.google.accounts.id.renderButton(

        document.getElementById("googleBtn"),

        {
          theme: "outline",
          size: "large",
          width: "300"
        }

      );

    };

    // Wait for script load
    setTimeout(initGoogle, 1000);

  }, []);

  return (
    <div className='d-flex justify-content-center' style={{ marginTop: '20px' }}>

    </div>
  );

};

export default GoogleAuth;