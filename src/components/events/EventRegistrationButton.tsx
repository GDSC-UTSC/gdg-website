"use client";

import { Event } from "@/app/types/events";
import { EventRegistration } from "@/app/types/registrations";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Loader2, UserPlus, UserX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EventRegistrationButtonProps {
  event: Event;
  onRegistrationChange?: () => void;
}

export default function EventRegistrationButton({
  event,
  onRegistrationChange,
}: EventRegistrationButtonProps) {
  const { user } = useAuth();
  const [registrationStatus, setRegistrationStatus] = useState<'none' | 'registered' | 'waitlisted'>('none');
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkRegistrationStatus();
  }, [event.id, user]);

  const checkRegistrationStatus = async () => {
    if (!user) {
      setCheckingStatus(false);
      return;
    }

    try {
      setCheckingStatus(true);
      const registration = await event.getUserRegistration(user.uid);
      
      if (!registration) {
        setRegistrationStatus('none');
        setWaitlistPosition(null);
      } else if (registration.isActive) {
        setRegistrationStatus('registered');
        setWaitlistPosition(null);
      } else if (registration.isWaitlisted) {
        setRegistrationStatus('waitlisted');
        const position = await EventRegistration.getWaitlistPosition(event.id, user.uid);
        setWaitlistPosition(position);
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleRegister = async () => {
    if (!user || !event.isRegistrationOpen) return;

    setLoading(true);
    try {
      const { registration, waitlistPosition } = await event.registerUser(user.uid);
      
      if (registration.isWaitlisted) {
        setRegistrationStatus('waitlisted');
        setWaitlistPosition(waitlistPosition || null);
        toast.success(`Added to waitlist (position ${waitlistPosition})`);
      } else {
        setRegistrationStatus('registered');
        setWaitlistPosition(null);
        toast.success("Successfully registered for the event!");
      }
      
      onRegistrationChange?.();
    } catch (error: any) {
      console.error("Error registering for event:", error);
      toast.error(error.message || "Failed to register for the event");
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await event.unregisterUser(user.uid);
      setRegistrationStatus('none');
      setWaitlistPosition(null);
      toast.success("Successfully unregistered from the event");
      onRegistrationChange?.();
    } catch (error: any) {
      console.error("Error unregistering from event:", error);
      toast.error(error.message || "Failed to unregister from the event");
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated
  if (!user) {
    if (!event.isRegistrationOpen) {
      return (
        <Button variant="outline" disabled>
          Registration Closed
        </Button>
      );
    }

    return (
      <Link href="/account/login">
        <Button variant="outline">
          <UserPlus size={16} className="mr-2" />
          Sign In to Register
        </Button>
      </Link>
    );
  }

  // If still checking registration status
  if (checkingStatus) {
    return (
      <Button disabled>
        <Loader2 size={16} className="mr-2 animate-spin" />
        Checking Status...
      </Button>
    );
  }

  // If registration is not open
  if (!event.isRegistrationOpen) {
    if (registrationStatus === 'registered') {
      return (
        <Button variant="outline" disabled>
          <CheckCircle size={16} className="mr-2" />
          Registered (Closed)
        </Button>
      );
    }
    if (registrationStatus === 'waitlisted') {
      return (
        <Button variant="outline" disabled>
          <CheckCircle size={16} className="mr-2" />
          Waitlisted #{waitlistPosition} (Closed)
        </Button>
      );
    }

    return (
      <Button variant="outline" disabled>
        Registration Closed
      </Button>
    );
  }

  // If user is registered
  if (registrationStatus === 'registered') {
    return (
      <div className="flex gap-2">
        <Button variant="outline" disabled>
          <CheckCircle size={16} className="mr-2" />
          Registered
        </Button>
        <Button
          variant="destructive"
          onClick={handleUnregister}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Unregistering...
            </>
          ) : (
            <>
              <UserX size={16} className="mr-2" />
              Unregister
            </>
          )}
        </Button>
      </div>
    );
  }

  // If user is waitlisted
  if (registrationStatus === 'waitlisted') {
    return (
      <div className="flex gap-2">
        <Button variant="outline" disabled>
          <CheckCircle size={16} className="mr-2" />
          Waitlisted #{waitlistPosition}
        </Button>
        <Button
          variant="destructive"
          onClick={handleUnregister}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Leaving...
            </>
          ) : (
            <>
              <UserX size={16} className="mr-2" />
              Leave Waitlist
            </>
          )}
        </Button>
      </div>
    );
  }

  // If user can register
  return (
    <Button onClick={handleRegister} disabled={loading}>
      {loading ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Registering...
        </>
      ) : (
        <>
          <UserPlus size={16} className="mr-2" />
          Register
        </>
      )}
    </Button>
  );
}