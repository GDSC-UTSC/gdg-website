"use client";

import { Event, EVENTSTATUS, EventStatusType, QuestionType } from "@/app/types/events";
import { UserData } from "@/app/types/userdata";
import { ImageUpload } from "@/components/admin/ImageUpload";
import UserSearch from "@/components/admin/UserSearch";
import QuestionBuilder from "@/components/positions/QuestionBuilder";import { SelectInput, TextareaInput, TextInput } from "@/components/positions/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TagsInput from "@/components/ui/tags-input";
import { Timestamp } from "firebase/firestore";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminEditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function AdminEditEventPage({ params }: AdminEditEventPageProps) {
  const router = useRouter();
  const { eventId } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    registrationDeadline: "",
    status: "default" as EventStatusType,
    tags: [] as string[],
    link: "",
    questions: [] as QuestionType[],
    organizers: [] as UserData[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await Event.read(eventId);
        if (fetchedEvent) {
          setEvent(fetchedEvent);

          // Load organizer user data
          const organizerPromises = fetchedEvent.organizers?.map((organizerId) => UserData.read(organizerId)) || [];
          const organizers = await Promise.all(organizerPromises);
          const validOrganizers = organizers.filter((org) => org !== null) as UserData[];

          setFormData({
            title: fetchedEvent.title,
            description: fetchedEvent.description,
            eventDate: fetchedEvent.eventDate?.toDate().toISOString().split("T")[0] || "",
            startTime: fetchedEvent.startTime || "",
            endTime: fetchedEvent.endTime || "",
            location: fetchedEvent.location || "",
            registrationDeadline: fetchedEvent.registrationDeadline?.toDate().toISOString().split("T")[0] || "",
            status: fetchedEvent.status,
            tags: fetchedEvent.tags || [],
            link: fetchedEvent.link || "",
            questions: fetchedEvent.questions || [],
            organizers: validOrganizers,
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newErrors: Record<string, string> = {};

      if (!formData.title.trim()) {
        newErrors.title = "Event title is required";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Event description is required";
      }

      if (!formData.eventDate) {
        newErrors.eventDate = "Event date is required";
      }

      if (!formData.registrationDeadline) {
        newErrors.registrationDeadline = "Registration deadline is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error(Object.values(newErrors).join(", \n"));
        setIsSubmitting(false);
        return;
      }

      if (!event) {
        toast.error("Event not found");
        setIsSubmitting(false);
        return;
      }
      const updatedEvent = new Event({
        ...event,
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventDate: Timestamp.fromDate(new Date(formData.eventDate + 'T00:00:00')),
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        registrationDeadline: formData.registrationDeadline
          ? Timestamp.fromDate(new Date(formData.registrationDeadline + 'T00:00:00'))
          : undefined,
        status: formData.status,
        tags: formData.tags,
        link: formData.link,
        questions: formData.questions,
        organizers: formData.organizers.map((user) => user.id),
      });

      await updatedEvent.update();
      toast.success("Event updated successfully");
      router.push("/admin/events");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading event...</p>
            <p className="text-muted-foreground">Please make sure you are on a supported browser (not linkedin or instagram browser)</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/admin/events")}>Back to Admin Events</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Edit Event</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Update the event details and registration questions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-8">
            <ImageUpload
              storagePath={`events/${eventId}`}
              firestorePath={`events/${eventId}`}
              onUploadComplete={(urls) => {}}
            />

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <TextInput
                  id="title"
                  label="Event Title"
                  value={formData.title}
                  onChange={(value) => handleInputChange("title", value)}
                  placeholder="Enter event title"
                  required
                />

                <TextareaInput
                  id="description"
                  label="Description"
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Enter event description"
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
                      onChange={(e) => handleInputChange("eventDate", e.target.value)}
                      className={errors.eventDate ? "border-red-500" : ""}
                    />
                    {errors.eventDate && <p className="text-red-500 text-sm">{errors.eventDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                    <Input
                      id="registrationDeadline"
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
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
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                    />
                  </div>
                </div>

                <TextInput
                  id="location"
                  label="Location"
                  value={formData.location}
                  onChange={(value) => handleInputChange("location", value)}
                  placeholder="Enter event location"
                />

                <TextInput
                  id="link"
                  label="Event Link"
                  value={formData.link}
                  onChange={(value) => handleInputChange("link", value)}
                  placeholder="Enter event link (optional)"
                />

                <TagsInput
                  id="tags"
                  label="Tags"
                  value={formData.tags}
                  onChange={(tags: string[]) => handleInputChange("tags", tags)}
                  placeholder="Type a tag and press Enter..."
                />

                <div className="space-y-4">
                  <Label>Event Organizers</Label>
                  <div className="space-y-3">
                    {formData.organizers.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Selected organizers:</div>
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
                                  handleInputChange(
                                    "organizers",
                                    formData.organizers.filter((u) => u.id !== organizer.id)
                                  );
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
                          handleInputChange("organizers", [...formData.organizers, user]);
                        }
                      }}
                    />
                  </div>
                </div>

                <SelectInput
                  id="status"
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleInputChange("status", value)}
                  options={[...EVENTSTATUS].map((status) => ({
                    value: status,
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                  }))}
                />

                <QuestionBuilder
                  questions={formData.questions}
                  onChange={(questions) => handleInputChange("questions", questions)}
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
                    {isSubmitting ? "Updating..." : "Update Event"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
