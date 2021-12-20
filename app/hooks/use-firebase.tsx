import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import * as React from "react";

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = React.createContext<FirebaseContextValue | null>(null);

export const FirebaseProvider: React.FC<FirebaseContextValue> = ({
  app,
  auth,
  firestore,
  ...props
}) => <FirebaseContext.Provider value={{ app, auth, firestore }} {...props} />;

export function useFirebase(): FirebaseContextValue {
  const value = React.useContext(FirebaseContext);

  if (value === null) {
    throw new Error();
  }

  return value;
}
