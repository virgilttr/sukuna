export const maxDuration = 30;
import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
  DocumentFormat,
  ImageFormat,
} from "@aws-sdk/client-bedrock-runtime";
import { NextRequest } from "next/server";
import { fromEnv } from "@aws-sdk/credential-providers";

const bedrock = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: fromEnv(),
});

interface FileContent {
  name: string;
  type: string;
  content: number[];
}

interface RequestBody {
  files: FileContent[];
  prompt: string;
}

function getDocumentFormat(fileType: string): DocumentFormat {
  const extension = fileType.split("/")[1].toLowerCase();
  switch (extension) {
    case "pdf":
      return DocumentFormat.PDF;
    case "txt":
      return DocumentFormat.TXT;
    case "html":
      return DocumentFormat.HTML;
    case "docx":
      return DocumentFormat.DOCX;
    case "xlsx":
      return DocumentFormat.XLSX;
    case "csv":
      return DocumentFormat.CSV;
    case "xls":
      return DocumentFormat.XLS;
    case "doc":
      return DocumentFormat.DOC;
    // Add more cases as needed
    default:
      return DocumentFormat.TXT; // Default to plain text if unknown
  }
}

function getImageFormat(fileType: string): ImageFormat {
  const extension = fileType.split("/")[1].toLowerCase();
  switch (extension) {
    case "jpeg":
      return ImageFormat.JPEG;
    case "png":
      return ImageFormat.PNG;
    case "webp":
      return ImageFormat.WEBP;
    case "gif":
      return ImageFormat.GIF;
    default:
      return ImageFormat.JPEG;
  }
}

// Helper function to remove file extension
function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

const imageExtensions = ["gif", "jpeg", "png", "webp", "jpg"];

const getFileContent = (file: FileContent) => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && imageExtensions.includes(extension)) {
    return {
      image: {
        format: getImageFormat(file.type),
        source: {
          bytes: new Uint8Array(file.content),
        },
      },
    };
  } else {
    return {
      document: {
        format: getDocumentFormat(file.type),
        name: removeFileExtension(file.name),
        source: {
          bytes: new Uint8Array(file.content),
        },
      },
    };
  }
};

export async function POST(request: NextRequest) {
  const res = (await request.json()) as RequestBody;
  const files = res.files;
  const prompt = res.prompt;

  const messages: Message[] = [
    {
      role: "user",
      content: [
        {
          text: prompt,
        },
        ...files.map((file: FileContent) => getFileContent(file)),
      ],
    },
  ];

  try {
    const command = new ConverseCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      messages: messages,
      inferenceConfig: { maxTokens: 4096, temperature: 0.3, topP: 0.9 },
    });

    const response = await bedrock.send(command);
    console.log(response);

    const content = response.output?.message?.content;

    let responseText = "No response generated.";

    if (
      Array.isArray(content) &&
      content.length > 0 &&
      typeof content[0].text === "string"
    ) {
      responseText = content[0].text;
    }

    return new Response(
      JSON.stringify({
        summary: responseText,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error calling Bedrock Converse API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate summary" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
