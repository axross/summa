import * as React from "react";
import { Toaster } from "react-hot-toast";
import {
  createCookie,
  ErrorBoundaryComponent,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import { twMerge } from "tailwind-merge";
import { FullscreenLoadingCurtain } from "~/components/fullscreen-loading-curatin";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutHeaderTitle,
} from "~/components/layout";
import { getFirebase } from "~/helpers/firebase";
import { getFirebaseAdmin } from "~/helpers/firebase.server";
import { AuthContextProvider, useUnsafeAuth } from "~/hooks/use-auth";
import { FirebaseProvider } from "~/hooks/use-firebase";

import globalCssUrl from "~/global.css";

interface Env {
  version: string;
  firebaseProjectId: string;
  firebaseAppId: string;
  firebaseApiKey: string;
  firebaseMessagingSenderId: string;
  firebaseMeasurementId: string;
  firebaseAuthEmulatorHost?: string;
  firestoreEmulatorHost?: string;
}

interface LoaderData {
  env: Env;
  customToken: string | null;
}

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderData> => {
  const env = {
    version: process.env.VERSION as string,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID as string,
    firebaseAppId: process.env.FIREBASE_APP_ID as string,
    firebaseApiKey: process.env.FIREBASE_API_KEY as string,
    firebaseMessagingSenderId: process.env
      .FIREBASE_MESSAGING_SENDER_ID as string,
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID as string,
    firebaseAuthEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    firestoreEmulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
  };

  const cookie = createCookie("summa-token-cc");
  const token = await cookie.parse(request.headers.get("cookie"));

  let customToken = null;
  if (token !== null) {
    const { auth } = getFirebaseAdmin();
    const claim = await auth.verifySessionCookie(token);
    customToken = await auth.createCustomToken(claim.uid);

    context.token = token;
    context.tokenClaim = claim;
    context.customToken = customToken;
  }

  return { env, customToken };
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalCssUrl },
];

const AppWrapper: React.VFC = () => {
  const { env, customToken } = useLoaderData<LoaderData>();

  React.useEffect(() => {
    (globalThis as any).__ENV__ = { version: env.version };
  }, [env]);

  return (
    <FirebaseProvider
      {...getFirebase({
        projectId: env.firebaseProjectId,
        appId: env.firebaseAppId,
        apiKey: env.firebaseApiKey,
        messagingSenderId: env.firebaseMessagingSenderId,
        measurementId: env.firebaseMeasurementId,
        firebaseAuthEmulatorHost: env.firebaseAuthEmulatorHost,
        firestoreEmulatorHost: env.firestoreEmulatorHost,
      })}
    >
      <AuthContextProvider tokenForHydration={customToken}>
        <App />
      </AuthContextProvider>
    </FirebaseProvider>
  );
};

const App: React.VFC = () => {
  const { myself, isLoading, authenticate } = useUnsafeAuth();

  if (!myself) {
    return (
      <Document>
        <main className="flex justify-center px-4 py-4 md:px-8">
          <div className="col-start-1 row-start-2 col-end-3 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>

            <div className="mt-2 font-medium">Authentication Required</div>

            <div className="mt-1 text-slate-500 text-sm">
              Get started by opening a new game session.
            </div>

            <button
              onClick={() => authenticate()}
              className="flex justify-self-end mt-6 px-4 py-1.5 items-center justify-center rounded-md bg-blue-700 text-white"
            >
              Sign in
            </button>
          </div>
        </main>

        <FullscreenLoadingCurtain hidden={!isLoading} key="curtain" />

        <Toaster key="toaster" />
      </Document>
    );
  }

  return (
    <Document>
      <Outlet />

      <FullscreenLoadingCurtain hidden={!isLoading} key="curtain" />

      <Toaster key="toaster" />
    </Document>
  );
};

interface DocumentProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Document: React.VFC<DocumentProps> = ({
  title,
  className,
  children,
  ...props
}) => {
  return (
    <html
      lang="en"
      className={twMerge("h-full bg-slate-100 dark:bg-black", className)}
      {...props}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>

      <body className="h-full">
        {children}

        <ScrollRestoration />
        <Scripts />

        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

export const CatchBoundary: React.VFC = () => {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <LayoutHeader>
          <LayoutHeaderTitle>
            {caught.status} {caught.statusText}
          </LayoutHeaderTitle>
        </LayoutHeader>

        <LayoutContent>{message}</LayoutContent>
      </Layout>
    </Document>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);

  return (
    <Document title="Error!">
      <LayoutHeader>
        <LayoutHeaderTitle>Error Occured</LayoutHeaderTitle>
      </LayoutHeader>

      <LayoutContent>
        <div>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </LayoutContent>
    </Document>
  );
};

export default AppWrapper;
