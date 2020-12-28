const Flights = ({ mode, flightData }) => {
  const flights = flightData.flights
    .filter(flight => flight.locationAndStatus.flightLegStatus !== "DEL")
    .sort((flightA, flightB) => new Date(scheduledUtcOf(flightA)) - new Date(scheduledUtcOf(flightB)))
  const flightRows = flights.map(flight => {
    const time = new Date(scheduledUtcOf(flight))
    const from = destinationOf(flight)
    const flightId = flight.flightId
    const remarks = flight.remarksSwedish.length > 0 ? flight.remarksSwedish[flight.remarksSwedish.length - 1].text : ""
    return (
      <FlightRow
        key={`${mode}-${time.toISOString()}-${flightId}`}
        time={time}
        from={from}
        flightId={flightId}
        remarks={remarks}
      />
    )
  })
  return (
    <table>
    <thead>
        <tr>
        <th>Tid</th>
        <th>{mode === "arrivals" ? "Från" : "Till"}</th>
        <th>Flygnr</th>
        <th>Anmärkning</th>
        </tr>
    </thead>
    <tbody>
        {flightRows}
    </tbody>
    </table>
  );
}

const scheduledUtcOf = (flight) => flight.arrivalTime ? flight.arrivalTime.scheduledUtc : flight.departureTime.scheduledUtc
const destinationOf = (flight) => flight.departureAirportSwedish || flight.arrivalAirportSwedish

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

export default Flights;
