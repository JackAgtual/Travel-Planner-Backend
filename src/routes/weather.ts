import { Router } from 'express'
import axios from 'axios'

const router = Router()

type forecastQueryParams = {
  lat: string
  lon: string
}

type weatherForecast = {
  temp: number
  weatherIcon: string
  displayDate: string
}

router.get('/forecast', async (req, res) => {
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

module.exports = router
