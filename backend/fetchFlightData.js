import assert from "assert"
import https from "https"
import process from "process"
import { Semaphore } from "await-semaphore"

const API_KEY = process.env.API_KEY
assert(API_KEY, "Missing Swedavia API key as API_KEY environment variable")

let flightDataCache = null
let flightDataLastUpdated = null
const CACHE_REFRESH_INTERVAL = 60 * 1000
const cacheUpdateSemaphore = new Semaphore(1)

const fetchFlightData = async (airportIATA) => {
    if (flightDataCache &&
        Date.now() - flightDataLastUpdated.getTime() < CACHE_REFRESH_INTERVAL) {
        console.log("Using cache")
        return flightDataCache
    }

    const release = await cacheUpdateSemaphore.acquire()

    if (flightDataCache &&
        Date.now() - flightDataLastUpdated.getTime() < CACHE_REFRESH_INTERVAL) {
        // Flight data was already fetched by someone else while we waited for the lock, just return the cached data
        console.log("Flight data already fetched, using cache")
        release()
        return flightDataCache
    }

    console.log("Fetching fresh data from Swedavia")
    const arrivals = fetch(airportIATA, "arrivals")
    const departures = fetch(airportIATA, "departures")
    const arrivalsAndDepartures = await Promise.all([arrivals, departures])
    flightDataCache = {
        arrivals: arrivalsAndDepartures[0],
        departures: arrivalsAndDepartures[1]
    }
    flightDataLastUpdated = new Date()

    release()

    return flightDataCache
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