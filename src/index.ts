import express from 'express'
import dotenv from 'dotenv'
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const PORT = process.env.PORT || 8000

dotenv.config()
const app = express()
app.use(cors())
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 60,
  }),
)
app.set('trust proxy', 1)

const placeRouter = require('./routes/place')
const weatherRouter = require('./routes/weather')
app.use('/place', placeRouter)
app.use('/weather', weatherRouter)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(process.env.PORT, () =>
  console.log(`Running server on http://localhost:${PORT}`),
)
