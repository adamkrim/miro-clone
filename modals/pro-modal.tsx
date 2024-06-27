"use client";

import { useProModal } from "@/store/use-pro-modal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ProModal = () => {
  const { isOpen, onOpen, onClose } = useProModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pro modal</DialogTitle>
          <DialogDescription>This is a pro modal</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
