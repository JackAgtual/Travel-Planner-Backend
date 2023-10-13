import { Router } from 'express'
import { forecastQueryParams } from '../types/weatherTypes'
import WeatherService from '../services/weatherService'
const router = Router()

const weatherService = WeatherService()

router.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query as forecastQueryParams

  try {
    const result = await weatherService.getForcast({ lat, lon })
    res.json(result)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router
