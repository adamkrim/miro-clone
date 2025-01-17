import Image from "next/image";

export const EmptyFavorties = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image src="/empty-favorites.svg" alt="Empty" height={140} width={140} />
      <h2 className="mt-6 text-2xl font-semibold">No favorites boards!</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try favoriting a board
      </p>
    </div>
  );
};
