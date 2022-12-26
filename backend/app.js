import express from "express"
import morgan from "morgan"
import path from "path"
import fetchFlightData, { refreshAllFlightData, swedaviaAirports } from "./fetchFlightData.js"
import { redirectToHttps } from "./redirectToHttps.js"

const PORT = process.env.PORT || 8080

const app = express()

if (process.env.NODE_ENV === "production") {
    app.use(redirectToHttps)
}

app.use(morgan("short"))

app.use(express.static("public"))

app.get("/api/:airportIATA", async (request, response) => {
    const { airportIATA } = request.params
    if (!swedaviaAirports.includes(airportIATA)) {
        response.status(404).send(`Invalid airport IATA: ${airportIATA}`)
        return
    }
    const flightData = await fetchFlightData(airportIATA)
    response.json(flightData)
})

app.get("*", (request, response) => {
    refreshAllFlightData()
    response.sendFile(path.resolve("public", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

console.log("Preloading flight data...")
refreshAllFlightData()

setInterval(() => {
    console.log(`Refreshing all flight data...`)
    refreshAllFlightData()
}, 2 * 60 * 1_000)
