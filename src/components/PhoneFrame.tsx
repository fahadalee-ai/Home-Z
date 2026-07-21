import type { ReactNode } from "react";

/** Mobile-first container — centers the app on larger screens like a device frame. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen w-full">
      <div className={`mx-auto min-h-screen w-full max-w-[440px] ${className}`}>
        {children}
      </div>
    </div>
  );
}
