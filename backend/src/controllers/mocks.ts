import { Router } from "express"
import { z } from "zod"
import { mockFlightDataFor } from "../services/mocks/swedavia/swedaviaMock.js"

export const mocksRouter = Router()

mocksRouter.get("/swedavia/flightinfo/v2/:airportIata/:mode/:date", (request, response) => {
    const { airportIata, mode, date } = FlightInfoParameterSchema.parse(request.params)
    response.json(mockFlightDataFor({ airportIata, mode, date: new Date(date) }))
})

const FlightInfoParameterSchema = z.object({
    airportIata: z.string().length(3),
    mode: z.union([z.literal("arrivals"), z.literal("departures")]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})