import express from 'express'
import {
  getAllPublishedExhibits,
  getExhibitByNumber,
} from '../controllers/exhibitController.js'

const router = express.Router()

router.get('/', getAllPublishedExhibits)
router.get('/:number', getExhibitByNumber)

export default router
