import { z } from "zod"

const SwedaviaAirportsSchema = z.union([
    z.literal("ARN"),
    z.literal("GOT"),
    z.literal("BMA"),
    z.literal("MMX"),
    z.literal("LLA"),
    z.literal("UME"),
    z.literal("OSD"),
    z.literal("VBY"),
    z.literal("RNB"),
    z.literal("KRN"),
])
export type SwedaviaAirports = z.infer<typeof SwedaviaAirportsSchema>

const FlightSchema = z.object({
    timestamp: z.string(),
    airport: z.string(),
    flightNumber: z.string(),
    remarks: z.string().optional(),
})
export type Flight = z.infer<typeof FlightSchema>

const AirportFlightsSchema = z.object({
    arrivals: z.array(FlightSchema),
    departures: z.array(FlightSchema),
})
export type AirportFlights = z.infer<typeof AirportFlightsSchema>

export const FlightDataSchema = z.record(
    SwedaviaAirportsSchema,
    AirportFlightsSchema
)
export type FlightData = z.infer<typeof FlightDataSchema>
