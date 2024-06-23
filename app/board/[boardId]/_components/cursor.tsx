"use client";

import { memo } from "react";
import { useOther } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";

import { connectionIdToColor } from "@/lib/utils";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }

  const name = info?.name || "Teammate";
  const userColor = connectionIdToColor(connectionId);

  const { x, y } = cursor;

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      height={50}
      width={name.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: userColor,
          color: userColor,
        }}
      />
      <div
        className="absolute left-5 rounded-md px-1.5 py-0.5 text-xs font-semibold text-white"
        style={{ backgroundColor: userColor }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
