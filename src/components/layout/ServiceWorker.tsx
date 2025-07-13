"use client";

import type React from "react";
import { useEffect } from "react";

interface ServiceWorkerProps {
  children: React.ReactNode;
}

const ServiceWorker = ({ children }: ServiceWorkerProps) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/worker.js", {
        scope: "/",
      });
    }
  }, []);

  return <>{children}</>;
};

export default ServiceWorker;
