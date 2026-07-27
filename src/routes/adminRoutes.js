import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  uploadImage as uploadImageMiddleware,
  uploadAudio as uploadAudioMiddleware,
} from '../middleware/uploadMiddleware.js'
import {
  getAllExhibits,
  createExhibit,
  updateExhibit,
  deleteExhibit,
  togglePublish,
  uploadImage,
  uploadAudio,
} from '../controllers/adminController.js'

const router = express.Router()

router.use(protect)

router.get('/exhibits', getAllExhibits)
router.post('/exhibits', createExhibit)
router.put('/exhibits/:id', updateExhibit)
router.delete('/exhibits/:id', deleteExhibit)
router.patch('/exhibits/:id/publish', togglePublish)

router.post('/upload/image', uploadImageMiddleware, uploadImage)
router.post('/upload/audio', uploadAudioMiddleware, uploadAudio)

export default router
