"use client";

import { useEffect, useState } from "react";

import { ProModal } from "@/modals/pro-modal";
import { RenameModal } from "@/modals/rename-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <RenameModal />
      <ProModal />
    </>
  );
};
