import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
const cors = require('cors')

dotenv.config()
const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/place', (req, res) => {
  const { query, type } = req.query

  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}&type=${type}&radius=50000`
    )
    .then((apiRes) => {
      res.json(apiRes.data)
    })
})

app.listen(process.env.PORT, () => console.log('Running server'))
