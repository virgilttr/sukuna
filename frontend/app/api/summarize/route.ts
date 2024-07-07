import "server-only";
import {
  BedrockAgentRuntime,
  RetrieveAndGenerateCommand,
  RetrieveAndGenerateType,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { NextRequest } from "next/server";
import { fromEnv } from "@aws-sdk/credential-providers";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "findevor-mvp";

const bedrock = new BedrockAgentRuntime({
  region: "us-east-1",
  credentials: fromEnv(),
});

async function callBedrockKnowledgeBase(prompt: string, prefix: string) {
  const knowledgeBaseId = process.env.KNOWLEDGE_BASE_ID;
  const command = new RetrieveAndGenerateCommand({
    input: {
      text: prompt,
    },
    retrieveAndGenerateConfiguration: {
      type: RetrieveAndGenerateType.KNOWLEDGE_BASE,
      knowledgeBaseConfiguration: {
        knowledgeBaseId: knowledgeBaseId,
        modelArn: "anthropic.claude-3-haiku-20240307-v1:0",
        retrievalConfiguration: {
          vectorSearchConfiguration: {
            numberOfResults: 10,
            /* filter: {
              startsWith: {
                key: "x-amz-bedrock-kb-source-uri",
                value: `s3://${S3_BUCKET_NAME}/${prefix}/`,
              },
            }, TODO: Not suppored while using Pinecone*/
          },
        },
        /*         generationConfiguration: {
          promptTemplate: {
            textPromptTemplate: `\n\nHuman: You will be acting as a real estate analyst for Findevor. Provide a summarized answer that uses all the information retrieved from the search results to make a coherent report for a real estate investor.
            If there are no results, say you cannot determine the information from the existing documents.
            Here is the relevant information in numbered order from our knowledge base: $search_results$
            User query: $query$\n\nAssistant:`,
          },
        }, */
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
          markdownCitations += "\n\n***\n\n <br>";
          if (reference.content?.text) {
            markdownCitations += `\n\n ${reference.content.text}`;
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
  const prefix = res.prefix;

  const prompts = [
    "What are the key informations about this property? Where is it located, what are the main investment benefits, and what are the biggest risks?.",
    "What do the financials of this property look like? What have been the biggest sources of revenue and biggest costs recently?",
  ];

  const results = await Promise.all(
    prompts.map((prompt) => callBedrockKnowledgeBase(prompt, prefix))
  );

  // Combine the results
  let combinedOutput = "";
  let combinedCitations = "";
  const combinedUrls = new Set();

  results.forEach((result, index) => {
    if (result) {
      combinedOutput += `\n\n--- Summary ${index + 1} ---\n\n${result.output}`;
      combinedCitations += result.citations;
      result.urls.forEach((url) => combinedUrls.add(url));
    }
  });

  // Generate a final summary
  const finalSummaryPrompt = `Based on the following summaries, provide a comprehensive overview for a real estate investor:\n\n${combinedOutput}`;
  const finalSummary = await callBedrockKnowledgeBase(
    finalSummaryPrompt,
    prefix
  );

  const response = {
    summary: finalSummary ? finalSummary.output : "Failed to generate summary.",
    citations: combinedCitations + (finalSummary ? finalSummary.citations : ""),
    urls: Array.from(combinedUrls),
  };

  console.log(response);
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
