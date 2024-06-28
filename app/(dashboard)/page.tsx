"use client";

import { useSearchParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { BoardList } from "./_components/board-list";
import { EmptyOrg } from "./_components/empty-org";

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

const DashboardPage = () => {
  const { organization } = useOrganization();
  const searchParams = useSearchParams();
  const query = {
    search: searchParams.get("search") || undefined,
    favorites: searchParams.get("favorites") || undefined,
  };

  return (
    <div className="h-[calc(100%-80px)] flex-1 p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={query} />
      )}
    </div>
  );
};

export default DashboardPage;
