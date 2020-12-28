import assert from "assert"
import https from "https"
import process from "process"

const API_KEY = process.env.API_KEY
assert(API_KEY, "Missing Swedavia API key as API_KEY environment variable")

const fetchFlightData = async (airportIATA) => {
    const arrivals = fetch(airportIATA, "arrivals")
    const departures = fetch(airportIATA, "departures")
    const arrivalsAndDepartures = await Promise.all([arrivals, departures])

    return {
        arrivals: arrivalsAndDepartures[0],
        departures: arrivalsAndDepartures[1]
    }
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