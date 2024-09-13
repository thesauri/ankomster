import { z } from "zod"

const BaseFlightSchema = z.object({
    flightId: z.string(),
    locationAndStatus: z.object({
        flightLegStatus: z.string(),
    }),
    remarksSwedish: z.array(
        z.object({
            text: z.string()
        })
    ),
})

const ArrivingFlightSchema = BaseFlightSchema.extend({
    departureAirportSwedish: z.string(),
    departureAirportEnglish: z.string(),
    arrivalTime: z.object({
        scheduledUtc: z.string()
    }),
})

const DepartingFlightSchema = BaseFlightSchema.extend({
    arrivalAirportEnglish: z.string(),
    arrivalAirportSwedish: z.string(),
    departureTime: z.object({
        scheduledUtc: z.string()
    }),
})

const ArrivalsSchema = z.object({
    to: z.object({
        flightArrivalDate: z.string()
    }),
    flights: z.array(ArrivingFlightSchema)
})

const DeparturesSchema = z.object({
    from: z.object({
        flightDepartureDate: z.string()
    }),
    flights: z.array(DepartingFlightSchema)
})

export const SwedaviaResponseSchema = z.union([ArrivalsSchema, DeparturesSchema])
export type SwedaviaResponse = z.infer<typeof SwedaviaResponseSchema>