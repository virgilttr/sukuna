import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from 'next/server';
import { fromEnv } from "@aws-sdk/credential-providers";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: fromEnv(),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done: boolean = false;

  while (!done) {
    const { value, done: chunkDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = chunkDone;
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  console.info("Received a POST request");

  try {
    const formData = await req.formData();
    const fileUploadPromises: Promise<any>[] = [];

    formData.forEach(async (value, key) => {
      if (value instanceof File) {
        const file = value;
        const fileBuffer = await streamToBuffer(file.stream());
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME as string, // replace with your S3 bucket name
          Key: file.name,
          Body: fileBuffer,
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
    return NextResponse.json({ files: results });
  } catch (err) {
    console.error("Error parsing or uploading files", { error: err });
    return NextResponse.json({ error: "Error parsing or uploading files" }, { status: 500 });
  }
}