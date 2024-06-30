import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

const MAX_CHUNK_SIZE = 2500; // Adjust this based on your needs and Bedrock's limits

export async function POST(request: NextRequest) {
  const { files } = await request.json();

  try {
    // Fetch documents from S3
    const documents = await Promise.all(files.map(fetchDocumentFromS3));

    // Chunk documents and summarize each chunk
    const chunks = chunkDocuments(documents);
    const chunkSummaries = await Promise.all(chunks.map(generateSummaryWithBedrock));
    // Generate final summary
    const finalSummary = await generateFinalSummary(chunkSummaries.join('\n\n'));
    console.log(finalSummary);

    // Upload summary to S3 and get URL
    const summaryUrl = await uploadSummaryToS3AndGetUrl(finalSummary);

    return NextResponse.json({ summaryUrl });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ message: 'Failed to generate summary' }, { status: 500 });
  }
}

function chunkDocuments(documents: string[]): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  for (const doc of documents) {
    if (currentChunk.length + doc.length > MAX_CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      // If a single document is larger than MAX_CHUNK_SIZE, split it
      if (doc.length > MAX_CHUNK_SIZE) {
        for (let i = 0; i < doc.length; i += MAX_CHUNK_SIZE) {
          chunks.push(doc.slice(i, i + MAX_CHUNK_SIZE));
        }
      } else {
        currentChunk = doc;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + doc;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function fetchDocumentFromS3(filename: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
  });

  const response = await s3Client.send(command);
  return await streamToString(response.Body);
}

async function streamToString(stream: any): Promise<string> {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function generateFinalSummary(text: string): Promise<string> {
  const prompt = `
  You are a real estate analyst. The following pieces into a cohesive investment report, involving all elements that could possible invovle the future cash flow.
  Please Start the report with the text: INVESTMENT REPORT FINDEVOR: 
  ${text}
  Please end the report with the text: END OF REPORT
  `;
  const command = new InvokeModelCommand({
    modelId: "meta.llama3-8b-instruct-v1:0", // Llama 2 70B model
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      max_gen_len: 512,
      temperature: 0.5,
      top_p: 0.9,
    }),
  });
  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  // Create an object with both request and response information
  const logObject = {
    request: {
      prompt: prompt,
      modelId: "meta.llama3-8b-instruct-v1:0",
      parameters: {
        max_gen_len: 512,
        temperature: 0.5,
        top_p: 0.9,
      }
    },
    response: responseBody
  };
  // Log the entire object as JSON
  console.log(JSON.stringify(logObject, null, 2));  
  return responseBody.generation;
}


async function generateSummaryWithBedrock(text: string): Promise<string> {
  const prompt = `You are a real estate analyst. Please summarize the key information in this text that you find would be most relevant for an investor:
  ${text}
  `;
  const command = new InvokeModelCommand({
    modelId: "meta.llama3-8b-instruct-v1:0", // Llama 2 70B model
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      max_gen_len: 512,
      temperature: 0.5,
      top_p: 0.9,
    }),
  });
  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const logObject = {
    request: {
      prompt: prompt,
      modelId: "meta.llama3-8b-instruct-v1:0",
      parameters: {
        max_gen_len: 512,
        temperature: 0.5,
        top_p: 0.9,
      }
    },
    response: responseBody
  };
  // Log the entire object as JSON
  console.log(JSON.stringify(logObject, null, 2));  
  return responseBody.generation;
}

async function uploadSummaryToS3AndGetUrl(summary: string): Promise<string> {
  const filename = `summary-${Date.now()}.txt`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: summary,
    ContentType: 'text/plain',
  });

  await s3Client.send(command);

  // Generate a pre-signed URL for downloading
  const url = await getSignedUrl(s3Client, new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
  }), { expiresIn: 3600 }); // URL expires in 1 hour

  return url;
}