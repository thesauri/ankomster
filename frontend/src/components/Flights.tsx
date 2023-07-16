import { formatInTimeZone } from "date-fns-tz"

export const Flights = ({
    flights,
    type
}: {
    flights: {
        timestamp: string;
        airport: string;
        flightNumber: string;
        remarks?: string;
    }[],
    type: Type
}) => {
    const flightRows = flights
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((flight) => (
            <FlightRow
                key={`${type}-${flight.timestamp}-${flight.flightNumber}`}
                time={new Date(flight.timestamp)}
                flightNumber={flight.flightNumber}
                place={flight.airport}
                remarks={flight.remarks ?? ""} />
        ))


    return (
        <table>
            <FlightHeader type={type} />
            <tbody>
                {flightRows}
            </tbody>
        </table>
    )
}

const FlightHeader = ({ type }: { type: Type }) => (
    <thead>
        <tr>
            <th>Tid</th>
            <th>{type === "arrivals" ? "Från" : "Till"}</th>
            <th>Flygnr</th>
            <th>Anmärkning</th>
        </tr>
    </thead>
)

const FlightRow = ({
    time,
    place,
    flightNumber,
    remarks
}: {
    time: Date,
    place: string,
    flightNumber: string,
    remarks: string
}) => {
    const formattedTime = formatInTimeZone(time, "Europe/Stockholm", "HH:mm")

    return (
        <tr>
            <td>{formattedTime}</td>
            <td>{place}</td>
            <td>{flightNumber}</td>
            <td>{remarks}</td>
        </tr>
    )
}

export type Type = "arrivals" | "departures"