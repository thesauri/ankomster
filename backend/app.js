import express from "express"
import morgan from "morgan"
import path from "path"
import fetchFlightData from "./fetchFlightData.js"

const PORT = process.env.PORT || 8080

const app = express()

app.use(morgan("short"))

app.use(express.static("public"))

app.get("/api/:airportIATA", async (request, response) => {
    const { airportIATA } = request.params
    if (!["ARN", "GOT", "BMA", "MMX", "LLA", "UME", "OSD", "VBY", "RNB", "KRN"].includes(airportIATA)) {
        response.status(404).send(`Invalid airport IATA: ${airportIATA}`)
        return
    }
    const flightData = await fetchFlightData(airportIATA)
    response.json(flightData)
})

app.get("*", (request, response) => {
  response.sendFile(path.resolve("public", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
