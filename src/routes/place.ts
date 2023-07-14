import { Router } from 'express'
import PlaceService from '../services/placeService'
import { placeQueryParams } from '../types/placeTypes'

const router = Router()
const placeService = PlaceService()

router.get('/', async (req, res) => {
  const { destination, types, imageMaxWidth } = req.query as placeQueryParams

  try {
    const results = await placeService.getPlaceData({ destination, types, imageMaxWidth })
    res.json(results)
  } catch (error) {
    res.status(400).send('Invalid types')
  }
})

module.exports = router
