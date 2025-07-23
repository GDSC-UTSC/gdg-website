import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import Tesseract from "tesseract.js";
import { uploadFile } from "../../../lib/firebase/storage";

export default class Parser {
  private async parse(file: File): Promise<string> {
    // Handle PDF files
    if (file.type === "application/pdf") {
      // Dynamic import to avoid SSR issues
      const pdfjsLib = await import("pdfjs-dist");

      // Configure worker only on client-side
      if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      }

      const reader = new FileReader();
      //read the file as an array buffer since pdfjsLib expects an array buffer
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsArrayBuffer(file);
      });
      //parse the pdf
      const pdf = await pdfjsLib
        .getDocument(arrayBuffer)
        .promise.catch((error) => {
          return Promise.reject(new Error(`Error parsing PDF: ${error}`));
        });
      //create a promise that will resolve when the pdf is parsed
      const textPromises = [];
      //get text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        textPromises.push(
          pdf
            .getPage(i)
            .then((page) =>
              page
                .getTextContent()
                .then((content) =>
                  content.items
                    .map((item: TextItem | TextMarkedContent) =>
                      "str" in item ? item.str : ""
                    )
                    .join("\n")
                )
            )
        );
      }
      //join the text from each page
      const textArray = await Promise.all(textPromises);
      const fullText = textArray.join("\n").trim();
      //console.log("Full text:", fullText);
      return fullText || "File content is empty";
    }

    // images
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
