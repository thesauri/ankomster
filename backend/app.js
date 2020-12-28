import express from "express"
import morgan from "morgan"
import fetchFlightData from "./fetchFlightData.js"

const PORT = 8080

const app = express()

app.use(morgan("short"))

app.get("/:airportIATA", async (request, response) => {
    const { airportIATA } = request.params
    if (!["ARN", "GOT", "BRA", "MMX", "LLA", "UME", "OSD", "VBY", "RNB", "KRN"].includes(airportIATA)) {
        response.status(404).send(`Invalid airport IATA: ${airportIATA}`)
        return
    }
    const flightData = await fetchFlightData(airportIATA)
    response.set("Access-Control-Allow-Origin", "*")
    response.json(flightData)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})