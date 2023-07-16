export type placeQueryParams = {
  destination: string
  types: Array<
    | 'restaurant'
    | 'bar'
    | 'airport'
    | 'art_gallery'
    | 'bakery'
    | 'bar'
    | 'car_rental'
    | 'city_hall'
    | 'lodging'
    | 'museum'
    | 'night_club'
    | 'tourist_attraction'
  >
  imageMaxWidth: number | undefined
}

export const allowableTypes = new Set([
  'restaurant',
  'bar',
  'airport',
  'art_gallery',
  'bakery',
  'bar',
  'car_rental',
  'city_hall',
  'lodging',
  'museum',
  'night_club',
  'tourist_attraction',
])

export type geopointQueryParams = {
  destination: string
}
