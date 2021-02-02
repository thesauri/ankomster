import Flights from "./Flights.js"
import "./App.css"
import { Link, useParams } from "react-router-dom"
import Page from "./Page"
import useFlightData from "./useFlightData.js"

const App = ({ airport, mode = "arrivals" }) => {
  const arrivalsClasses = ["nav-item", mode !== "arrivals" && "inactive"].filter(x => x).join(" ")
  const departuresClasses = ["nav-item", mode !== "departures" && "inactive"].filter(x => x).join(" ")
  const { airportIATA } = useParams()
  const [flightData, fetchError] = useFlightData(airportIATA)

  return (
    <Page>
      <header className="header">
        <h1 className="airport">{airportIATA}</h1>
        <nav>
          <Link to={`/${airportIATA}/arrivals`}>
            <h2 className={arrivalsClasses}>
              Ankomster
            </h2>
          </Link>
          <Link to={`/${airportIATA}/departures`}>
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
      <Flights mode={mode} flightData={flightData} fetchError={fetchError} />
    </Page>
  );
}

export default App;
