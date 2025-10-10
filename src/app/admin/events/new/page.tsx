"use client";

import { Event, EVENTSTATUS, EventStatusType, EventType, QuestionType } from "@/app/types/events";
import { UserData } from "@/app/types/userdata";
import UserSearch from "@/components/admin/UserSearch";
import QuestionBuilder from "@/components/positions/QuestionBuilder";
import { SelectInput, TextInput, TextareaInput } from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TagsInput from "@/components/ui/tags-input";
import { Timestamp } from "firebase/firestore";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  title: string;
  description: string;
  eventDate: Date | undefined;
  startTime: string;
  endTime: string;
  location: string;
  registrationDeadline: Date | undefined;
  status: EventStatusType;
  tags: string[];
  link: string;
  questions: QuestionType[];
  imageUrls: string[];
  organizers: UserData[];
};

export default function AdminNewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    eventDate: undefined,
    startTime: "",
    endTime: "",
    location: "",
    registrationDeadline: undefined,
    status: "default",
    tags: [],
    link: "",
    questions: [],
    imageUrls: [],
    organizers: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.eventDate) {
        toast.error("Event date is required");
        return;
      }

      const eventData: EventType = {
        id: "",
        title: formData.title,
        description: formData.description,
        eventDate: Timestamp.fromDate(new Date(formData.eventDate + 'T00:00:00')),
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        location: formData.location || undefined,
        registrationDeadline: formData.registrationDeadline
          ? Timestamp.fromDate(new Date(formData.registrationDeadline + 'T00:00:00'))
          : undefined,
        tags: formData.tags,
        organizers: formData.organizers.map(user => user.id),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        imageUrls: formData.imageUrls,
        link: formData.link,
        questions: formData.questions,
        status: formData.status,
      };

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
              onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
              placeholder="e.g., React Workshop"
              required
            />

            <TextareaInput
              id="description"
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Describe the event, what attendees will learn, and any prerequisites..."
              required
              rows={8}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <DatePicker
                  date={formData.eventDate}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, eventDate: date }))}
                  placeholder="Select event date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <DatePicker
                  date={formData.registrationDeadline}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, registrationDeadline: date }))}
                  placeholder="Select deadline (optional)"
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <TextInput
              id="location"
              label="Location"
              value={formData.location}
              onChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
              placeholder="e.g., University of Toronto Scarborough"
            />

            <TextInput
              id="link"
              label="Event Link"
              value={formData.link}
              onChange={(value) => setFormData((prev) => ({ ...prev, link: value }))}
              placeholder="e.g., Zoom link or event website"
            />

            <TagsInput
              id="tags"
              label="Tags"
              value={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              placeholder="Type a tag and press Enter..."
            />

            <div className="space-y-4">
              <Label>Event Organizers</Label>
              <div className="space-y-3">
                {formData.organizers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Selected organizers:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.organizers.map((organizer) => (
                        <div
                          key={organizer.id}
                          className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                        >
                          <span>{organizer.publicName || "Unknown User"}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                organizers: prev.organizers.filter((u) => u.id !== organizer.id),
                              }));
                            }}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <UserSearch
                  placeholder="Search for organizers..."
                  onUserSelect={(user) => {
                    if (!formData.organizers.find((org) => org.id === user.id)) {
                      setFormData((prev) => ({
                        ...prev,
                        organizers: [...prev.organizers, user],
                      }));
                    }
                  }}
                />
              </div>
            </div>

            <SelectInput
              id="status"
              label="Status"
              value={formData.status}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as EventStatusType
                }))
              }
              options={[...EVENTSTATUS].map((status) => ({
                value: status,
                label: status.charAt(0).toUpperCase() + status.slice(1),
              }))}
            />

            <QuestionBuilder
              questions={formData.questions}
              onChange={(questions) => setFormData((prev) => ({ ...prev, questions }))}
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
              <Button type="submit" disabled={isSubmitting} className="px-8 py-3 text-base">
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
