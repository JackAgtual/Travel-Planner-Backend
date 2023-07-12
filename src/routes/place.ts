import { Router } from 'express'
import axios from 'axios'

const router = Router()

type placeQueryParams = {
  query: string
  type: string
}

router.get('/', async (req, res) => {
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

module.exports = router
