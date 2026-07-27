import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'

const seedAdmin = async () => {
  const count = await Admin.countDocuments()
  if (count > 0) return

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('No admins in DB and no ADMIN_EMAIL/ADMIN_PASSWORD env vars — skipping seed')
    return
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await Admin.create({ email: ADMIN_EMAIL, password: hash, name: 'Admin' })
  console.log(`Seeded initial admin: ${ADMIN_EMAIL}`)
}

export default seedAdmin
