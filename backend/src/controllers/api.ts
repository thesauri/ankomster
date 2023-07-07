import { Router } from "express";
import { flightData } from "../services/flightData.js"

export const apiRouter = Router();

apiRouter.get("/flights/all", (request, response) => {
    const currentFlightDataCache = flightData
    if (currentFlightDataCache === null) {
        response.status(503).send("Flight data not yet loaded")
        return
    }
    response.json(currentFlightDataCache)
})
