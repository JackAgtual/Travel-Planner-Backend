import axios, { AxiosResponse } from 'axios'
import { weatherForecast, forecastQueryParams } from '../types/weatherTypes'

export default function WeatherService() {
  const _reduceForcastResponse = (apiResponse: AxiosResponse<any, any>) => {
    // returns 5 day forcast in 3 hour increments
    // only collect data at 12pm
    const weatherForcast: weatherForecast[] = []
    const idxIncrement = 8
    const numWeatherPoints = apiResponse.data.list.length

    for (let i = idxIncrement / 2; i < numWeatherPoints; i += idxIncrement) {
      const curWeatherData = apiResponse.data.list[i]

      const dateStrSplit: string[] = curWeatherData.dt_txt.split(' ')[0].split('-')
      const monthStr = dateStrSplit[1]
      const dateStr = dateStrSplit[2]

      weatherForcast.push({
        temp: curWeatherData.main.temp,
        weatherIcon: `https://openweathermap.org/img/wn/${curWeatherData.weather[0].icon}@2x.png`,
        displayDate: `${monthStr}/${dateStr}`,
      })
    }
    return weatherForcast
  }

  const getForcast = async ({ lat, lon }: forecastQueryParams) => {
    const apiRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
    )
    return _reduceForcastResponse(apiRes)
  }

  return {
    getForcast,
  }
}
