"use client";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export default function CheckinPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");

  const handleScan = (codes: IDetectedBarcode[]) => {
    if (codes.length > 0) {
      const code = codes[0];
      const codeValue = code.rawValue;

      // TODO: rewrite this so basically checks firebase instead of using lastscanned code
      // check if UID has been scanned or not.
      if (codeValue !== lastScannedCode) {
        console.log("Detected code:", codeValue);
        setLastScannedCode(codeValue);

        // TODO: add the rest of the backend logic here (updating the registration status)
      }
    }
  };

  const handleError = (error: unknown) => {
    console.error(error);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen  text-white">
      <h1 className="mb-6 text-2xl font-semibold">QR Code Scanner</h1>

      <div className="relative w-[350px] h-[450px] rounded-xl overflow-hidden shadow-lg ring-2 ring-indigo-500">
        <Scanner onScan={handleScan} onError={handleError} />
      </div>

      <p className="mt-4 text-sm text-gray-400">Align the QR code within the frame to scan.</p>
    </div>
  );
}
