import { Request, Response } from "express";
import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, test, expect, vi } from "vitest";
import { AirportController } from "./airport-controller.js";
import { ErrorController } from "./error-controller.js";
import { SqliteSwedaviaFlightsCache } from "../models/sqlite-swedavia-flights-cache.js";
import { getCurrentDateInSwedenYYYMMdd } from "../utils/dates.js";

describe("get", () => {
  const errorController = new ErrorController();

  test("sets 404 if parameters are missing", async () => {
    const airportController = new AirportController(
      new SqliteSwedaviaFlightsCache(await getTemporarySqliteFilePath()),
      errorController,
    );

    const response = {
      status: vi.fn().mockReturnThis(),
      render: vi.fn(),
    } as unknown as Response;
    airportController.get({} as Request, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.render).toHaveBeenCalledWith("404");
  });

  test("renders an empty page if no flights are missing from the cache", async () => {
    const airportController = new AirportController(
      new SqliteSwedaviaFlightsCache(await getTemporarySqliteFilePath()),
      errorController,
    );

    const response = {
      setHeader: vi.fn(),
      render: vi.fn(),
    } as unknown as Response;
    airportController.get(
      {
        params: {
          iataCode: "GOT",
          direction: "arrivals",
        },
        query: {},
      } as unknown as Request,
      response,
    );

    expect(response.render).toHaveBeenCalledWith(
      "airport",
      expect.objectContaining({
        flights: expect.any(Array),
      }),
    );
  });

  test("renders flights from the cache", async () => {
    const flightsCache = new SqliteSwedaviaFlightsCache(await getTemporarySqliteFilePath())
    const airportController = new AirportController(
      flightsCache,
      errorController,
    );

    const response = {
      setHeader: vi.fn(),
      render: vi.fn(),
    } as unknown as Response;

    flightsCache.upsert("GOT", getCurrentDateInSwedenYYYMMdd(), "arrivals", [{
      timestamp: `${getCurrentDateInSwedenYYYMMdd()}T00:00:00.000Z`,
      airport: "ARN",
      flightNumber: "SK67",
      flightLegStatus: ""
    }], "")

    airportController.get(
      {
        params: {
          iataCode: "GOT",
          direction: "arrivals",
        },
        query: {},
      } as unknown as Request,
      response,
    );

    expect(response.render).toHaveBeenCalledWith(
      "airport",
      expect.objectContaining({
        flights: []
      }),
    );
  })
});

const getTemporarySqliteFilePath = async () => {
  const randomTmpDirectory = await mkdtemp(
    join(tmpdir(), "airport-controller-test-"),
  );
  return join(randomTmpDirectory, "db.sqlite3");
};
