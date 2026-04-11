import type { ReactNode } from 'react';

type HomeShellProps = {
  children: ReactNode;
};

export function HomeShell({ children }: HomeShellProps) {
  return (
    <div className="relative overflow-hidden bg-[#120907] text-[#f7ede4] selection:bg-[#a86f4d] selection:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(129,64,35,0.20),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(190,129,85,0.10),transparent_22%)]" />
      {children}
    </div>
  );
}
