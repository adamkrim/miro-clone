"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";

export const EmptyBoards = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate: createBoard, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    if (!organization) return;

    createBoard({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((boardId) => {
        toast.success("Board created");
        router.push(`/board/${boardId}`);
      })
      .catch((err) => {
        toast.error("Failed to create board");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/note.svg" alt="Empty" height={110} width={110} />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={onClick} size="lg">
          Create board
        </Button>
      </div>
    </div>
  );
};
