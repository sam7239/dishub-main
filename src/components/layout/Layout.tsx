import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

export default function Layout({ children, isAuthenticated }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
