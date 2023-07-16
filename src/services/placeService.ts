import axios, { AxiosResponse } from 'axios'
import { placeQueryParams, allowableTypes } from '../types/placeTypes'

export default function PlaceService() {
  const _processWeatherData = (
    apiResponse: AxiosResponse<any, any>,
    imageMaxWidth: Number
  ) => {
    return apiResponse.data.results
      .filter((item: any) => item.user_ratings_total > 0)
      .sort(
        (a: any, b: any) =>
          b.rating - a.rating || b.user_ratings_total - a.user_ratings_total
      )
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

  const getGeopointData = async (destination: string) => {
    const apiRes = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${destination}&inputtype=textquery&fields=formatted_address%2Cname%2Cgeometry&key=${process.env.GOOGLE_MAPS_API_KEY}`
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

    const placeResults = []
    for (const type of types) {
      const apiRes = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}&type=${type}&radius=50000`
      )
      placeResults.push({ type, data: _processWeatherData(apiRes, imageMaxWidth) })
    }

    return placeResults
  }

  return {
    getPlaceData,
    getGeopointData,
  }
}
