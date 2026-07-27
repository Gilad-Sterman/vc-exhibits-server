import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const admin = await Admin.findOne({ email: email?.toLowerCase() })
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, admin.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    const token = generateToken({ id: admin._id, email: admin.email })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
