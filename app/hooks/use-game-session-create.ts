import * as fs from "firebase/firestore";
import * as React from "react";
import { z } from "zod";
import { createGameSessionConverterForCreate } from "~/firestore/game-session";
import { useAuth } from "~/hooks/use-auth";
import { useFirebase } from "~/hooks/use-firebase";
import {
  GameSessionBuyinBb,
  GameSessionName,
  GameSessionRate,
} from "~/models/game-session";

export const GameSessionInput = z.object({
  name: GameSessionName,
  buyinBb: GameSessionBuyinBb,
  rate: GameSessionRate,
});

export function useGameSessionCreate() {
  const { firestore } = useFirebase();
  const { myself } = useAuth();

  const create = React.useCallback(
    async ({ input }: { input: z.infer<typeof GameSessionInput> }) => {
      await fs.addDoc(
        fs
          .collection(firestore, "gameSessions")
          .withConverter(createGameSessionConverterForCreate({ firestore })),
        {
          name: input.name,
          startedAt: fs.serverTimestamp(),
          endedAt: null,
          buyinBb: input.buyinBb,
          rate: input.rate,
          creatorId: myself.id,
        }
      );
    },
    [firestore]
  );

  return { create };
}
