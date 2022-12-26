import assert from "assert"
import process from "process"
import { Semaphore } from "await-semaphore"
import got from "got"

const API_KEY = process.env.API_KEY
assert(API_KEY, "Missing Swedavia API key as API_KEY environment variable")

let flightDataCache = {}
const CACHE_REFRESH_INTERVAL = 60 * 1000
const cacheUpdateSemaphore = new Semaphore(1)

export const refreshAllFlightData = () => {
    swedaviaAirports.forEach(fetchFlightData)
}

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

    console.log(`Fetching fresh data for ${airportIATA} from Swedavia`)
    const arrivalsToday = fetchFlights(airportIATA, "arrivals", dateTodayYYYYMMDD())
    const arrivalsTomorrow = fetchFlights(airportIATA, "arrivals", dateTomorrowYYYYMMDD())
    const departuresToday = fetchFlights(airportIATA, "departures", dateTodayYYYYMMDD())
    const departuresTomorrow = fetchFlights(airportIATA, "departures", dateTomorrowYYYYMMDD())
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

const fetchFlights = async (airportIATA, mode, dateYYYYMMDD) => {
    const response = await swedaviaGot.get(`https://api.swedavia.se/flightinfo/v2/${airportIATA}/${mode}/${dateYYYYMMDD}`)
    return JSON.parse(response.body)
}

const dateTodayYYYYMMDD = () => (new Date()).toISOString().substring(0, 10)
const dateTomorrowYYYYMMDD = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().substring(0, 10)
}

const swedaviaGot = got.extend({
    headers: {
        "Accept": "application/json",
        "Cache-Control": "nocache",
        "Ocp-Apim-Subscription-Key": API_KEY
    }
})

export default fetchFlightData
export const swedaviaAirports = ["ARN", "GOT", "BMA", "MMX", "LLA", "UME", "OSD", "VBY", "RNB", "KRN"]
