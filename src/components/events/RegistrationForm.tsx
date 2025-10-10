import { Event } from "@/app/types/events";
import { Registration } from "@/app/types/events/registrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Link, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RegistrationFormProps {
  event: Event;
}

export default function RegistrationForm({ event }: RegistrationFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [registrantName, setRegistrantName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<Registration | null>(null);
  const [loadingRegistration, setLoadingRegistration] = useState(false);

  // Fetch existing registration when user/event changes
  useEffect(() => {
    const fetchExistingRegistration = async () => {
      if (!user || !event) return;

      setLoadingRegistration(true);
      try {
        const registration = await Registration.read(event.id, user.uid);
        if (registration) {
          setExistingRegistration(registration);
          setRegistrantName(registration.name);
          setFormData(registration.questions || {});
        }
      } catch (error) {
        // User not registered yet, that's fine
        console.log("User not registered for this event");
      } finally {
        setLoadingRegistration(false);
      }
    };

    fetchExistingRegistration();
  }, [user, event]);

  const handleInputChange = (questionLabel: string, value: any) => {
    let processedValue: any;

    // Handle File objects - store them as-is
    if (value instanceof File) {
      processedValue = value;
    } else if (Array.isArray(value)) {
      processedValue = value.join(", ");
    } else if (typeof value === "string") {
      processedValue = value;
    } else {
      processedValue = String(value);
    }

    setFormData((prev) => ({
      ...prev,
      [questionLabel]: processedValue,
    }));

    if (errors[questionLabel]) {
      setErrors((prev) => ({
        ...prev,
        [questionLabel]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!registrantName.trim()) {
      newErrors.registrantName = "Name is required";
    }
    if (!user?.email) {
      newErrors.auth = "You must be logged in to register";
    }

    event.questions?.forEach((question) => {
      if (question.required) {
        const value: any = formData[question.label];

        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[question.label] = `${question.label} is required`;
        } else if (typeof value === "string" && value.trim() === "") {
          newErrors[question.label] = `${question.label} is required`;
        } else if (question.type === "file" && !(value instanceof File)) {
          newErrors[question.label] = `${question.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user?.email) return;

    setIsSubmitting(true);

    try {
      const registrationData = {
        id: user.uid,
        name: registrantName,
        email: user.email,
        questions: formData,
        status: "registered" as const,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      if (existingRegistration) {
        // Update existing registration
        const registration = new Registration(registrationData);
        registration.id = existingRegistration.id;
        await registration.update(event.id);
        toast.success("Registration updated successfully!");
      } else {
        // Create new registration
        const registration = new Registration(registrationData);
        await registration.create(event.id);
        toast.success("Registration submitted successfully!");
      }

      router.push(`/account/events`);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if registration is available
  const isRegistrationOpen = event.isRegistrationOpen;

  if (!isRegistrationOpen) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Registration Closed</h3>
          <p className="text-muted-foreground">Registration for this event is no longer available.</p>
        </div>
      </Card>
    );
  }

  if (!event.questions || event.questions.length === 0) {
    return null;
  }

  if (loadingRegistration) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading registration...</p>
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Register for This Event</h3>
        <p className="text-muted-foreground mb-6">Please sign in to register for this event.</p>
        <Button asChild size="lg">
          <Link href="/account/login">Sign In to Register</Link>
        </Button>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto">
      <Card className="p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">
            {existingRegistration ? "Update Registration" : "Event Registration"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {existingRegistration
              ? "Update your registration details below."
              : `Please fill out the form below to register for ${event.title}.`}
          </p>
        </motion.div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Registrant Information */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold mb-4">Registrant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrantName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="registrantName"
                    type="text"
                    value={registrantName}
                    onChange={(e) => {
                      setRegistrantName(e.target.value);
                      if (errors.registrantName) {
                        setErrors((prev) => ({ ...prev, registrantName: "" }));
                      }
                    }}
                    placeholder="Enter your full name"
                    className={errors.registrantName ? "border-red-500" : ""}
                  />
                  <AnimatePresence>
                    {errors.registrantName && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.registrantName}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrantEmail">Email Address</Label>
                  <Input
                    id="registrantEmail"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    placeholder="Email from your account"
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">Using email from your logged-in account</p>
                </div>
              </div>
              <AnimatePresence>
                {errors.auth && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-500 text-sm mt-4"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.auth}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Registration Questions */}
          <AnimatePresence mode="wait">
            {event.questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <Label htmlFor={`question_${index}`}>
                          {question.label}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>

                        {question.type === "text" && (
                          <Input
                            id={`question_${index}`}
                            type="text"
                            value={formData[question.label] || ""}
                            onChange={(e) => handleInputChange(question.label, e.target.value)}
                            className={errors[question.label] ? "border-red-500" : ""}
                          />
                        )}

                        {question.type === "textarea" && (
                          <textarea
                            id={`question_${index}`}
                            value={formData[question.label] || ""}
                            onChange={(e) => handleInputChange(question.label, e.target.value)}
                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              errors[question.label] ? "border-red-500" : ""
                            }`}
                            rows={4}
                          />
                        )}

                        {question.type === "select" && question.options && (
                          <select
                            id={`question_${index}`}
                            value={formData[question.label] || ""}
                            onChange={(e) => handleInputChange(question.label, e.target.value)}
                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              errors[question.label] ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Select an option</option>
                            {question.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {question.type === "checkbox" && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`question_${index}_${optionIndex}`}
                                  checked={formData[question.label]?.includes(option) || false}
                                  onChange={(e) => {
                                    const currentValues = formData[question.label] || [];
                                    const newValues = e.target.checked
                                      ? [...currentValues, option]
                                      : currentValues.filter((v: string) => v !== option);
                                    handleInputChange(question.label, newValues);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor={`question_${index}_${optionIndex}`} className="text-sm font-normal">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === "file" && (
                          <Input
                            id={`question_${index}`}
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleInputChange(question.label, file);
                              }
                            }}
                            className={errors[question.label] ? "border-red-500" : ""}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {errors[question.label] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm mt-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors[question.label]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: event.questions.length * 0.1 + 0.2 }}
            className="flex gap-4 pt-6 border-t border-border/50"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                type="submit"
                disabled={isSubmitting || !event.isUpcoming}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? "Submitting..." : existingRegistration ? "Update Registration" : "Register for Event"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
