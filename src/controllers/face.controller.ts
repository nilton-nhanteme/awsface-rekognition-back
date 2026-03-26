import { rekognitionClient, s3Client } from "../config/aws";
import { Request, Response } from "express";
import { 
  DetectFacesCommand,
  CompareFacesCommand,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition";

export const detectFace = async (req: Request, res: Response): Promise<any> => {
  try {
    const { imageBase64 } = req.body; 
    if (!imageBase64) {
      return res.status(400).json({
        error: "Image is required",
      })
    };

    const buffer =  Buffer.from(imageBase64, "base64");
    const detectFacesCommand = new DetectFacesCommand({ 
      Image: {
        Bytes: buffer,
      },
      Attributes: ["ALL"],
    });

    const data = await rekognitionClient.send(detectFacesCommand);
  } catch (error) {
    return res.status(500).json({
      error: `Internal server error: ${error}`,
    })
  }
}

export const verifyFace = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      sourceImageBase64,
      targetImageBase64,
    } = req.body;

    if (!sourceImageBase64 || !targetImageBase64) {
      return res.status(400).json({
        error: "Source and target images are required",
      });
    };

    const sourceBuffer = Buffer.from(sourceImageBase64, "base64");
    const targetBuffer = Buffer.from(targetImageBase64, "base64");

    const compareFacesCommand = new CompareFacesCommand({
      SourceImage: {
        Bytes: sourceBuffer,
      },
      TargetImage: {
        Bytes: targetBuffer,
      },
      SimilarityThreshold: 90,
    });
    
    const data = await rekognitionClient.send(compareFacesCommand);
    return res.status(200).json({
      data,
    })
  } catch (error) {
    return res.status(500).json({
      error: `Internal server error: ${error}`,
    })
  }
}

export const searchSimilarFaces = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      imageBase64,
      collectionId,
    } = req.body;

    if (!imageBase64 || !collectionId) {
      return res.status(400).json({
        error: "Image and collection ID are required",
      });
    }

    const  buffer = Buffer.from(imageBase64, "base64");

    const FaceMatchThreshold = Math.min(Math.max(Number(req.body.faceMatchThreshold ?? 90), 0), 100);
    const maxFaces = Math.min(Math.max(Number(req.body.maxFaces ?? 10), 0), 100);

    const searchFacesByImageCommand = new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: {
        Bytes: buffer,
      },
      FaceMatchThreshold,
      MaxFaces: maxFaces,
    })

    const data = await rekognitionClient.send(searchFacesByImageCommand);
    return res.status(200).json({
      data,
    })
  } catch (error) {
    return res.status(500).json({
      error: `Internal server error: ${error}`,
    })
  }
}
