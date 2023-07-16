import { useParams } from "react-router-dom"
import { z } from "zod"
import { FlightDataSchema } from "../hooks/useFlightData.js"

export const useSelectedAirport = (): SelectedAirport => {
    const params = useParams()
    return SelectedAirportSchema.parse(params)
}

const SelectedAirportSchema = z.object({
    airportIata: FlightDataSchema.keySchema,
    type: z.union([z.literal("arrivals"), z.literal("departures")])
})

type SelectedAirport = z.infer<typeof SelectedAirportSchema>
