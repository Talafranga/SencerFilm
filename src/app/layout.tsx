import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Root layout - just pass through children
export default function RootLayout({ children }: Props) {
  return children;
}
