"use client";

import { QRCodeSVG } from "qrcode.react";
import { api } from "~/trpc/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";

const QRCodeSection = () => {
  const { data, isLoading, error } = api.game.new.useQuery();
  const gameId = data?.id ?? "";
  const qrValue = gameId ? `${baseUrl}/game/${gameId}` : "";

  if (isLoading) return <div>Loading QR Code...</div>;
  if (error || !data?.id) return <div>Failed to load QR Code.</div>;

  return <QRCodeSVG value={qrValue} size={180} />;
};

export default function Results() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-xs">
        <QRCodeSection />
      </div>
    </div>
  );
}
