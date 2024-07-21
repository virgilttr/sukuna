import "server-only";

import {
  BedrockAgentRuntime,
  RetrieveAndGenerateCommand,
  RetrieveAndGenerateType,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { NextRequest } from "next/server";
import { fromEnv } from "@aws-sdk/credential-providers";
const bedrock = new BedrockAgentRuntime({
  region: "us-east-1",
  credentials: fromEnv(),
});

async function callBedrockKnowledgeBase(prompt: string) {
  const knowledgeBaseId = process.env.KNOWLEDGE_BASE_ID;

  const command = new RetrieveAndGenerateCommand({
    input: {
      text: prompt,
    },
    retrieveAndGenerateConfiguration: {
      type: RetrieveAndGenerateType.KNOWLEDGE_BASE, // Use the correct type from RetrieveAndGenerateType enum
      knowledgeBaseConfiguration: {
        knowledgeBaseId: knowledgeBaseId,
        modelArn: "anthropic.claude-3-haiku-20240307-v1:0", // Replace with your actual model ARN if different
      },
    },
  });
  try {
    const response = await bedrock.send(command);
    if (response.output) {
      console.log(response.output);
      let markdownCitations = "";
      const urls = new Set();
      response.citations?.forEach((citation) => {
        citation.retrievedReferences?.forEach((reference) => {
          markdownCitations += "\n\n";
          markdownCitations += "***";
          markdownCitations += "\n\n <br>";
          if (reference.content?.text) {
            markdownCitations += `\n\n  ${reference.content.text}`;
          }

          if (reference.location?.type === "S3") {
            const uri = reference.location.s3Location?.uri;
            if (uri) {
              urls.add(uri);
            }
          }
        });
      });
      console.log(markdownCitations);
      console.log(urls);
      return {
        output: response.output ?? "",
        citations: markdownCitations,
        markdownCitations: markdownCitations,
        urls: Array.from(urls),
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function POST(request: NextRequest) {
  const res = await request.json();
  const respnse = await callBedrockKnowledgeBase(res.prompt);
  console.log(respnse);
  return new Response(JSON.stringify(respnse), {
    headers: { "Content-Type": "application/json" },
  });
}
