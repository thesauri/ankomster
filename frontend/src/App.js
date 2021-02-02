import Flights from "./Flights.js"
import "./App.css"
import { Link, useParams } from "react-router-dom"
import Page from "./Page"
import useFlightData from "./useFlightData.js"

const App = ({ mode = "arrivals" }) => {
  const arrivalsClasses = ["header", mode !== "arrivals" && "inactive"].filter(x => x).join(" ")
  const departuresClasses = ["header", mode !== "departures" && "inactive"].filter(x => x).join(" ")
  const { airportIATA } = useParams()
  const [flightData, fetchError] = useFlightData(airportIATA)

  return (
    <Page>
      <header>
        <Link to={`/${airportIATA}/arrivals`}>
          <h1 className={arrivalsClasses}>
            Ankomster
          </h1>
        </Link>
        <Link to={`/${airportIATA}/departures`}>
          <h1 className={departuresClasses}>
            Avgångar
          </h1>
        </Link>
      </header>
      <Flights mode={mode} flightData={flightData} fetchError={fetchError} />
    </Page>
  );
}

export default App;
