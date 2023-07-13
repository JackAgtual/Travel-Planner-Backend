import { Router } from 'express'
import axios from 'axios'

const router = Router()

type placeQueryParams = {
  destination: string
  type: string
}

const imageMaxWidth = 400
const placeholderImage = `https://placehold.co/${imageMaxWidth}`

router.get('/', async (req, res) => {
  const { destination, type } = req.query as placeQueryParams

  const apiRes = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}&type=${type}&radius=50000`
  )

  res.json(
    apiRes.data.results
      .filter((item: any) => item.user_ratings_total > 0)
      .map((item: any) => {
        let photoUrl
        try {
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${item.photos[0].photo_reference}&maxwidth=${imageMaxWidth}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        } catch {
          photoUrl = placeholderImage
        }

        return {
          name: item.name,
          photoUrl,
          priceLevel: item.price_level || -1,
          rating: item.rating,
          numRatings: item.user_ratings_total,
        }
      })
  )
})

module.exports = router
