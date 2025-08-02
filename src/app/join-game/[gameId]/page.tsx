"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function JoinGame() {
  const params = useParams();
  const gameId = params?.gameId;

  return <div className="w-full max-w-xs"></div>;
}
