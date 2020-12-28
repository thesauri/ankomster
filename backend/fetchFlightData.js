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
        console.log("Using cache")
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
    const arrivals = fetch(airportIATA, "arrivals")
    const departures = fetch(airportIATA, "departures")
    const arrivalsAndDepartures = await Promise.all([arrivals, departures])
    const flights = {
        arrivals: arrivalsAndDepartures[0],
        departures: arrivalsAndDepartures[1]
    }
    flightDataCache[airportIATA] = {
        flights,
        lastUpdate: new Date()
    }

    release()

    return flights
}

const fetch = (airportIATA, mode) => {
    return new Promise((resolve, reject) => {
        const options = getOptions(airportIATA, mode)

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

const getOptions = (airportIATA, mode) => ({
    hostname: "api.swedavia.se",
    path: `/flightinfo/v2/${airportIATA}/${mode}/${(new Date()).toISOString().substring(0, 10)}`,
    method: "GET",
    headers
})

export default fetchFlightData