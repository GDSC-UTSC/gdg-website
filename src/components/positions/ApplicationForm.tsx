import { Application } from "@/app/types/applications";
import { Position } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Send } from "lucide-react";
import { useState } from "react";
import Tesseract from "tesseract.js";
import QuestionInput from "./QuestionInput";

interface ApplicationFormProps {
  position: Position;
}

export default function ApplicationForm({ position }: ApplicationFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [applicantName, setApplicantName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (validateForm() && user?.email) {
      const files: File[] = [];

      let text: string | undefined;
      try {
        text = await parseFile(formData["Resume"]).then((text) => {
          return text.length > 0 ? text : "File content is empty";
        });
      } catch (error) {
        console.error("Error parsing file:", error);
        return;
      }

      //console.log("Parsed text:", text);

      let resumeURL = "";
      const resumeFile = formData["Resume"] as File | undefined;
      if (resumeFile) {
        resumeURL = await Application.prototype.uploadFile(
          resumeFile,
          position.id,
          user.uid,
          "Resume"
        );
        // Replace the File in formData with the URL so Firestore doesn't get a File object
        formData["Resume"] = resumeURL;
      }

      // I parsed the resume as well not sure if we wanted to store it here. ! !! store text
      const application = new Application({
        id: user.uid,
        name: applicantName,
        email: user.email,
        resume: resumeURL ?? "",
        questions: formData,
        status: "pending",
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      });
      for (const question of position.questions) {
        if (question.type === "file") {
          const file = formData[question.label] as unknown as File;
          if (file) {
            let text: string | undefined;
            // Setup timer
            //const startTime = performance.now();

            try {
              text = await parseFile(file).then((text) => {
                return text.length > 0 ? text : "File content is empty";
              });
            } catch (error) {
              console.error("Error parsing file:", error);
              setErrors((prev) => ({
                ...prev,
                [question.label]: "Error processing file",
              }));
              return;
            }
            // Uncomment the following lines to measure performance or timer and testing parsing output
            //const endTime = performance.now();
            //const duration = endTime - startTime;
            //console.log(`File processed in ${duration}ms`);
            //console.log("Parsed text:", text);
            const downloadURL = await application.uploadFile(
              file,
              position.id,
              user.uid,
              question.label
            );
            application.questions[question.label] = downloadURL;
          }
        }
      }
      await application.create(position.id);
    }
  };

  const parseFile = (file: File): Promise<string> => {
    // Handle PDF files
    if (file.type === "application/pdf") {
      /*
         Put PDF Parsing logic here






          For example, using pdfjsLib to extract text from PDF files
        */
    }

    // images
    if (file.type.startsWith("image/")) {
      return Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => text);
    }

    // unsupported file types
    return Promise.reject(new Error("Unsupported file type"));
  };

  if (!position.questions || position.questions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
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
            <span className="font-semibold text-foreground">
              {position.name}
            </span>
          </p>
        </motion.div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Applicant Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold mb-4">
                Applicant Information
              </h3>
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
                        className="flex items-center gap-2 text-red-500 text-sm"
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
                  <p className="text-xs text-muted-foreground">
                    Using email from your logged-in account
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="resumeUpload" className="font-medium">
                    Resume <span className="text-red-500">*</span>
                  </Label>
                  <div
                    id="resumeUpload"
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-8 transition-colors cursor-pointer bg-background hover:border-primary/70 focus-within:border-primary/70 ${
                      errors["Resume"]
                        ? "border-red-500"
                        : "border-muted-foreground/40"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file =
                        e.dataTransfer.files && e.dataTransfer.files[0];
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
                            Drag & drop your resume here, or{" "}
                            <span className="underline text-primary">
                              browse
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Accepted: PDF, Images
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground mt-2">
                          Selected file: {formData["Resume"].name}
                        </span>
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {errors["Resume"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm mt-1"
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
                    <div className="flex-1">
                      <QuestionInput
                        question={question}
                        value={formData[question.label]}
                        onChange={(value) =>
                          handleInputChange(question.label, value)
                        }
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
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                type="submit"
                disabled={isSubmitting || !position.isActive}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting
                  ? "Submitting Application..."
                  : "Submit Application"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
