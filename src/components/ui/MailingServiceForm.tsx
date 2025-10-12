'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function FieldResponsive() {
  // State for the textarea content
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleClear = () => {
    setMessage(""); // Reset the textarea
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement actual sending logic
    console.log("Sending email:", { subject, message });
    handleClear();
  };

  return (
    <div className="w-full max-w-4xl">
      <form>
        <FieldSet>
          <FieldLegend>Send email to attendees</FieldLegend>
          <FieldDescription>Fill in the contents of the email.</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            {/* Subject Input */}
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <FieldDescription>
                  Write a short, descriptive subject for your email.
                </FieldDescription>
              </FieldContent>
              <Input
                id="subject"
                placeholder="Event Reminder"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="sm:min-w-[400px]"
              />
            </Field>
          <FieldSeparator />
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <FieldDescription>
                  Write your email you want to send to all attendees. The GDG Banner will automatically be applied.
                </FieldDescription>
              </FieldContent>
              <Textarea
                id="message"
                placeholder="Hello, world!"
                required
                rows={4}
                className="min-h-[200px] sm:min-w-[400px]"
                value={message}             // Controlled value
                onChange={(e) => setMessage(e.target.value)} // Update state
              />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <Button type="submit">Send to attendees</Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}       // Reset on click
              >
                Clear
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
