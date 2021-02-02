import assert from "assert"
import https from "https"
import process from "process"
import { Semaphore } from "await-semaphore"

const API_KEY = process.env.API_KEY
assert(API_KEY, "Missing Swedavia API key as API_KEY environment variable")

let flightDataCache = {}
const CACHE_REFRESH_INTERVAL = 60 * 1000
const cacheUpdateSemaphore = new Semaphore(1)

const fetchFlightData = async (airportIATA) => {
    let cachedFlightData = flightDataCache[airportIATA]
    if (cachedFlightData &&
        Date.now() - cachedFlightData.lastUpdate < CACHE_REFRESH_INTERVAL) {
        return cachedFlightData.flights
    }

    const release = await cacheUpdateSemaphore.acquire()
    cachedFlightData = flightDataCache[airportIATA]

    if (cachedFlightData &&
        Date.now() - cachedFlightData.lastUpdate < CACHE_REFRESH_INTERVAL) {
        // Flight data was already fetched by someone else while we waited for the lock, just return the cached data
        console.log("Flight data already fetched, using cache")
        release()
        return flightDataCache.flights
    }

    console.log("Fetching fresh data from Swedavia")
    const arrivalsToday = fetch(airportIATA, "arrivals", dateTodayYYYYMMDD())
    const arrivalsTomorrow = fetch(airportIATA, "arrivals", dateTomorrowYYYYMMDD())
    const departuresToday = fetch(airportIATA, "departures", dateTodayYYYYMMDD())
    const departuresTomorrow = fetch(airportIATA, "departures", dateTomorrowYYYYMMDD())
    const arrivalsAndDepartures = await Promise.all([
      arrivalsToday,
      arrivalsTomorrow,
      departuresToday,
      departuresTomorrow
    ])
    const flights = {
        arrivals: [arrivalsAndDepartures[0], arrivalsAndDepartures[1]],
        departures: [arrivalsAndDepartures[2], arrivalsAndDepartures[3]]
    }
    flightDataCache[airportIATA] = {
        flights,
        lastUpdate: new Date()
    }

    release()

    return flights
}

const fetch = (airportIATA, mode, dateYYYYMMDD) => {
    return new Promise((resolve, reject) => {
        const options = getOptions(airportIATA, mode, dateYYYYMMDD)

        https.get(options, (response) => {
            response.setEncoding("utf8")
            let data = ""
            response.on("data", (newData) => {
                data += newData
            })
            response.on("end", () => {
                resolve(JSON.parse(data))
            })
        }).on("error", (error) => {
            reject(error)
        })
    })
}

const headers = {
    "Accept": "application/json",
    "Cache-Control": "nocache",
    "Ocp-Apim-Subscription-Key": API_KEY
}

const dateTodayYYYYMMDD = () => (new Date()).toISOString().substring(0, 10)
const dateTomorrowYYYYMMDD = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().substring(0, 10)
}


const getOptions = (airportIATA, mode, dateYYYYMMDD) => ({
    hostname: "api.swedavia.se",
    path: `/flightinfo/v2/${airportIATA}/${mode}/${dateYYYYMMDD}`,
    method: "GET",
    headers
})

export default fetchFlightData
