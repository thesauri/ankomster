import { describe, test, expect, vi } from "vitest";
import { AirportController } from "./airport-controller.ts";
import { ErrorController } from "./error-controller.ts";
import { SqliteSwedaviaFlightsCache } from "../models/sqlite-swedavia-flights-cache.ts";
import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

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
    };
    airportController.get({}, response);
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
    };
    airportController.get(
      {
        params: {
          iataCode: "GOT",
          direction: "arrivals",
        },
        query: {},
      },
      response,
    );

    expect(response.render).toHaveBeenCalledWith(
      "airport",
      expect.objectContaining({
        flights: expect.any(Array),
      }),
    );
  });
});

const getTemporarySqliteFilePath = async () => {
  const randomTmpDirectory = await mkdtemp(
    join(tmpdir(), "airport-controller-test-"),
  );
  return join(randomTmpDirectory, "db.sqlite3");
};
