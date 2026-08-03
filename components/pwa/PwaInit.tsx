"use client";

import { PwaRegister } from "./PwaRegister";
import { PwaInstallPrompt } from "./PwaInstallPrompt";
import { OfflineIndicator } from "./OfflineIndicator";

export function PwaInit() {
  return (
    <>
      <PwaRegister />
      <PwaInstallPrompt />
      <OfflineIndicator />
    </>
  );
}
