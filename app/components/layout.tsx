import { Popover } from "@headlessui/react";
import * as React from "react";
import { Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { UserAccount } from "~/models/user";
import { Button } from "./button";
import { CogIcon, LogOutIcon } from "./icon";

interface LayoutProps
  extends Pick<
    LayoutGlobalNavigationProps,
    "myself" | "onSignInClick" | "onSignOutClick"
  > {
  links?: LayoutGlobalNavigationProps["links"];
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Layout: React.VFC<LayoutProps> = ({
  links = DEFAULT_LINKS,
  myself,
  onSignInClick,
  onSignOutClick,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className="flex flex-col items-stretch w-full min-h-screen bg-slate-50 dark:bg-black"
      {...props}
    >
      <LayoutGlobalNavigation
        myself={myself}
        links={links}
        onSignInClick={onSignInClick}
        onSignOutClick={onSignOutClick}
        className="flex-shrink-0"
      />

      {children}
    </div>
  );
};

export interface LayoutGlobalNavigationProps {
  myself?: UserAccount;
  links:
    | React.ReactElement<LayoutGlobalNavigationLinkProps>
    | React.ReactElement<LayoutGlobalNavigationLinkProps>[];
  onSignInClick?: React.MouseEventHandler;
  onSignOutClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
}

export const LayoutGlobalNavigation: React.VFC<LayoutGlobalNavigationProps> = ({
  myself,
  links,
  onSignInClick,
  onSignOutClick,
  className,
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <nav
      className={twMerge("w-full bg-slate-800 dark:bg-black", className)}
      {...props}
    >
      <div className="flex items-center justify-between max-w-5xl h-16 mx-auto px-4 sm:border-b sm:border-b-slate-700 sm:dark:border-b-zinc-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="hidden sm:block">
            <div className="ml-10 flex items-baseline space-x-4">{links}</div>
          </div>
        </div>

        {myself ? (
          <div className="hidden sm:block">
            <div className="ml-4 flex items-center sm:ml-6">
              <Popover className="ml-3 relative">
                <Popover.Button
                  type="button"
                  className="max-w-xs flex items-center bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-900 text-sm transition-all"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>

                  <img
                    className="h-8 w-8 rounded-full"
                    src={myself.avatarUrl}
                    alt={myself.name}
                  />
                </Popover.Button>

                <Popover.Panel
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="w-full flex items-center space-x-2 px-4 pt-4 pb-2">
                    <img
                      className="flex-shrink-0 h-10 w-10 rounded-full"
                      src={myself.avatarUrl}
                      alt={myself.name}
                    />

                    <div>
                      <div className="text-base font-medium leading-none text-slate-700">
                        {myself.name}
                      </div>

                      <div className="mt-2 text-sm font-medium leading-none text-slate-500">
                        @{myself.username}
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/users/me"
                      className="flex items-start w-full px-4 py-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 text-slate-700 text-sm font-normal cursor-pointer transition-all"
                    >
                      <CogIcon className="w-5 h-5 mr-2" />
                      Settings
                    </Link>

                    <button
                      className="flex items-start w-full px-4 py-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 text-slate-700 text-sm font-normal cursor-pointer transition-all"
                      onClick={onSignOutClick}
                    >
                      <LogOutIcon className="w-5 h-5 mr-2" />
                      Sign out
                    </button>
                  </div>
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        ) : (
          <div className="hidden sm:block">
            <Button
              onClick={onSignInClick}
              className="focus:ring-offset-blue-900"
            >
              Sign in
            </Button>
          </div>
        )}

        <div className="-mr-2 flex sm:hidden">
          <button
            type="button"
            className="bg-gray-800 inline-flex items-center justify-center p-2 hover:bg-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 text-gray-400 hover:text-white transition-all"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => setOpen((isOpen) => !isOpen)}
          >
            <span className="sr-only">Open main menu</span>

            {isOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{links}</div>

          {myself ? (
            <div className="pt-4 pb-3 border-t border-slate-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={myself.avatarUrl}
                    alt={myself.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {myself.name}
                  </div>

                  <div className="mt-1 text-sm font-medium leading-none text-slate-400">
                    @{myself.username}
                  </div>
                </div>
              </div>

              <div className="mt-3 px-2 space-y-1">
                <button
                  className="px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 text-slate-400 text-base font-medium"
                  tabIndex={0}
                  onClick={onSignOutClick}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 pb-3 border-t border-slate-700">
              <div className="px-2 space-y-1">
                <div
                  className="px-3 sm:px-4 py-2 rounded-sm sm:rounded-none text-base sm:text-sm font-medium sm:font-normal text-gray-400 sm:text-gray-700 hover:text-white hover:bg-gray-700 cursor-pointer"
                  tabIndex={0}
                  onClick={onSignInClick}
                >
                  Sign in
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
};

export interface LayoutGlobalNavigationLinkProps
  extends Omit<LinkProps, "className" | "style"> {
  className?: string;
  style?: React.CSSProperties;
}

export const LayoutGlobalNavigationLink: React.VFC<
  LayoutGlobalNavigationLinkProps
> = ({ to, children, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname });

  return (
    <Link
      to={to}
      className={twMerge(
        "flex items-start w-full xl:max-w-5xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-900 rounded text-base font-medium transition-all",
        match
          ? "bg-slate-800 dark:bg-zinc-800 text-white"
          : "hover:bg-slate-800 dark:hover:bg-zinc-800 active:bg-slate-700 text-slate-300 hover:text-white"
      )}
      {...props}
      aria-current={match ? "page" : undefined}
    >
      {children}
    </Link>
  );
};

export interface LayoutHeaderProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LayoutHeader: React.VFC<LayoutHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <header
      className={twMerge(
        "flex-shrink-0 w-full pt-8 pb-24 px-4 sm:px-8 bg-slate-800 dark:bg-black",
        className
      )}
      {...props}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </header>
  );
};

export interface LayoutHeaderTitleProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LayoutHeaderTitle: React.VFC<LayoutHeaderTitleProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h1
      className={twMerge(
        "w-full text-3xl font-bold text-slate-50 dark:text-zinc-50",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export interface LayoutContentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LayoutContent: React.VFC<LayoutContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <main
      className={twMerge(
        "flex-grow -mt-20 sm:-mt-16 px-4 sm:px-8 pb-16",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-5xl mx-auto">{children}</div>
    </main>
  );
};

const DEFAULT_LINKS: LayoutGlobalNavigationProps["links"] = [
  <LayoutGlobalNavigationLink to="/" key="dashboard">
    Dashboard
  </LayoutGlobalNavigationLink>,
  // <HeadNavLink to="/game-sessions" key="past-sessions">
  //   Past Sessions
  // </HeadNavLink>,
];
