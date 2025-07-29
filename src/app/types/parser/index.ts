import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import Tesseract from "tesseract.js";
import { uploadFile } from "@/lib/firebase/client/storage";

export default class Parser {
  private async parse(file: File): Promise<string> {
    // Handle PDF files
    if (file.type === "application/pdf") {

      // 1. Save the current global worker setting, whatever it may be.
      const originalWorkerSrc = GlobalWorkerOptions.workerSrc;
      let fullText = "";

      try {
        // 2. Temporarily set the worker source to a reliable CDN path.
        GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs`;

        const reader = new FileReader();
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });

        const pdf = await getDocument(arrayBuffer).promise;
        const textPromises = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          textPromises.push(
            pdf.getPage(i).then((page) =>
              page.getTextContent().then((content) =>
                content.items
                  .map((item: TextItem | TextMarkedContent) => ("str" in item ? item.str : ""))
                  .join("\n")
              )
            )
          );
        }

        const textArray = await Promise.all(textPromises);
        fullText = textArray.join("\n").trim();

      } catch (error) {
        console.error("An error occurred during PDF parsing:", error);
        throw error; // Re-throw the error to be handled by the calling function

      } finally {
        // This runs whether the parsing succeeded or failed.
        console.log("Restoring original PDF.js worker source.");
        GlobalWorkerOptions.workerSrc = originalWorkerSrc;
      }

      return fullText || "File content is empty";
    }

    // images (This part remains unchanged and is correct)
    if (file.type.startsWith("image/")) {
      return Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => text);
    }

    // unsupported file types
    return Promise.reject(new Error("Unsupported file type"));
  }

  static async parseFileText(file: File): Promise<string> {
    try {
      const parser = new Parser();
      const text = await parser.parse(file);
      return text.length > 0 ? text : "File content is empty";
    } catch (error) {
      console.error("Error parsing file:", error);
      return "Error parsing file";
    }
  }

  static async textToTxt(text: string, question: string): Promise<File> {
    const blob = new Blob([text || ""], { type: "text/plain" });
    const file_txt = new File([blob], `${question}.txt`, {
      type: "text/plain",
    });
    return file_txt;
  }

  static async FileToStorage(file: File, location: string): Promise<string> {
    const { downloadURL } = await uploadFile(file, location);
    return downloadURL;
  }

  static async FileToPositionStorage(
    file: File,
    positionId: string,
    userId: string,
    filename: string
  ): Promise<string> {
    const filePath = `positions/${positionId}/applications/${userId}/${filename}`;
    const { downloadURL } = await uploadFile(file, filePath);

    return downloadURL;
  }
}
