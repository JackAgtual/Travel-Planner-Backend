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

type forecastQueryParams = {
  lat: string
  lon: string
}

type weatherForecast = {
  temp: number
  weatherIcon: string
  displayDate: string
}

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/place', async (req, res) => {
  const { query, type } = req.query as placeQueryParams

  const apiRes = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}&type=${type}&radius=50000`
  )

  res.json(
    apiRes.data.results.map((item: any) => {
      return {
        name: item.name,
        photoUrl: `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${item.photos[0].photo_reference}&maxwidth=400&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        priceLevel: item.price_level,
        rating: item.rating,
        numRatings: item.user_ratings_total,
      }
    })
  )
})

app.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query as forecastQueryParams

  const apiRes = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
  )

  // returns 5 day forcast in 3 hour increments
  // only collect data at 12pm
  const weatherForcast: weatherForecast[] = []
  const idxIncrement = 8
  const numWeatherPoints = apiRes.data.list.length

  for (let i = idxIncrement / 2; i < numWeatherPoints; i += idxIncrement) {
    const curWeatherData = apiRes.data.list[i]

    const dateStrSplit: string[] = curWeatherData.dt_txt.split(' ')[0].split('-')
    const monthStr = dateStrSplit[1]
    const dateStr = dateStrSplit[2]

    weatherForcast.push({
      temp: curWeatherData.main.temp,
      weatherIcon: `https://openweathermap.org/img/wn/${curWeatherData.weather[0].icon}@2x.png`,
      displayDate: `${monthStr}/${dateStr}`,
    })
  }

  res.json(weatherForcast)
})

app.listen(process.env.PORT, () =>
  console.log(`Running server on http://localhost${process.env.PORT}`)
)
