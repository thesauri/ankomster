import { Flights } from "../components/Flights.js"
import styles from "./AirportInformation.module.css"
import { Link, useNavigate, useParams } from "react-router-dom"
import { SupportedAirportsSchema } from "../hooks/useFlightData.js"

export const AirportInformation = ({ mode = "arrivals" }: { mode: "arrivals" | "departures"}) => {
  const { airportIata: airportIataRaw } = useParams()
  const navigate = useNavigate()

  const airportIata = SupportedAirportsSchema.safeParse(airportIataRaw)

  if (!airportIata.success) {
    navigate("/");
    return null;
  }

  return (
    <article>
      <nav className={styles.nav}>
        {mode === "arrivals" ? (
          <h2 className={styles.inactiveNavItem}>Ankomster</h2>
        ) : (
          <Link to={`/airports/${airportIata.data}/arrivals`} replace={true}>
            <h2 className={styles.activeNavItem}>
              Ankomster
            </h2>
          </Link>
        )}
        {mode === "departures" ? (
          <h2 className={styles.inactiveNavItem}>Avgångar</h2>
        ) : (
          <Link to={`/airports/${airportIata.data}/departures`} replace={true}>
            <h2 className={styles.activeNavItem}>
              Avgångar
            </h2>
          </Link>
        )}
      </nav>
      <Flights mode={mode} airportIata={airportIata.data} />
    </article>
  )
}

