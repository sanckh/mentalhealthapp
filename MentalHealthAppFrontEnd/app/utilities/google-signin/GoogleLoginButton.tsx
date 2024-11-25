import React, { useEffect, useState } from "react";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

<GoogleSigninButton />;
declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load the Google One-Tap Sign-In script
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.onload = () => {
      setLoaded(true);
      initializeGoogleSignIn();
    };
    scriptTag.onerror = () => {
      console.error("Failed to load Google One-Tap script");
    };
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_WEB_CLIENT_ID", //#TODO: Replace with your Google Web Client ID
        callback: handleCredentialResponse,
      });

      // Render the Google login button
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "filled_blue",
          size: "large",
          text: "continue_with",
          locale: "en",
        }
      );
    } else {
      console.error("Google SDK not loaded");
    }
  };

  const handleCredentialResponse = (response: any) => {
    const { credential } = response;
    const decodedToken = parseJwt(credential);
    console.log("Decoded JWT Token:", decodedToken);

    //#TODO: Process authentication logic here
    // send the token to your backend for verification
    // set auth context
    // set token in local storage
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  };

  return (
    <div>
      {true ? (
        <div style={{ borderRadius: "8px", marginTop: "24px" }} id="google-signin-button">
          <GoogleSigninButton />
         
        </div>
      ) : (
        <p>Loading Google Sign-In...</p>
      )}
    </div>
  );
}
