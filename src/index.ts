import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
const cors = require('cors')

dotenv.config()
const app = express()
app.use(cors())

const placeRouter = require('./routes/place')
const weatherRouter = require('./routes/weather')
app.use('/place', placeRouter)
app.use('/weather', weatherRouter)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(process.env.PORT, () =>
  console.log(`Running server on http://localhost${process.env.PORT}`)
)
