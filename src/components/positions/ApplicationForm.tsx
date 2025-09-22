import { Position } from "@/app/types/positions";
import { Application } from "@/app/types/positions/applications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Send, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Parser from "../../app/types/parser";
import QuestionInput from "./QuestionInput";

interface ApplicationFormProps {
  position: Position;
}

export default function ApplicationForm({ position }: ApplicationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [applicantName, setApplicantName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

    if (!applicantName.trim()) {
      newErrors.applicantName = "Name is required";
    }
    if (!user?.email) {
      newErrors.auth = "You must be logged in to submit an application";
    }

    position.questions.forEach((question) => {
      if (question.required) {
        const value: any = formData[question.label];

        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[question.label] = "Input is required";
        } else if (typeof value === "string" && value.trim() === "") {
          newErrors[question.label] = "Input is required";
        } else if (question.type === "file" && !(value instanceof File)) {
          newErrors[question.label] = "Input is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user?.email) {
      return;
    }

    setIsSubmitting(true);

    try {
      let text: string | "";
      const resumeFile = formData["Resume"] as File;
      text = await Parser.parseFileText(resumeFile);

      const resumeTxt = await Parser.textToTxt(text, "Resume");

      const resumeTextURL = await Parser.FileToPositionStorage(resumeTxt, position.id, user.uid, "Text_Resume");

      const resumeURL = await Parser.FileToPositionStorage(resumeFile, position.id, user.uid, "Resume");

      formData["Resume_text"] = resumeTextURL;
      formData["Resume"] = resumeURL;

      const application = new Application({
        id: user.uid,
        name: applicantName,
        email: user.email,
        questions: formData,
        status: "pending",
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      });

      for (const question of position.questions) {
        if (question.type === "file") {
          const file = formData[question.label] as unknown as File;
          if (file) {
            let text: string | "";

            try {
              text = await Parser.parseFileText(file);

              const fileTxt = await Parser.textToTxt(text, question.label);
              const fileTxtURL = await Parser.FileToPositionStorage(
                fileTxt,
                position.id,
                user.uid,
                `Text_${question.label}`
              );
              const fileURL = await Parser.FileToPositionStorage(file, position.id, user.uid, question.label);

              application.questions[question.label] = fileURL;
              application.questions[`${question.label}_text`] = fileTxtURL;
            } catch (error) {
              console.error("Error processing file:", error);
              setErrors((prev) => ({
                ...prev,
                [question.label]: "Error processing file",
              }));
              setIsSubmitting(false);
              return;
            }
          }
        }
      }

      await application.create(position.id);

      toast.success(
        "Application submitted successfully! You may reapply to this position if you want to update your application."
      );
      router.push("/account/positions");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!position.questions || position.questions.length === 0) {
    return null;
  }

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Apply for This Position</h3>
        <p className="text-muted-foreground mb-6">Please sign in to apply for this position.</p>
        <Button size="lg" color="white">
          <a href="/account/login">Sign In to Apply</a>
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
          <h2 className="text-3xl font-bold mb-2">Application Questions</h2>
          <p className="text-muted-foreground text-lg">
            Please answer all questions to complete your application for{" "}
            <span className="font-semibold text-foreground">{position.name}</span>
          </p>
        </motion.div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Applicant Information */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="applicantName"
                    type="text"
                    value={applicantName}
                    onChange={(e) => {
                      setApplicantName(e.target.value);
                      if (errors.applicantName) {
                        setErrors((prev) => ({ ...prev, applicantName: "" }));
                      }
                    }}
                    placeholder="Enter your full name"
                    className={errors.applicantName ? "border-red-500" : ""}
                  />
                  <AnimatePresence>
                    {errors.applicantName && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm break-words"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.applicantName}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicantEmail">Email Address</Label>
                  <Input
                    id="applicantEmail"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    placeholder="Email from your account"
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">Using email from your logged-in account</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="resumeUpload" className="font-medium">
                    Resume <span className="text-red-500">*</span>
                  </Label>
                  <div
                    id="resumeUpload"
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-8 transition-colors cursor-pointer bg-background hover:border-primary/70 focus-within:border-primary/70 ${
                      errors["Resume"] ? "border-red-500" : "border-muted-foreground/40"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files && e.dataTransfer.files[0];
                      if (file) handleInputChange("Resume", file);
                    }}
                    tabIndex={0}
                  >
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        handleInputChange("Resume", file);
                      }}
                      required
                    />
                    <div className="flex flex-col items-center pointer-events-none z-0">
                      {!formData["Resume"] ? (
                        <>
                          <span className="text-lg font-medium mb-1">
                            Drag & drop your resume here, or <span className="underline text-primary">browse</span>
                          </span>
                          <span className="text-xs text-muted-foreground">Accepted: PDF, Images</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground">Selected file:</span>
                          {formData["Resume"].name ? (
                            <motion.div
                              className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3 border border-muted-foreground/20"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: 0.1,
                              }}
                            >
                              <div className="flex-shrink-0 w-10 h-10 bg-muted rounded flex items-center justify-center">
                                <Upload className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {formData["Resume"].name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(formData["Resume"].size)} • {formData["Resume"].type}
                                </p>
                              </div>
                            </motion.div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No file selected</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {errors["Resume"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm mt-1 break-words"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors["Resume"]}
                      </motion.div>
                    )}
                  </AnimatePresence>
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

          {/* Application Questions */}
          <AnimatePresence mode="wait">
            {position.questions.map((question, index) => (
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
                    <div className="flex-1 min-w-0">
                      <QuestionInput
                        question={question}
                        value={formData[question.label]}
                        onChange={(value) => handleInputChange(question.label, value)}
                        index={index}
                      />
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
            transition={{ delay: position.questions.length * 0.1 + 0.2 }}
            className="flex gap-4 pt-6 border-t border-border/50"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                type="submit"
                disabled={isSubmitting || !position.isActive}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
