// src/components/GoogleAuth.tsx
import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const GoogleAuth: React.FC = () => {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Login Success:", credentialResponse);
    // Important: Send credentialResponse.credential (the ID token) to your backend
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div>
      <h2>Sign Up with Google</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default GoogleAuth;