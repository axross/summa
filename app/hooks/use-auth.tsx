import {
  getIdToken,
  GoogleAuthProvider,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import * as fs from "firebase/firestore";
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useLoaderData } from "remix";
import { userAccountConverter, userConverter } from "~/firestore/user";
import { useFirebase } from "~/hooks/use-firebase";
import { UserAccount } from "~/models/user";

function useUserAccount() {
  const { auth, firestore } = useFirebase();
  const [authUser, isAuthLoading, authError] = useAuthState(auth);
  const [account, isAccountLoading, accountError] = useDocumentData(
    fs
      .doc(firestore, "userAccounts", authUser?.uid ?? "#dummy#")
      .withConverter(userAccountConverter)
  );
  const [user, isUserLoading, userError] = useDocumentData(
    fs
      .doc(firestore, "users", authUser?.uid ?? "#dummy#")
      .withConverter(userConverter)
  );
  const userAccount = React.useMemo(
    () => (account && user ? UserAccount.parse({ ...account, ...user }) : null),
    [account, user]
  );

  return {
    myself: userAccount,
    isLoading: isAuthLoading || isAccountLoading || isUserLoading,
    error: authError || accountError || userError,
  };
}

function useAuthorizationChange() {
  const { auth } = useFirebase();
  const googleAuthProvider = React.useMemo(() => new GoogleAuthProvider(), []);

  const authenticate = React.useCallback(async () => {
    await signInWithPopup(auth, googleAuthProvider);
  }, [auth, googleAuthProvider, signInWithPopup]);

  const deauthenticate = React.useCallback(async () => {
    await signOut(auth);
  }, [auth, signOut]);

  return {
    authenticate,
    deauthenticate,
  };
}

function useAuthRestoration(token: string | null) {
  const { auth } = useFirebase();
  const [isRestored, setRestored] = React.useState(false);

  React.useEffect(() => {
    if (isRestored) return;

    if (token) {
      signInWithCustomToken(auth, token).then(() => {
        setRestored(true);
      });

      return;
    }

    setRestored(true);
  }, [auth, token]);

  return { isRestored };
}

function useAuthRefresh() {
  const { token } = useLoaderData();
  const { auth } = useFirebase();

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (auth.currentUser === null) return;

      getIdToken(auth.currentUser).then((newToken) => console.log(newToken));
    }, 1000 * 60 * 5);

    return () => clearInterval(intervalId);
  }, [auth, token]);
}

function useAuthCarbonCopy() {
  const { auth } = useFirebase();
  const [authUser, isAuthLoading, authError] = useAuthState(auth);

  React.useEffect(() => {
    if (isAuthLoading) return;

    if (authUser) {
      authUser.getIdToken().then((token) => {
        globalThis.fetch("/api/token-carbon-copies", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
      });
    } else {
      globalThis.fetch("/api/token-carbon-copies", { method: "DELETE" });
    }
  }, [authUser, isAuthLoading]);
}

interface AuthState {
  myself: UserAccount | null;
  isLoading: boolean;
  error: Error | undefined;
  authenticate: () => Promise<void>;
  deauthenticate: () => Promise<void>;
}

const AuthContext = React.createContext<AuthState | null>(null);

interface AuthContextProviderProps {
  tokenForHydration: string | null;
  children: React.ReactNode;
}

export const AuthContextProvider: React.VFC<AuthContextProviderProps> = ({
  tokenForHydration,
  ...props
}) => {
  const { myself, isLoading, error } = useUserAccount();
  const { authenticate, deauthenticate } = useAuthorizationChange();
  const { isRestored } = useAuthRestoration(tokenForHydration);
  useAuthRefresh();
  useAuthCarbonCopy();

  return (
    <AuthContext.Provider
      value={{
        myself,
        isLoading: isLoading || !isRestored,
        error,
        authenticate,
        deauthenticate,
      }}
      {...props}
    />
  );
};

export function useUnsafeAuth(): AuthState {
  const contextValue = React.useContext(AuthContext);

  if (contextValue === null) {
    throw new Error();
  }

  return contextValue;
}

export function useAuth(): {
  myself: UserAccount;
  authenticate: () => Promise<void>;
  deauthenticate: () => Promise<void>;
} {
  const contextValue = React.useContext(AuthContext);

  if (contextValue === null) {
    throw new Error();
  }

  const { myself, authenticate, deauthenticate } = contextValue;

  if (myself === null) {
    throw new Error();
  }

  return {
    myself,
    authenticate,
    deauthenticate,
  };
}
