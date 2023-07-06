import { Flights } from "./Flights.js"
import "./App.css"
import { Link, useNavigate, useParams } from "react-router-dom"
import { SupportedAirportsSchema } from "./useFlightData.js"

export const App = ({ mode = "arrivals" }: { mode: "arrivals" | "departures"}) => {
  const arrivalsClasses = ["nav-item", mode !== "arrivals" && "inactive"].filter(x => x).join(" ")
  const departuresClasses = ["nav-item", mode !== "departures" && "inactive"].filter(x => x).join(" ")
  const { airportIata: airportIataRaw } = useParams()
  const navigate = useNavigate()

  const airportIata = SupportedAirportsSchema.safeParse(airportIataRaw)

  if (!airportIata.success) {
    navigate("/");
    return null;
  }

  return (
    <>
      <header>
        <h1 className="airport">{airportIata.data}</h1>
        <nav>
          <Link to={`/${airportIata.data}/arrivals`}>
            <h2 className={arrivalsClasses}>
              Ankomster
            </h2>
          </Link>
          <Link to={`/${airportIata.data}/departures`}>
            <h2 className={departuresClasses}>
              Avgångar
            </h2>
          </Link>
          <Link to={`/`}>
            <h2 className="nav-item inactive">
              Byt flygplats
            </h2>
          </Link>
        </nav>
      </header>
      <Flights mode={mode} airportIata={airportIata.data} />
    </>
  )
}

