import express from "express"
import morgan from "morgan"
import fetchFlightData from "./fetchFlightData.js"

const PORT = 8080

const app = express()

app.use(morgan("short"))

app.get("/ARN", async (request, response) => {
    const flightData = await fetchFlightData("ARN")
    response.set("Access-Control-Allow-Origin", "*")
    response.json(flightData)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})