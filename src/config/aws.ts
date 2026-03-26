import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const region = process.env.REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY_ID;
const s3BucketName = process.env.S3_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !s3BucketName) {
  throw new Error("Missing environment variables");
}

export const rekognitionClient = new RekognitionClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
})
