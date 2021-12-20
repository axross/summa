import { z } from "zod";

export const ISO8601DateString = z.string();

export type ISO8601DateString = z.infer<typeof ISO8601DateString>;
