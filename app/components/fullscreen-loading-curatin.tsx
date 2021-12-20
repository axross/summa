import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface FullscreenLoadingCurtainProps {
  hidden?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const FullscreenLoadingCurtain: React.VFC<
  FullscreenLoadingCurtainProps
> = ({ hidden = false, className, ...props }) => {
  return (
    <div
      className={twMerge(
        "fixed left-0 top-0 flex flex-col items-center justify-center w-screen h-screen bg-white transition-all duration-300 ease-in-out",
        hidden ? "opacity-0 invisible" : "opacity-100 visible",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>

      <div className="mt-2 font-medium text-gray-700">Authenticating...</div>
    </div>
  );
};
