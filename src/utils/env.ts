import { z } from "zod"

const EnvVariableSchema = z.object({
    SWEDAVIA_API_KEY: z.string(),
})

export const env = EnvVariableSchema.parse(
    process.env
)
