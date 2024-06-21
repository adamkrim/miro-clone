import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <div>This is a screen for authenticated users.</div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}
