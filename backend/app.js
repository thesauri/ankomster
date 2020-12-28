import express from "express"
import fs from "fs/promises"
import morgan from "morgan"

const PORT = 8080

const app = express()

app.use(morgan("short"))

app.get("/ARN", async (request, response) => {
    const arrivals = JSON.parse(await fs.readFile("./arrivals-ARN-2020-12-28.json", "utf8"))
    const departures = JSON.parse(await fs.readFile("./departures-ARN-2020-12-28.json", "utf8"))
    response.set("Access-Control-Allow-Origin", "*")
    response.json({ arrivals, departures })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})