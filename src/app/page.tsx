import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

import { Button } from "~/components/ui/button";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  //
  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1 className="text-3xl">Mad Vids (Quiplash)</h1>

        <Link href="/create-game">
          <Button className="mt-6">Create Game</Button>
        </Link>
      </main>
    </HydrateClient>
  );
}
