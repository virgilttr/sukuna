import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

const MAX_CHUNK_SIZE = 20000; // Adjust this based on your needs and Bedrock's limits

export async function POST(request: NextRequest) {
  const { files } = await request.json();

  try {
    // Fetch documents from S3
    const documents = await Promise.all(files.map(fetchDocumentFromS3));

    // Chunk documents and summarize each chunk
    const chunks = chunkDocuments(documents);
    const chunkSummaries = await Promise.all(chunks.map(generateSummaryWithBedrock));
    console.log(chunkSummaries);
    // Generate final summary
    const finalSummary = await generateSummaryWithBedrock(chunkSummaries.join('\n\n'));
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

async function generateSummaryWithBedrock(text: string): Promise<string> {
    const prompt = `Human: Please summarize the following document, from the perspective on a real estate investor. Highlight all aspects that could influence the return on investment:

    ${text}
    
    Assistant: Here's a concise summary of the text:"`;  
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0", // or your preferred model
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      max_tokens_to_sample: 1000,
      temperature: 0.5,
    }),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.completion;
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