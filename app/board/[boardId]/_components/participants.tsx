"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";

import { connectionIdToColor } from "@/lib/utils";

import { UserAvatar } from "./user-avatar";

const MAX_SHOWN_OTHERS = 2;

export const Participants = () => {
  const others = useOthers();
  const self = useSelf();
  const hasMoreOthers = others.length > MAX_SHOWN_OTHERS;

  return (
    <div className="absolute right-2 top-2 flex h-12 items-center rounded-md bg-white p-3 shadow-md">
      <div className="flex gap-x-2">
        <UserAvatar
          src={self.info.picture}
          name={`${self.info.name} (You)`}
          fallback={self.info.name[0]}
          borderColor={connectionIdToColor(self.connectionId)}
        />
        {others.slice(0, MAX_SHOWN_OTHERS).map(({ connectionId, info }) => (
          <UserAvatar
            key={connectionId}
            src={info.picture}
            name={info.name}
            fallback={info.name[0] || "T"}
            borderColor={connectionIdToColor(connectionId)}
          />
        ))}
        {hasMoreOthers && (
          <UserAvatar
            name={`${others.length - MAX_SHOWN_OTHERS} more`}
            fallback={`+${others.length - MAX_SHOWN_OTHERS}`}
          />
        )}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute right-2 top-2 flex h-12 w-[100px] items-center rounded-md bg-white p-3 shadow-md" />
  );
};
