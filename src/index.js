import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import seedAdmin from './utils/seedAdmin.js'
import authRoutes from './routes/authRoutes.js'
import exhibitRoutes from './routes/exhibitRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB().then(seedAdmin)

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/exhibits', exhibitRoutes)
app.use('/api/admin', adminRoutes)

app.use(express.static(path.join(__dirname, '../public')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
