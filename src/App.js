import flightsUME20201228 from "./flights-UME-2020-12-28";

const FlightRow = ({time, from, flightId, remarks}) => {
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`
  return (
    <tr>
      <td>{formattedTime}</td>
      <td>{from}</td>
      <td>{flightId}</td>
      <td>{remarks}</td>
    </tr>
  )
}

function App() {
  const flights = flightsUME20201228.flights
    .filter(flight => flight.locationAndStatus.flightLegStatus !== "DEL")
    .sort((flightA, flightB) => new Date(flightA.arrivalTime.scheduledUtc) - new Date(flightB.arrivalTime.scheduledUtc))
  const flightRows = flights.map(flight => {
    const time = new Date(flight.arrivalTime.scheduledUtc)
    const from = flight.departureAirportSwedish
    const flightId = flight.flightId
    const remarks = flight.remarksSwedish.length > 0 ? flight.remarksSwedish[flight.remarksSwedish.length - 1].text : ""
    return (
      <FlightRow key={flightId} time={time} from={from} flightId={flightId} remarks={remarks} />
    )
  })
  return (
    <div>
      <header>
        <h1>Ankomster</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>Tid</th>
            <th>Från</th>
            <th>Flygnr</th>
            <th>Anmärkning</th>
          </tr>
        </thead>
        <tbody>
          {flightRows}
        </tbody>
      </table>
    </div>
  );
}

export default App;
