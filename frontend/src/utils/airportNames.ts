export const getAirportName = (airportIata: string): string => {
    switch (airportIata) {
    case "ARN":
        return "Stockholm Arlanda"
    case "GOT":
        return "Göteborg Landvetter"
    case "BMA":
        return "Stockholm Bromma"
    case "MMX":
        return "Malmö"
    case "LLA":
        return "Luleå"
    case "UME":
        return "Umeå"
    case "OSD":
        return "Åre Östersund"
    case "VBY":
        return "Visby"
    case "KRN":
        return "Kiruna"
    case "RNB":
        return "Ronneby"
    default:
        throw new Error(`No airport name specified for ${airportIata}`)
    }
}