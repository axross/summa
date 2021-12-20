import { z } from "zod";
import { UserId } from "./user";

export const GameSessionId = z.string().nonempty();

export type GameSessionId = z.infer<typeof GameSessionId>;

export const GameSessionName = z.string().nonempty().max(255);

export type GameSessionName = z.infer<typeof GameSessionName>;

export const GameSessionBuyinBb = z.number().int().gte(1);

export type GameSessionBuyinBb = z.infer<typeof GameSessionBuyinBb>;

export const GameSessionRate = z.number().gt(0);

export type GameSessionRate = z.infer<typeof GameSessionRate>;

export const GameSession = z.object({
  id: GameSessionId,
  name: GameSessionName,
  startedAt: z.instanceof(Date),
  endedAt: z.nullable(z.instanceof(Date)),
  buyinBb: GameSessionBuyinBb,
  rate: GameSessionRate,
  creatorId: UserId,
});

export type GameSession = z.infer<typeof GameSession>;
