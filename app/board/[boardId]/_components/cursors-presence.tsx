"use client";

import { memo } from "react";
import { useOthersConnectionIds } from "@liveblocks/react/suspense";

import { Cursor } from "./cursor";

interface CursorsPresenceProps {}

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((id) => (
        <Cursor key={id} connectionId={id} />
      ))}
    </>
  );
};

export const CursorsPresence = memo((props: CursorsPresenceProps) => {
  return (
    <>
      {/* Draft pencil */}
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";
