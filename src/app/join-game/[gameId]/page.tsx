"use client";

import { useParams } from "next/navigation";
import { Input } from "~/components/ui/input";

import { api } from "~/trpc/react";

export default function JoinGame() {
  const params = useParams();
  const gameId = params?.gameId?.toString() ?? "";

  const gameStatus = api.game.status.useQuery({ gameId });

  return (
    <div className="w-full max-w-xs">
      <p>`You are joining game with name: {gameStatus.data?.game.name}</p>
      <p>Enter your name</p>
      <Input type="text" placeholder="e.g., John Doe" />
    </div>
  );
}
