import axios from 'axios'
import { placeQueryParams, allowableTypes } from '../types/placeTypes'

export default function PlaceService() {
  const getPlaceData = async ({
    destination,
    types,
    imageMaxWidth,
  }: placeQueryParams) => {
    // input validation
    imageMaxWidth = imageMaxWidth || 400
    types.forEach((type) => {
      if (!allowableTypes.has(type)) {
        throw new Error('Invalid type')
      }
    })

    const apiRes = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}&type=${types}&radius=50000`
    )

    return apiRes.data.results
      .filter((item: any) => item.user_ratings_total > 0)
      .map((item: any) => {
        let photoUrl
        try {
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${item.photos[0].photo_reference}&maxwidth=${imageMaxWidth}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        } catch {
          photoUrl = `https://placehold.co/${imageMaxWidth}`
        }

        return {
          name: item.name,
          photoUrl,
          priceLevel: item.price_level || -1,
          rating: item.rating,
          numRatings: item.user_ratings_total,
        }
      })
  }

  return {
    getPlaceData,
  }
}
