import { NextRequest, NextResponse } from 'next/server';
import { IncomingMessage } from 'http';
import formidable, { File, Fields, Files } from 'formidable';
import AWS from 'aws-sdk';
import fs from 'fs/promises';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Disable Next.js body parsing to let formidable handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFile = async (file: File): Promise<AWS.S3.ManagedUpload.SendData> => {
  const fileBuffer = await fs.readFile(file.filepath);

  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: file.originalFilename!,
    Body: fileBuffer,
    ContentType: file.mimetype!,
  };

  return s3.upload(params).promise();
};

const parseFiles = (req: IncomingMessage): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    // Cast the NextRequest to IncomingMessage to be compatible with formidable
    const { files } = await parseFiles(req as any as IncomingMessage);

    const fileArray: File[] = [];

    Object.values(files).forEach((fileValue) => {
      if (Array.isArray(fileValue)) {
        fileValue.forEach((file) => {
          if (file) fileArray.push(file);
        });
      } else if (fileValue) {
        fileArray.push(fileValue as File);
      }
    });

    const uploadPromises = fileArray.map((file) => uploadFile(file));
    const results = await Promise.all(uploadPromises);

    return NextResponse.json({ files: results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error uploading the files' }, { status: 500 });
  }
}