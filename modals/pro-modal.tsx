"use client";

import { Poppins } from "next/font/google";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useProModal } from "@/store/use-pro-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProModal = () => {
  const { isOpen, onOpen, onClose } = useProModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🚀 Upgrade to pro</DialogTitle>
          <DialogDescription>
            Unlock all the features and take your productivity to the next level
          </DialogDescription>
          <Image src="/pro.svg" alt="Pro" height={200} width={200} />
        </DialogHeader>
        <DialogFooter>
          <Button size="sm" className="w-full">
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
