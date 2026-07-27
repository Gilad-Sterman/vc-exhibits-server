import jwt from 'jsonwebtoken'

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

export const login = (req, res) => {
  const { email, password } = req.body

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken({ email })
  res.json({ token })
}
