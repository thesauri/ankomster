import Flights from "./Flights.js"
import "./App.css"
import { Link } from "react-router-dom"
import arrivalFlightData from "./arrivals-ARN-2020-12-28"
import departureFlightData from "./departures-ARN-2020-12-28"

const App = ({ mode = "arrivals" }) => {
  const arrivalsClasses = ["header", mode !== "arrivals" && "inactive"].filter(x => x).join(" ")
  const departuresClasses = ["header", mode !== "departures" && "inactive"].filter(x => x).join(" ")
  const flightData = mode === "arrivals" ? arrivalFlightData : departureFlightData
  return (
    <div>
      <header>
        <Link to="/arrivals">
          <h1 className={arrivalsClasses}>
            Ankomster
          </h1>
        </Link>
        <Link to="/departures">
          <h1 className={departuresClasses}>
            Avgångar
          </h1>
        </Link>
      </header>
      <Flights mode={mode} flightData={flightData} />
    </div>
  );
}

export default App;
