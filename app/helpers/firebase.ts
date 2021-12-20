import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  connectAuthEmulator,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";

export function getFirebase({
  projectId,
  appId,
  apiKey,
  messagingSenderId,
  measurementId,
  firebaseAuthEmulatorHost,
  firestoreEmulatorHost,
}: {
  projectId: string;
  appId: string;
  apiKey: string;
  messagingSenderId: string;
  measurementId: string;
  firebaseAuthEmulatorHost?: string;
  firestoreEmulatorHost?: string;
}): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (getApps().length === 0) {
    const app = initializeApp({
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId,
      appId,
      measurementId,
    });
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    setPersistence(auth, inMemoryPersistence);

    if (typeof firebaseAuthEmulatorHost === "string") {
      connectAuthEmulator(auth, `http://${firebaseAuthEmulatorHost}`);

      console.info("Firebase Auth has set up for the emulator.");
    }

    if (typeof firestoreEmulatorHost === "string") {
      connectFirestoreEmulator(
        firestore,
        firestoreEmulatorHost.split(":")[0],
        parseInt(firestoreEmulatorHost.split(":")[1])
      );

      console.info("Firestore has set up for the emulator.");
    }
  }

  const app = getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}
