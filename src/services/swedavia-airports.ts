import {z} from "zod"

const getAllAirports = (): { iataCode: string, name: string}[] => {
    return Object.entries(namesByIataCode)
        .map(([iataCode, name]) => ({ iataCode, name }))
}
const getName = (iataCode: SwedaviaAirports) => namesByIataCode[iataCode]

export const SwedaviaAirports = {
    getAllAirports,
    getName
}

export const SwedaviaAirportsSchema = z.union([
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

const namesByIataCode = {
    ARN: "Stockholm Arlanda",
    GOT: "Göteborg Landvetter",
    BMA: "Stockholm Bromma",
    MMX: "Malmö Sturup",
    LLA: "Luleå",
    UME: "Umeå",
    OSD: "Östersund",
    VBY: "Visby",
    RNB: "Ronneby",
    KRN: "Kiruna"
}
