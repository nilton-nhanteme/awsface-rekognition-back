import { Router } from 'express';
import { createCollection, listCollections, indexFaces } from '../controllers/admin.controller';

const router = Router();

router.post('/admin/create-collection', createCollection);
router.get('/admin/collections', listCollections);
router.post('/admin/index-face', indexFaces);

export default router;