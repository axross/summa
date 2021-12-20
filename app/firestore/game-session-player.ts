import * as fs from "firebase/firestore";
import { z } from "zod";
import { GameSessionPlayer } from "~/models/game-session-player";
import { DocumentReference } from "./common";

const GameSessionPlayerDataRuntype = z.object({
  gameSession: z.instanceof(DocumentReference),
  user: z.instanceof(DocumentReference),
  buyins: GameSessionPlayer.shape.buyins,
  stackBb: GameSessionPlayer.shape.stackBb,
});

export function createGameSessionPlayerConverter({
  firestore: db,
}: {
  firestore: fs.Firestore;
}): fs.FirestoreDataConverter<GameSessionPlayer> {
  return {
    fromFirestore: (snapshot) => {
      const data = GameSessionPlayerDataRuntype.parse(snapshot.data());

      return {
        gameSessionId: data.gameSession.id,
        userId: data.user.id,
        buyins: data.buyins,
        stackBb: data.stackBb,
      };
    },
    toFirestore: (partialGameSession) => {
      const checked = GameSessionPlayer.partial().parse(partialGameSession);

      return {
        gameSession:
          typeof checked.gameSessionId === "string"
            ? fs.doc(db, "gameSessions", checked.gameSessionId)
            : checked.gameSessionId,
        user:
          typeof checked.userId === "string"
            ? fs.doc(db, "users", checked.userId)
            : checked.userId,
        buyins: checked.buyins,
        stackBb: checked.stackBb,
      };
    },
  };
}
