import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
const cors = require('cors')

dotenv.config()
const app = express()
app.use(cors())

type placeQueryParams = {
  query: string
  type: string
}

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/place', async (req, res) => {
  const { query, type } = req.query as placeQueryParams

  const apiRes = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}&type=${type}&radius=50000`
  )
  res.json(apiRes.data)
})

app.listen(process.env.PORT, () =>
  console.log(`Running server on http://localhost${process.env.PORT}`)
)
