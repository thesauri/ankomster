import {
  SwedaviaAirports,
  SwedaviaAirportsSchema,
} from "../services/swedavia-airports.js";
import { z } from "zod";
import { Request, Response } from "express";
import { SqliteSwedaviaFlightsCache } from "../models/sqlite-swedavia-flights-cache.js";
import { formatInTimeZone } from "date-fns-tz";
import { sv } from "date-fns/locale";
import { ErrorController } from "./error-controller.js";
import {
  getCurrentDateInSwedenYYYMMdd,
  getTomorrowsDateInSwedenYYYMMdd,
} from "../utils/dates.js";

export class AirportController {
  private swedaviaFlightsCache: SqliteSwedaviaFlightsCache;
  private errorController: ErrorController;

  constructor(
    swedaviaFlightsCache: SqliteSwedaviaFlightsCache,
    errorController: ErrorController,
  ) {
    this.swedaviaFlightsCache = swedaviaFlightsCache;
    this.errorController = errorController;

    this.all = this.all.bind(this);
    this.flights = this.flights.bind(this);
    this.get = this.get.bind(this);
  }

  all(req: Request, res: Response): void {
    const { direction } = z
      .object({ direction: DirectionSchema })
      .parse(req.query);
    const title = getTitleForDirection(direction);
    const airports = SwedaviaAirports.getAllAirports().map(
      ({ iataCode, name }) => ({
        href: `/airports/${iataCode}?direction=${direction}`,
        label: name,
      }),
    );

    // Cache the home page with some margin from the typical session length (1 to 2 minutes)
    // for quick navigation back home.
    // Re-use cached data even when stale for a day. This should lead to quick page loading
    // for subsequent visits on the same flight (no flights are this long).
    res.setHeader(
      "Cache-Control",
      "public, max-age=600, stale-while-revalidate=604800",
    );

    res.render("index", {
      airports,
      direction,
      title,
    });
  }

  async get(req: Request, res: Response) {
    try {
      const params = z
        .object({
          iataCode: SwedaviaAirportsSchema,
        })
        .safeParse(req.params);

      if (!params.success) {
        this.errorController.status404NotFound(req, res);
        return;
      }

      const { iataCode: iataCode } = params.data;

      const { direction, filter } = z
        .object({
          direction: DirectionSchema,
          filter: FilterSchema,
        })
        .parse(req.query);

      const flights = this.getFlightsForAirport(iataCode, direction, filter);

      const homeHref =
        direction === "arrivals"
          ? "/?direction=arrivals"
          : "/?direction=departures";

      const title = getTitleForDirection(direction);
      const switchDirection =
        direction === "arrivals"
          ? {
              label: "Se avgångar",
              href: "?direction=departures",
            }
          : {
              label: "Se ankomster",
              href: "?direction=arrivals",
            };
      const oldFlights =
        filter !== "all"
          ? {
              href: `?direction=${direction}&filter=all`,
            }
          : undefined;

      const refreshFlightsUrl = `/airports/${iataCode}/flights?direction=${direction}&filter=${filter}`;

      const schemaItemProps = getSchemaItemProps(direction);

      const airportName = SwedaviaAirports.getName(iataCode);

      const metaDescription = `Ankomst- och avgångstider för ${airportName} flygplats. Uppdateras live varje minut. Inga annonser - endast aktuell flyginformation.`;

      res.setHeader("Cache-Control", "public, max-age=30");

      res.render("airport", {
        airportCode: params,
        airportName,
        homeHref,
        flights,
        oldFlights,
        refreshFlightsUrl,
        switchDirection,
        title,
        schemaItemProps,
        metaDescription,
      });
    } catch (error) {
      console.error("Error fetching flight data:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async flights(req: Request, res: Response) {
    try {
      const params = z
        .object({
          iataCode: SwedaviaAirportsSchema,
        })
        .safeParse(req.params);

      if (!params.success) {
        this.errorController.status404NotFound(req, res);
        return;
      }

      const { iataCode: iataCode } = params.data;

      const { direction, filter } = z
        .object({
          direction: DirectionSchema,
          filter: FilterSchema,
        })
        .parse(req.query);

      const flights = this.getFlightsForAirport(iataCode, direction, filter);
      const schemaItemProps = getSchemaItemProps(direction);

      // This is refreshed every 30 seconds by the frontend, use half the time to avoid
      // race conditions where refreshes hit the cache
      res.set("Cache-Control", "public, max-age=15");

      res.render("partials/flights", {
        flights,
        schemaItemProps,
      });
    } catch (error) {
      console.error("Error fetching flight data:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  private getFlightsForAirport(
    iataCode: SwedaviaAirports,
    direction: Direction,
    filter: Filter,
  ) {
    const currentDateInSweden = getCurrentDateInSwedenYYYMMdd();
    const tomorrowsDateInSweden = getTomorrowsDateInSwedenYYYMMdd();

    const { flights: flightsToday } = this.swedaviaFlightsCache.get(
      iataCode,
      currentDateInSweden,
      direction,
    );
    const { flights: flightsTomorrow } = this.swedaviaFlightsCache.get(
      iataCode,
      tomorrowsDateInSweden,
      direction,
    );
    flightsToday.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    flightsTomorrow.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    const cutOffTime =
      filter === "all" ? 0 : new Date().getTime() - 60 * 60 * 1_000;
    const tomorrowsDateAsDagenDenXMonth = formatInTimeZone(
      tomorrowsDateInSweden,
      "Europe/Stockholm",
      "EEEE'en den' d MMMM",
      { locale: sv },
    );
    const capitalizedTomorrowsDate =
      tomorrowsDateAsDagenDenXMonth.charAt(0).toUpperCase() +
      tomorrowsDateAsDagenDenXMonth.slice(1);

    return [
      ...flightsToday,
      {
        type: "divider",
        text: capitalizedTomorrowsDate,
      },
      ...flightsTomorrow,
    ].filter(
      (departure) =>
        "type" in departure ||
        (departure.flightLegStatus !== "DEL" &&
          new Date(departure.timestamp).getTime() > cutOffTime),
    );
  }
}

const DirectionSchema = z.enum(["arrivals", "departures"]).default("arrivals");
type Direction = z.infer<typeof DirectionSchema>;
const FilterSchema = z.enum(["all", "none"]).default("none");
type Filter = z.infer<typeof FilterSchema>;

const getTitleForDirection = (direction: Direction) => {
  switch (direction) {
    case "arrivals":
      return "Ankomster";
    case "departures":
      return "Avgångar";
  }
};

const getSchemaItemProps = (direction: Direction) => {
  return {
    time: direction === "arrivals" ? "arrivalTime" : "departureTime",
    airport: direction === "arrivals" ? "arrivalAirport" : "departureAirport",
  };
};
