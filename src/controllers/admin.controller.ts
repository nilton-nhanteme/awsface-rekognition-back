import { Response, Request } from "express";
import {
  CreateCollectionCommand,
  ListCollectionsCommand,
  DeleteCollectionCommand,
  IndexFacesCommand,
  FaceRecord$
} from "@aws-sdk/client-rekognition";
import { rekognitionClient, s3Client } from "../config/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const createCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { collectionId } = req.body;
    if (!collectionId) {
      return res.status(400).json({
        error: "Collection ID is required",
      })
    };

    const createCollectionCommand = new CreateCollectionCommand({
      CollectionId: collectionId,
    });

    const data = await rekognitionClient.send(createCollectionCommand);
    return res.status(200).json({
      message: "Collection created successfully",
      statusCode: data.$metadata.httpStatusCode,
      data,
    })
  } catch (error) {
    return res.status(500).json({
      error: `Internal server error: ${error}`,
    })
  }
}

export const listCollections = async (req: Request, res: Response): Promise<any> => {
  try {
    const listCollectionsCommand = new ListCollectionsCommand({});
    const data = await rekognitionClient.send(listCollectionsCommand);
    return res.status(200).json({
      message: "Collections listed successfully",
      statusCode: data.$metadata.httpStatusCode,
      data,
    })
  } catch (error) {
    return res.status(500).json({
      error: `Internal server error: ${error}`,
    })
  }
}

export const indexFaces = async (req: Request, res: Response): Promise<any> => {
  try {
    const { collectionId, imageBase64, externalImageId } = req.body;
    if (!collectionId || !imageBase64 || !externalImageId) {
      return res.status(400).json({
        error: "Collection ID, image base64, and external image ID are required",
      })
    };

    const buffer = Buffer.from(imageBase64, 'base64');

    const indexFacesCommand = new IndexFacesCommand({
      CollectionId: collectionId,
      Image: {
        Bytes: buffer,
      },
      ExternalImageId: externalImageId, 
    })

    const s3command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: externalImageId,
      Body: buffer,
      ContentType: "image/jpeg",
    })

    const data = await rekognitionClient.send(indexFacesCommand);
    await s3Client.send(s3command);
    return res.status(200).json({
      message: `Faces indexed successfully in collection ${collectionId}`,  
      statusCode: data.$metadata.httpStatusCode,
      FaceRecords: data.FaceRecords,
      data,
    })
  } catch (error) {
    return res.status(500).json({
      error: `Internal server error: ${error}`,
    })
  }
}


