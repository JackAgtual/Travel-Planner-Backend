import axios, { AxiosResponse } from 'axios'
import { placeQueryParams, allowableTypes } from '../types/placeTypes'

const apiKey = process.env.GOOGLE_MAPS_API_KEY

export default function PlaceService() {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place'

  const _getEffectiveRating = (place: any) => {
    // use Laplace's rule of succession to get effective rating
    return (
      ((place.rating / 5) * place.user_ratings_total + 1) / (place.user_ratings_total + 2)
    )
  }

  const _processPlaceData = (
    apiResponse: AxiosResponse<any, any>,
    imageMaxWidth: Number,
  ) => {
    return apiResponse.data.results
      .filter((item: any) => item.user_ratings_total > 0)
      .sort((a: any, b: any) => {
        _getEffectiveRating(b) - _getEffectiveRating(a)
      })
      .map((item: any) => {
        let photoUrl
        try {
          photoUrl = `${baseUrl}/photo?photo_reference=${item.photos[0].photo_reference}&maxwidth=${imageMaxWidth}&key=${apiKey}`
        } catch {
          photoUrl = `https://placehold.co/${imageMaxWidth}`
        }

        const addressComponents: string[] = item.formatted_address.split(',')
        const line1 = addressComponents[0].trim()
        const line2 = addressComponents.slice(1, -1).join(',').trim()

        return {
          name: item.name,
          photoUrl,
          id: item.place_id,
          icon: item.icon,
          priceLevel: item.price_level || -1,
          rating: item.rating,
          numRatings: item.user_ratings_total,
          location: {
            lat: item.geometry.location.lat,
            lon: item.geometry.location.lng,
          },
          address: {
            line1,
            line2,
          },
        }
      })
  }

  const getGeopointData = async (destination: string) => {
    const apiRes = await axios.get(
      `${baseUrl}/findplacefromtext/json?input=${destination}&inputtype=textquery&fields=formatted_address%2Cname%2Cgeometry&key=${apiKey}`,
    )

    const placeCandidates = apiRes.data.candidates
    if (placeCandidates.length === 0) {
      throw new Error('Could not find geopoint')
    }

    const place = placeCandidates[0]
    return {
      address: place.formatted_address,
      locationName: place.name,
      lat: place.geometry.location.lat,
      lon: place.geometry.location.lng,
    }
  }

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
    types.sort((a, b) => {
      if (a < b) return -1
      return 1
    })

    const placeResults = []
    for (const type of types) {
      const apiRes = await axios.get(
        `${baseUrl}/textsearch/json?query=${destination}&key=${apiKey}&type=${type}&radius=50000`,
      )
      placeResults.push({ type, data: _processPlaceData(apiRes, imageMaxWidth) })
    }

    return placeResults
  }

  return {
    getPlaceData,
    getGeopointData,
  }
}
