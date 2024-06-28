"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useAction } from "convex/react";

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

  const pay = useAction(api.stripe.pay);

  const { organization } = useOrganization();

  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!organization?.id) {
      return;
    }

    setPending(true);

    try {
      const redirectUrl = await pay({ orgId: organization.id });
      window.location.href = redirectUrl;
    } finally {
      setPending(false);
    }
  };

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
          <Button
            onClick={onClick}
            disabled={pending}
            size="sm"
            className="w-full"
          >
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
