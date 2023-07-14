import { Router } from 'express'
import { forecastQueryParams } from '../types/weatherTypes'
import WeatherService from '../services/weatherService'
const router = Router()

const weatherService = WeatherService()

router.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query as forecastQueryParams

  const result = await weatherService.getForcast({ lat, lon })

  res.json(result)
})

module.exports = router
