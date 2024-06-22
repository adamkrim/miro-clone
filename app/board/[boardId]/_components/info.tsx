import { Skeleton } from "@/components/ui/skeleton";

export const Info = () => {
  return (
    <div className="absolute left-2 top-2 flex h-12 items-center rounded-md bg-white px-1.5 shadow-md">
      Information about the board
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute left-2 top-2 flex h-12 w-[300px] animate-pulse items-center rounded-md bg-white px-1.5 shadow-md" />
  );
};
