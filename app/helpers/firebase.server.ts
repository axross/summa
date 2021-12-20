import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

export function getFirebaseAdmin(): {
  app: App;
  auth: Auth;
  firestore: Firestore;
} {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIAL_JSON!)),
    });
  }

  const app = getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}
