import {
  SwedaviaResponse,
  SwedaviaResponseSchema,
} from "./swedavia-flights-client.interface.js";
import got from "got";
import { logger } from "../utils/logger.js";
import { env } from "../utils/env.js";

const get = async (
  airportIata: string,
  mode: "arrivals" | "departures",
  dateYYYYMMDD: string,
): Promise<SwedaviaResponse> => {
  logger.debug(
    { airportIATA: airportIata, mode, dateYYYYMMDD },
    `Fetching ${mode} for ${airportIata} on ${dateYYYYMMDD} from Swedavia`,
  );

  const response = await swedaviaGot
    .get(`flightinfo/v2/${airportIata}/${mode}/${dateYYYYMMDD}`)
    .json();
  return SwedaviaResponseSchema.parse(response);
};

const swedaviaGot = got.extend({
  prefixUrl: "https://api.swedavia.se/",
  headers: {
    Accept: "application/json",
    "Cache-Control": "nocache",
    "Ocp-Apim-Subscription-Key": env.SWEDAVIA_API_KEY,
  },
});

export const SwedaviaFlightsClient = {
  get,
};
