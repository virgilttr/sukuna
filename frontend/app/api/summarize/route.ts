export const maxDuration = 30;
import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
  DocumentFormat,
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

//TODO Add support for images which is different from Document Type
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

// Helper function to remove file extension
function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

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
        ...files.map((file: FileContent) => ({
          document: {
            format: getDocumentFormat(file.type),
            name: removeFileExtension(file.name),
            source: {
              bytes: new Uint8Array(file.content),
            },
          },
        })),
      ],
    },
  ];

  try {
    const command = new ConverseCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      messages: messages,
      inferenceConfig: { maxTokens: 4096, temperature: 0.5, topP: 0.9 },
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
