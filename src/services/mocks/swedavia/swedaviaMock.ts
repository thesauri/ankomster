import ArnDepartures20230707 from "./fixtures/2023-07-07-ARN-departures.json" assert { type: "json" }
import ArnDepartures20230708 from "./fixtures/2023-07-08-ARN-departures.json" assert { type: "json" }
import BmaDepartures20230707 from "./fixtures/2023-07-07-BMA-departures.json" assert { type: "json" }
import BmaDepartures20230708 from "./fixtures/2023-07-08-BMA-departures.json" assert { type: "json" }
import GotDepartures20230707 from "./fixtures/2023-07-07-GOT-departures.json" assert { type: "json" }
import GotDepartures20230708 from "./fixtures/2023-07-08-GOT-departures.json" assert { type: "json" }
import KrnDepartures20230707 from "./fixtures/2023-07-07-KRN-departures.json" assert { type: "json" }
import KrnDepartures20230708 from "./fixtures/2023-07-08-KRN-departures.json" assert { type: "json" }
import LlaDepartures20230707 from "./fixtures/2023-07-07-LLA-departures.json" assert { type: "json" }
import LlaDepartures20230708 from "./fixtures/2023-07-08-LLA-departures.json" assert { type: "json" }
import MmxDepartures20230707 from "./fixtures/2023-07-07-MMX-departures.json" assert { type: "json" }
import MmxDepartures20230708 from "./fixtures/2023-07-08-MMX-departures.json" assert { type: "json" }
import OsdDepartures20230707 from "./fixtures/2023-07-07-OSD-departures.json" assert { type: "json" }
import OsdDepartures20230708 from "./fixtures/2023-07-08-OSD-departures.json" assert { type: "json" }
import RnbDepartures20230707 from "./fixtures/2023-07-07-RNB-departures.json" assert { type: "json" }
import RnbDepartures20230708 from "./fixtures/2023-07-08-RNB-departures.json" assert { type: "json" }
import UmeDepartures20230707 from "./fixtures/2023-07-07-UME-departures.json" assert { type: "json" }
import UmeDepartures20230708 from "./fixtures/2023-07-08-UME-departures.json" assert { type: "json" }
import VbyDepartures20230707 from "./fixtures/2023-07-07-VBY-departures.json" assert { type: "json" }
import VbyDepartures20230708 from "./fixtures/2023-07-08-VBY-departures.json" assert { type: "json" }
import ArnArrivals20230707 from "./fixtures/2023-07-07-ARN-arrivals.json" assert { type: "json" }
import ArnArrivals20230708 from "./fixtures/2023-07-08-ARN-arrivals.json" assert { type: "json" }
import BmaArrivals20230707 from "./fixtures/2023-07-07-BMA-arrivals.json" assert { type: "json" }
import BmaArrivals20230708 from "./fixtures/2023-07-08-BMA-arrivals.json" assert { type: "json" }
import GotArrivals20230707 from "./fixtures/2023-07-07-GOT-arrivals.json" assert { type: "json" }
import GotArrivals20230708 from "./fixtures/2023-07-08-GOT-arrivals.json" assert { type: "json" }
import KrnArrivals20230707 from "./fixtures/2023-07-07-KRN-arrivals.json" assert { type: "json" }
import KrnArrivals20230708 from "./fixtures/2023-07-08-KRN-arrivals.json" assert { type: "json" }
import LlaArrivals20230707 from "./fixtures/2023-07-07-LLA-arrivals.json" assert { type: "json" }
import LlaArrivals20230708 from "./fixtures/2023-07-08-LLA-arrivals.json" assert { type: "json" }
import MmxArrivals20230707 from "./fixtures/2023-07-07-MMX-arrivals.json" assert { type: "json" }
import MmxArrivals20230708 from "./fixtures/2023-07-08-MMX-arrivals.json" assert { type: "json" }
import OsdArrivals20230707 from "./fixtures/2023-07-07-OSD-arrivals.json" assert { type: "json" }
import OsdArrivals20230708 from "./fixtures/2023-07-08-OSD-arrivals.json" assert { type: "json" }
import RnbArrivals20230707 from "./fixtures/2023-07-07-RNB-arrivals.json" assert { type: "json" }
import RnbArrivals20230708 from "./fixtures/2023-07-08-RNB-arrivals.json" assert { type: "json" }
import UmeArrivals20230707 from "./fixtures/2023-07-07-UME-arrivals.json" assert { type: "json" }
import UmeArrivals20230708 from "./fixtures/2023-07-08-UME-arrivals.json" assert { type: "json" }
import VbyArrivals20230707 from "./fixtures/2023-07-07-VBY-arrivals.json" assert { type: "json" }
import VbyArrivals20230708 from "./fixtures/2023-07-08-VBY-arrivals.json" assert { type: "json" }

const flightData: Record<string, { "arrivals": [unknown, unknown], "departures": [unknown, unknown] }> = {
    "ARN": {
        "arrivals": [
            ArnArrivals20230707,
            ArnArrivals20230708
        ],
        "departures": [
            ArnDepartures20230707,
            ArnDepartures20230708
        ]
    },
    "BMA": {
        "arrivals": [
            BmaArrivals20230707,
            BmaArrivals20230708
        ],
        "departures": [
            BmaDepartures20230707,
            BmaDepartures20230708
        ]
    },
    "GOT": {
        "arrivals": [
            GotArrivals20230707,
            GotArrivals20230708
        ],
        "departures": [
            GotDepartures20230707,
            GotDepartures20230708
        ]
    },
    "KRN": {
        "arrivals": [
            KrnArrivals20230707,
            KrnArrivals20230708
        ],
        "departures": [
            KrnDepartures20230707,
            KrnDepartures20230708
        ]
    },
    "LLA": {
        "arrivals": [
            LlaArrivals20230707,
            LlaArrivals20230708
        ],
        "departures": [
            LlaDepartures20230707,
            LlaDepartures20230708
        ]
    },
    "MMX": {
        "arrivals": [
            MmxArrivals20230707,
            MmxArrivals20230708
        ],
        "departures": [
            MmxDepartures20230707,
            MmxDepartures20230708
        ]
    },
    "OSD": {
        "arrivals": [
            OsdArrivals20230707,
            OsdArrivals20230708
        ],
        "departures": [
            OsdDepartures20230707,
            OsdDepartures20230708
        ]
    },
    "RNB": {
        "arrivals": [
            RnbArrivals20230707,
            RnbArrivals20230708
        ],
        "departures": [
            RnbDepartures20230707,
            RnbDepartures20230708
        ]
    },
    "UME": {
        "arrivals": [
            UmeArrivals20230707,
            UmeArrivals20230708
        ],
        "departures": [
            UmeDepartures20230707,
            UmeDepartures20230708
        ]
    },
    "VBY": {
        "arrivals": [
            VbyArrivals20230707,
            VbyArrivals20230708
        ],
        "departures": [
            VbyDepartures20230707,
            VbyDepartures20230708
        ]
    },
}

export const mockFlightDataFor = ({ airportIata, date, mode }: {
    airportIata: string;
    date: Date;
    mode: "arrivals" | "departures"
}): unknown => {
    if (!(airportIata in flightData)) throw new Error(`No flight data for ${airportIata}`)
    return flightData[airportIata][mode][date.getDate() % 2]
}