import sqlite3 from "better-sqlite3";
import { z } from "zod";

export class SqliteSwedaviaFlightsCache {
  private db: sqlite3.Database;

  constructor(filePath: string) {
    this.db = sqlite3(filePath);
    this.db.exec(`
            CREATE TABLE IF NOT EXISTS flightData
            (
                airportIata   TEXT,
                departureDate TEXT,
                direction     TEXT,
                flights       TEXT,
                rawFlightData TEXT,
                createdAt     INTEGER NOT NULL DEFAULT (unixepoch('subsec')),
                PRIMARY KEY (airportIata, departureDate, direction)
            )
        `);
    this.db.pragma("journal_mode = WAL");
  }

  get(
    airportIata: string,
    departureDate: string,
    direction: string,
  ): {
    flights: Flight[];
  } {
    const row = this.db
      .prepare(
        `
            SELECT flights
            FROM flightData
            WHERE airportIata = ?
                AND departureDate = ?
                AND direction = ?
        `,
      )
      .get(airportIata, departureDate, direction);

    return z
      .object({
        flights: z
          .string()
          .transform((val) => JSON.parse(val))
          .pipe(z.array(FlightSchema)),
      })
      .parse(row);
  }

  upsert(
    airportIata: string,
    departureDate: string,
    direction: string,
    flights: Flight[],
    rawFlightData: unknown,
  ): void {
    const stringifiedFlights = JSON.stringify(flights);
    const stringifiedRawFlightData = JSON.stringify(rawFlightData);
    this.db
      .prepare(
        `
            INSERT INTO flightData (airportIata, departureDate, direction, flights, rawFlightData)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (airportIata, departureDate, direction)
            DO UPDATE SET flights = ?, rawFlightData = ?
        `,
      )
      .run(
        airportIata,
        departureDate,
        direction,
        stringifiedFlights,
        stringifiedRawFlightData,
        stringifiedFlights,
        stringifiedRawFlightData,
      );
  }
}

const FlightSchema = z.object({
  timestamp: z.string(),
  airport: z.string(),
  flightNumber: z.string(),
  remarks: z.string().optional(),
  flightLegStatus: z.string(),
});
export type Flight = z.infer<typeof FlightSchema>;
