import { z } from "zod";
import { GameSessionId } from "./game-session";
import { UserId } from "./user";

export const GameSessionPlayer = z.object({
  gameSessionId: GameSessionId,
  userId: UserId,
  buyins: z.number().int().gte(0),
  stackBb: z.number().gte(0),
});

export type GameSessionPlayer = z.infer<typeof GameSessionPlayer>;
