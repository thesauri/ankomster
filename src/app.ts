import compression from "compression";
import express, { NextFunction, Request, Response } from "express";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger.js";
import { updateSwedaviaFlightsCache } from "./jobs/update-swedavia-flights-cache.js";
import { SqliteSwedaviaFlightsCache } from "./models/sqlite-swedavia-flights-cache.js";
import { AirportController } from "./controllers/airport-controller.js";
import { ErrorController } from "./controllers/error-controller.js";
import { RedirectionController } from "./controllers/redirection-controller.js";

const PORT = process.env.PORT || 8080;
const refreshIntervalMillis = 60 * 1_000;
const app = express();
const swedaviaFlightsCache = new SqliteSwedaviaFlightsCache(
  "swedavia-flights-cache.sqlite3",
);
const errorController = new ErrorController();
const airportController = new AirportController(
  swedaviaFlightsCache,
  errorController,
);
const redirectionController = new RedirectionController();

app.set("view engine", "ejs");

app.use(pinoHttp({ logger }));

app.use(compression());

app.use(redirectionController.redirectWwwwSubdomain);

app.get("/", airportController.all);

app.get("/airports/:iataCode", airportController.get);
app.get("/airports/:iataCode/flights", airportController.flights);
app.get("/airports/:iataCode/:direction", airportController.get);

app.get("/up", (_, res) => {
  res.send("I'm up!");
});

app.get("/500", (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    throw new Error("Test error");
  }
  next();
});

app.use(errorController.status404NotFound);
app.use(errorController.status500InternalServerError);

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

const updateSwedaviaFlightsCachePeriodically = async () => {
  await updateSwedaviaFlightsCache(swedaviaFlightsCache);

  setInterval(async () => {
    await updateSwedaviaFlightsCache(swedaviaFlightsCache);
  }, refreshIntervalMillis);
};

void updateSwedaviaFlightsCachePeriodically();
