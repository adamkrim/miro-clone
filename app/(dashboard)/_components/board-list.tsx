"use client";

import { EmptyBoards } from "./empty-boards";
import { EmptyFavorties } from "./empty-favorites";
import { EmptySearch } from "./empty-search";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = []; // TODO: Call API to fetch boards

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorties />;
  }

  if (!data?.length) {
    return <EmptyBoards />;
  }

  return <div>{JSON.stringify(query)}</div>;
};
