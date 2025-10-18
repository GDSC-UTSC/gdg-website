"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export function FieldResponsive() {
  const [subject, setSubject] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Hello, world!",
      }),
    ],
    content: "",
    immediatelyRender: false,
  });

  const handleClear = () => {
    editor?.commands.clearContent();
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const message = editor?.getHTML() || "";
    console.log("Sending email:", { subject, message });
    handleClear();
  };

  // ✅ Prevent render until client-side
  if (!isMounted) return null;

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSend}>
        <FieldSet>
          <FieldLegend>Send email to attendees</FieldLegend>
          <FieldDescription>
            Fill in the contents of the email.
          </FieldDescription>
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

            {/* Message Editor */}
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel>Message</FieldLabel>
                <FieldDescription>
                  Write your email for attendees. The GDG Banner will automatically be applied.
                </FieldDescription>
              </FieldContent>

            <EditorContent
              editor={editor}
              className="
                border rounded-md sm:min-w-[400px] p-2 h-64 w-full flex flex-col
                [&_.ProseMirror]:flex-1 [&_.ProseMirror]:min-h-0 [&_.ProseMirror]:h-full
                [&_.ProseMirror]:m-0 [&_.ProseMirror]:overflow-auto
                [&_.ProseMirror]:outline-none
              "
            />
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <Button type="submit">Send to attendees</Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
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
