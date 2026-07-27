import Exhibit from '../models/Exhibit.js'
import Admin from '../models/Admin.js'
import cloudinary from '../config/cloudinary.js'
import bcrypt from 'bcryptjs'

const uploadToCloudinary = (buffer, mimetype, options) => {
  const b64 = buffer.toString('base64')
  const dataUri = `data:${mimetype};base64,${b64}`
  return cloudinary.uploader.upload(dataUri, options)
}

const destroyAsset = (publicId, resourceType = 'image') => {
  if (!publicId) return Promise.resolve()
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

export const getAllExhibits = async (req, res) => {
  try {
    const exhibits = await Exhibit.find().sort({ order: 1, exhibitNumber: 1 })
    res.json(exhibits)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createExhibit = async (req, res) => {
  try {
    const exhibit = await Exhibit.create(req.body)
    res.status(201).json(exhibit)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateExhibit = async (req, res) => {
  try {
    const exhibit = await Exhibit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!exhibit) {
      return res.status(404).json({ message: 'Exhibit not found' })
    }

    res.json(exhibit)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteExhibit = async (req, res) => {
  try {
    const exhibit = await Exhibit.findById(req.params.id)

    if (!exhibit) {
      return res.status(404).json({ message: 'Exhibit not found' })
    }

    await Promise.all([
      destroyAsset(exhibit.image?.publicId, 'image'),
      destroyAsset(exhibit.audio?.he?.publicId, 'video'),
      destroyAsset(exhibit.audio?.en?.publicId, 'video'),
    ])

    await exhibit.deleteOne()
    res.json({ message: 'Exhibit deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const togglePublish = async (req, res) => {
  try {
    const exhibit = await Exhibit.findById(req.params.id)

    if (!exhibit) {
      return res.status(404).json({ message: 'Exhibit not found' })
    }

    exhibit.isPublished = !exhibit.isPublished
    await exhibit.save()

    res.json({ isPublished: exhibit.isPublished })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' })
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, {
      folder: 'centerInfo/images',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })

    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: 1 })
    res.json(admins)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createAdmin = async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }
  try {
    const hash = await bcrypt.hash(password, 12)
    const admin = await Admin.create({ email, password: hash, name: name || '' })
    res.status(201).json({ _id: admin._id, email: admin.email, name: admin.name })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' })
    }
    res.status(500).json({ message: err.message })
  }
}

export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' })
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, {
      folder: 'centerInfo/audio',
      resource_type: 'video',
    })

    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
