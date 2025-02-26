import React, { ReactNode } from "react";
import Header from "./Header";
import { Checkbox } from "./../ui/checkbox";
import { Dialog } from "./../ui/dialog";
import { DialogTrigger } from "./../ui/dialog";
import { Button } from "./../ui/button";
import { DialogContent } from "./../ui/dialog";
import { DialogHeader } from "./../ui/dialog";
import { DialogTitle } from "./../ui/dialog";
import { DialogDescription } from "./../ui/dialog";
import { Label } from "./../ui/label";
import { Input } from "./../ui/input";
import { DialogFooter } from "./../ui/dialog";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

export default function Layout({ children, isAuthenticated }: LayoutProps) {
  // Prevent XSS in child content
  const sanitizedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child);
    }
    return null;
  });
  return (
    <div className="min-h-screen flex flex-col bg-[#0d73d9]">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-grow bg-[url('https://storage.googleapis.com/tempo-public-images/github%7C199463069-1739948339602-1737649515154webp')] bg-[#771212] shrink-0 grow-0">
        {sanitizedChildren}
      </main>
      <Footer className="bg-[#537ea9]" />
    </div>
  );
}
