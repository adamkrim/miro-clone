"use client";

import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/use-rename-modal";
import { Button } from "@/components/ui/button";
import { Actions } from "@/components/actions";
import { Hint } from "@/components/hint";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="px-1.5 text-neutral-300">|</div>;
};

interface InfoProps {
  boardId: string;
}

export const Info = ({ boardId }: InfoProps) => {
  const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });
  const { onOpen } = useRenameModal();

  if (!data) return <InfoSkeleton />;

  return (
    <div className="absolute left-2 top-2 flex h-12 items-center rounded-md bg-white px-1.5 shadow-md">
      <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button variant="board" className="px-2" asChild>
          <Link href="/">
            <Image src="/logo.svg" alt="Miro logo" height={40} width={40} />
            <span
              className={cn(
                "ml-2 text-xl font-semibold text-black",
                font.className
              )}
            >
              Miro
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          onClick={() => onOpen(data._id, data.title)}
          variant="board"
          className="px-2 text-base font-normal"
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions
        boardId={boardId}
        title={data.title}
        side="bottom"
        sideOffset={10}
      >
        <div>
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board">
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute left-2 top-2 flex h-12 w-[300px] animate-pulse items-center rounded-md bg-white px-1.5 shadow-md" />
  );
};
