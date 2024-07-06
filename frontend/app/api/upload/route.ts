import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from 'next/server';
import { fromEnv } from "@aws-sdk/credential-providers";
import {
  BedrockAgentClient,
  GetIngestionJobCommand,
  IngestionJobStatus,
  StartIngestionJobCommand,
} from '@aws-sdk/client-bedrock-agent';

const bedrockAgentClient = new BedrockAgentClient({ region: "us-east-1", credentials: fromEnv() });

const s3 = new S3Client({
  region: "us-east-1",
  credentials: fromEnv(),
});

export async function POST(req: NextRequest) {
  console.info("Received a POST request");

  try {
    const formData = await req.formData();
    const prefix = formData.get('prefix') as string;  // Get the prefix from the form data
    const fileUploadPromises: Promise<any>[] = [];

    formData.forEach(async (value, key) => {
      if (value instanceof File) {
        const file = formData.get("file") as File;        
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME as string, // replace with your S3 bucket name
          Key: `${prefix}/${file.name}`,  // Use the prefix in the S3 key         
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
        };

        const uploadPromise = s3.send(new PutObjectCommand(uploadParams))
          .then(() => {
            console.info(`Successfully uploaded ${file.name}`);
            return { file: file.name, status: "Uploaded" };
          })
          .catch((uploadErr) => {
            console.error(`Failed to upload ${file.name}`, { error: uploadErr });
            return { file: file.name, status: "Failed", error: uploadErr.message };
          });

        fileUploadPromises.push(uploadPromise);
      }
    });

    // Await all file upload promises
    const results = await Promise.all(fileUploadPromises);
    console.info("Upload results:", { results });
    const startIngestionJobCommand = new StartIngestionJobCommand({
      knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
      dataSourceId: process.env.DATA_SOURCE_ID,
    });
    const response = await bedrockAgentClient.send(startIngestionJobCommand);
    const ingestionJobId = response.ingestionJob?.ingestionJobId;
    const knowledgeBaseId = process.env.KNOWLEDGE_BASE_ID;
    const dataSourceId = process.env.DATA_SOURCE_ID;
    
    // Ensure environment variables are defined
    if (!knowledgeBaseId) {
      throw new Error('KNOWLEDGE_BASE_ID is not defined.');
    }
    
    if (!dataSourceId) {
      throw new Error('DATA_SOURCE_ID is not defined.');
    }
    if (!ingestionJobId) {
      throw new Error('INGESTION_JOB_ID is not defined.');
    }

    while (true) {
      // Get ingestion job status.
      const status = await getIngestionJobStatus(
        knowledgeBaseId,
        dataSourceId,
        ingestionJobId,
      );

      if (!status) {
        throw Error('データの取り込みに失敗しました。');
      }

      if (status === 'FAILED') {
        throw Error('データの取り込みに失敗しました。');
      }

      if (status === 'COMPLETE') {
        break;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
    }
    console.info("Finished ingestion job:", { response });
    return NextResponse.json({ files: results });
  } catch (err) {
    console.error("Error parsing or uploading files", { error: err });
    return NextResponse.json({ error: "Error parsing or uploading files" }, { status: 500 });
  }
}

// Get Ingestion Job Status
const getIngestionJobStatus = async (knowledgeBaseId: string, dataSourceId: string, ingestionJobId: string): Promise<IngestionJobStatus | undefined> => {
  const { ingestionJob } = await bedrockAgentClient.send(new GetIngestionJobCommand({
    knowledgeBaseId,
    dataSourceId,
    ingestionJobId,
  }));

  return ingestionJob?.status;
};
