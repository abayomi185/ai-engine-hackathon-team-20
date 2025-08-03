"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";

const QRCodeSection = ({
  data,
  isLoading,
  error,
}: {
  data?: { id?: string };
  isLoading: boolean;
  error: unknown;
}) => {
  const gameId = data?.id ?? "";
  const qrValue = gameId ? `${baseUrl}/join-game/${gameId}` : "";

  if (isLoading)
    return <div className="py-8 text-center">Loading QR Code...</div>;
  if (error || !data?.id)
    return (
      <div className="py-8 text-center text-red-500">
        Failed to load QR Code.
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      <QRCodeSVG value={qrValue} size={180} />
      <div className="text-center text-sm break-all">
        {qrValue.split("/").pop()}
      </div>
      <Button asChild className="mt-2">
        <Link href={qrValue} target="_blank" rel="noopener noreferrer">
          Open Join Link
        </Link>
      </Button>
    </div>
  );
};

export default function CreateGamePage() {
  const { data, isLoading, error } = api.game.new.useQuery();

  const gameId = data?.id ?? "";
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Game Created!</h1>
        <p className="mb-6 text-center text-gray-300">
          Share this QR code or link with your friends to join your game.
        </p>
        <QRCodeSection data={data} isLoading={isLoading} error={error} />
        <Button asChild className="mx-auto mt-8 cursor-pointer">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild className="mx-auto mt-8 cursor-pointer">
          <Link href={`/results/${gameId}`}>Go to Results</Link>
        </Button>
      </div>
    </main>
  );
}
