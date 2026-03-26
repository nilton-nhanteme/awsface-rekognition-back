import { Router } from "express";
import { detectFace, verifyFace, searchSimilarFaces } from "../controllers/face.controller";

const router = Router();

router.post("/detect-face", detectFace);
router.post("/verify-face", verifyFace);
router.post("/search-similar-faces", searchSimilarFaces);

export default router;