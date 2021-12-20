import * as fs from "firebase/firestore";
import * as React from "react";
import { createGameSessionPlayerConverter } from "~/firestore/game-session-player";
import { useFirebase } from "~/hooks/use-firebase";
import { GameSessionId } from "~/models/game-session";
import { GameSessionPlayer } from "~/models/game-session-player";
import { UserId } from "~/models/user";

export function useGameSessionPlayerUpdate({
  gameSessionId,
  playerId,
}: {
  gameSessionId: GameSessionId;
  playerId: UserId;
}) {
  const { firestore } = useFirebase();

  const updateStackBb = React.useCallback(
    async (stackBb: GameSessionPlayer["stackBb"]) => {
      await fs.updateDoc(
        fs
          .doc(firestore, "gameSessions", gameSessionId, "players", playerId)
          .withConverter(createGameSessionPlayerConverter({ firestore })),
        { stackBb }
      );
    },
    [firestore]
  );

  const updateBuyins = React.useCallback(
    async (buyins: GameSessionPlayer["buyins"]) => {
      await fs.updateDoc(
        fs
          .doc(firestore, "gameSessions", gameSessionId, "players", playerId)
          .withConverter(createGameSessionPlayerConverter({ firestore })),
        { buyins }
      );
    },
    [firestore]
  );

  return { updateStackBb, updateBuyins };
}
