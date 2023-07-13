import { z } from "zod"

const isDev = process.env.NODE_ENV !== "production"

const EnvVariableSchema = z.object({
    SWEDAVIA_API_KEY: z.string(),
    SWEDAVIA_BASE_URL: z.string(),
})

const developmentValues = {
    SWEDAVIA_API_KEY: "mock",
    SWEDAVIA_BASE_URL: "http://localhost:8080/mocks/swedavia/"
}

export const env = EnvVariableSchema.parse(
    {...isDev ? developmentValues : {}, ...process.env }
)