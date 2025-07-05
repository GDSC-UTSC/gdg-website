import { Position } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Send, X } from "lucide-react";
import { useState } from "react";
import QuestionInput from "./QuestionInput";

interface ApplicationFormProps {
  position: Position;
  onSubmit: (formData: Record<string, any>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ApplicationForm({
  position,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (questionLabel: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [questionLabel]: value,
    }));

    // Clear error when user starts typing
    if (errors[questionLabel]) {
      setErrors((prev) => ({
        ...prev,
        [questionLabel]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    position.questions.forEach((question) => {
      if (question.required) {
        const value = formData[question.label];

        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[question.label] = `${question.label} is required`;
        } else if (typeof value === "string" && value.trim() === "") {
          newErrors[question.label] = `${question.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!position.questions || position.questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-4">Ready to Apply</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            This position doesn't have any application questions. You can apply
            directly.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onSubmit({})}
                disabled={isSubmitting}
                size="lg"
                className="px-8"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={onCancel}
                size="lg"
                className="px-8"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
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

        <form onSubmit={handleSubmit} className="space-y-8">
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
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
