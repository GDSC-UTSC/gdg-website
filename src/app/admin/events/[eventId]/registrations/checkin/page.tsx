"use client";
import { Registration } from "@/app/types/events/registrations";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { use, useState } from "react";

interface AdminRegistrationsCheckinPageProps {
  params: Promise<{ eventId: string }>;
}

export default function AdminRegistrationsCheckinPage({ params }: AdminRegistrationsCheckinPageProps) {
  const { eventId } = use(params);
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [scannedUser, setScannedUser] = useState<{ name: string; email: string; alreadyCheckedIn: boolean } | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [scanningDisabled, setScanningDisabled] = useState(false);

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length === 0 || scanningDisabled) return;

    const scannedUID = detectedCodes[0].rawValue;
    console.log("Scanned UID:", scannedUID);

    try {
      setScanningDisabled(true); // Disable scanning to prevent multiple scans
      setScanStatus("loading");
      setErrorMessage("");

      // Look up registration in Firestore
      const registration = await Registration.read(eventId, scannedUID);

      if (!registration) {
        setErrorMessage(`No registration found for user: ${scannedUID}`);
        setScanStatus("error");
        setTimeout(() => {
          setScanStatus("idle");
          setScanningDisabled(false); // Re-enable scanning
        }, 3000);
        return;
      }

      // Check if user is registered (not cancelled)
      if (registration.status === "cancelled") {
        setErrorMessage(`Registration cancelled for: ${registration.name}`);
        setScanStatus("error");
        setTimeout(() => {
          setScanStatus("idle");
          setScanningDisabled(false); // Re-enable scanning
        }, 3000);
        return;
      }

      // Check if already checked in
      if (registration.checkIn) {
        setScannedUser({
          name: registration.name,
          email: registration.email,
          alreadyCheckedIn: true,
        });
        setScanStatus("success");
        setTimeout(() => {
          setScanStatus("idle");
          setScannedUser(null);
          setScanningDisabled(false); // Re-enable scanning
        }, 3000);
        return;
      }

      // Check in the user
      registration.checkIn = true;
      registration.checkInTime = serverTimestamp() as Timestamp;
      await registration.update(eventId);

      setScannedUser({
        name: registration.name,
        email: registration.email,
        alreadyCheckedIn: false,
      });
      setScanStatus("success");

      // Reset after 3 seconds
      setTimeout(() => {
        setScanStatus("idle");
        setScannedUser(null);
        setScanningDisabled(false); // Re-enable scanning
      }, 3000);
    } catch (error) {
      console.error("Error during check-in:", error);
      setErrorMessage("Failed to process check-in. Please try again.");
      setScanStatus("error");
      setTimeout(() => {
        setScanStatus("idle");
        setScanningDisabled(false); // Re-enable scanning
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Top section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Check-in</h1>
        <div className="w-16 h-1 bg-white mx-auto rounded-full"></div>
      </div>

      {/* Scanner section */}
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Outer frame */}
          <div className="w-full aspect-square border-4 border-white/40 rounded-3xl p-4">
            {/* Inner scanner */}
            <div
              className={`w-full h-full border-2 rounded-2xl overflow-hidden transition-colors duration-300 ${
                scanStatus === "success"
                  ? "border-green-400"
                  : scanStatus === "error"
                  ? "border-red-400"
                  : scanStatus === "loading"
                  ? "border-yellow-400"
                  : "border-white/60"
              }`}
            >
              <Scanner onScan={handleScan} onError={(error) => console.error(error)} />
            </div>
          </div>

          {/* Scanning line animation */}
          <div className="absolute inset-4 pointer-events-none">
            <div
              className={`w-full h-0.5 animate-pulse ${
                scanStatus === "success"
                  ? "bg-green-400"
                  : scanStatus === "error"
                  ? "bg-red-400"
                  : scanStatus === "loading"
                  ? "bg-yellow-400"
                  : "bg-white/80"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Status feedback */}
      {scanStatus !== "idle" && (
        <div className="mt-8 text-center">
          <div
            className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${
              scanStatus === "success"
                ? "bg-green-500/20 border-green-400 text-green-100"
                : scanStatus === "error"
                ? "bg-red-500/20 border-red-400 text-red-100"
                : "bg-yellow-500/20 border-yellow-400 text-yellow-100"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                scanStatus === "success" ? "bg-green-400" : scanStatus === "error" ? "bg-red-400" : "bg-yellow-400"
              }`}
            >
              {scanStatus === "success" ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : scanStatus === "error" ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </div>
            <div>
              <p className="font-semibold">
                {scanStatus === "success"
                  ? scannedUser?.alreadyCheckedIn
                    ? "Already Checked In!"
                    : "Check-in Successful!"
                  : scanStatus === "error"
                  ? "Check-in Failed"
                  : "Processing..."}
              </p>
              {scanStatus === "success" && scannedUser && (
                <div className="text-sm opacity-80 mt-1">
                  <p className="font-medium">{scannedUser.name}</p>
                  <p>{scannedUser.email}</p>
                </div>
              )}
              {scanStatus === "error" && errorMessage && <p className="text-sm opacity-80 mt-1">{errorMessage}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
