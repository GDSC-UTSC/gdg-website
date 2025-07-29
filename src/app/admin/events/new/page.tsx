"use client";

import { Event, EventType, QuestionType } from "@/app/types/events";
import QuestionBuilder from "@/components/positions/QuestionBuilder";
import {
  SelectInput,
  TextInput,
  TextareaInput,
} from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import TagsInput from "@/components/ui/tags-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  registrationDeadline: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "closed";
  tags: string[];
  link: string;
  questions: QuestionType[];
};

export default function AdminNewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    registrationDeadline: "",
    status: "upcoming",
    tags: [],
    link: "",
    questions: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventData: EventType = {
        id: "", // Will be set by Firebase
        title: formData.title,
        description: formData.description,
        eventDate: Timestamp.fromDate(new Date(formData.eventDate)),
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        location: formData.location || undefined,
        registrationDeadline: formData.registrationDeadline ? Timestamp.fromDate(new Date(formData.registrationDeadline)) : undefined,
        status: formData.status,
        tags: formData.tags,
        organizers: undefined,
        createdAt: Timestamp.now(), // Will be overridden by serverTimestamp
        updatedAt: Timestamp.now(), // Will be overridden by serverTimestamp
        imageUrls: undefined,
        link: formData.link || undefined,
        questions: formData.questions,
      };

      console.log(eventData);
      const event = new Event(eventData);

      await event.create();
      toast.success("Event created successfully!");
      router.push("/admin/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Create New Event</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add a new event to engage your community and grow your organization.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <TextInput
              id="title"
              label="Event Title"
              value={formData.title}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, title: value }))
              }
              placeholder="e.g., React Workshop"
              required
            />

            <TextareaInput
              id="description"
              label="Description"
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              placeholder="Describe the event, what attendees will learn, and any prerequisites..."
              required
              rows={8}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, eventDate: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, registrationDeadline: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                />
              </div>
            </div>

            <TextInput
              id="location"
              label="Location"
              value={formData.location}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, location: value }))
              }
              placeholder="e.g., University of Toronto Scarborough"
            />

            <TextInput
              id="link"
              label="Event Link"
              value={formData.link}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, link: value }))
              }
              placeholder="e.g., Zoom link or event website"
            />

            <TagsInput
              id="tags"
              label="Tags"
              value={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              placeholder="Type a tag and press Enter..."
            />

            <SelectInput
              id="status"
              label="Status"
              value={formData.status}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as "upcoming" | "ongoing" | "completed" | "cancelled" | "closed",
                }))
              }
              options={[
                { value: "upcoming", label: "Upcoming" },
                { value: "ongoing", label: "Ongoing" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "closed", label: "Closed" },
              ]}
            />

            <QuestionBuilder
              questions={formData.questions}
              onChange={(questions) =>
                setFormData((prev) => ({ ...prev, questions }))
              }
            />

            <div className="flex gap-4 pt-8 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/events")}
                disabled={isSubmitting}
                className="px-8 py-3 text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 text-base"
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}