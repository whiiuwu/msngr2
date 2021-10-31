// Standard authentication implementation with firebase
import React from "react";
import { User } from "@firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";

const AuthContext = createContext<User | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: { children: any }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      setError(error);

      console.error([error.code, error.message]);
    });

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  });

  return (
    <AuthContext.Provider value={currentUser}>
      {!error ? props.children : <ErrorPage error={error} />}
    </AuthContext.Provider>
  );
}

function ErrorPage(props: { error: any }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Unable to authenticate anonymously.</h1>
      <code>
        {props.error?.code} {props.error?.message}
      </code>
    </div>
  );
}
