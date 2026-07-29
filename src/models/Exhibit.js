import mongoose from 'mongoose'

const mediaAssetSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
)

const exhibitSchema = new mongoose.Schema(
  {
    exhibitNumber: { type: Number, required: true, unique: true },
    title: { type: Map, of: String, default: {} },
    description: { type: Map, of: String, default: {} },
    image: { type: mediaAssetSchema, default: () => ({}) },
    audio: { type: Map, of: mediaAssetSchema, default: {} },
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Exhibit = mongoose.model('Exhibit', exhibitSchema)
export default Exhibit
