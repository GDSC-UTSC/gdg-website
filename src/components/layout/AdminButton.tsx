"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { forwardRef } from "react";

export const AdminButton = () => {
  const { isAdmin, loading } = useAuth();

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Link href="/admin">
      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-5 h-9">
        Admin
      </Button>
    </Link>
  );
};

export const AdminButtonMobile = forwardRef<HTMLAnchorElement>((props, ref) => {
  const { isAdmin, loading } = useAuth();

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Link href="/admin" className="w-full" ref={ref} {...props}>
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base h-12">
        Admin
      </Button>
    </Link>
  );
});

AdminButtonMobile.displayName = "AdminButtonMobile";
