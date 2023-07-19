import axios from 'axios'
import { forecastQueryParams } from '../types/weatherTypes'

export default function WeatherService() {
  const getForcast = async ({ lat, lon }: forecastQueryParams) => {
    const apiRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
    )
    const { list: weatherData, cnt: numResults } = apiRes.data

    // weather data is an array of weather data
    // 5 day forcast in 3 hour increments
    // does not account for timezones
    const entriesPerDay = 8
    let [startIdx, midIdx, stopIdx] = [0, 3, entriesPerDay]
    const reducedData = []
    while (stopIdx <= numResults) {
      // aggregate weather data for one day
      const weatherToday = weatherData.slice(startIdx, stopIdx)

      const minTemp = Math.round(
        Math.min(...weatherToday.map((curWeather: any) => curWeather.main.temp_min))
      )
      const maxTemp = Math.round(
        Math.max(...weatherToday.map((curWeather: any) => curWeather.main.temp_max))
      )
      const displayDate: string = weatherToday[0].dt_txt.split(' ')[0]
      const icon = `https://openweathermap.org/img/wn/${weatherToday[midIdx].weather[0].icon}@2x.png`
      const description = weatherToday[midIdx].weather[0].main

      reducedData.push({
        minTemp,
        maxTemp,
        displayDate,
        icon,
        description,
      })

      startIdx += entriesPerDay
      stopIdx += entriesPerDay
    }
    return reducedData
  }

  return {
    getForcast,
  }
}
