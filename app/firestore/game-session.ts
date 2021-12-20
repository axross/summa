import * as fs from "firebase/firestore";
import { z } from "zod";
import { GameSession } from "~/models/game-session";
import { ISO8601DateString } from "~/models/iso8601";
import { DocumentReference, FieldValue } from "./common";

const GameSessionData = z.object({
  name: GameSession.shape.name,
  buyinBb: GameSession.shape.buyinBb,
  rate: GameSession.shape.rate,
  startedAt: z.instanceof(fs.Timestamp),
  endedAt: z.nullable(z.instanceof(fs.Timestamp)),
  creator: z.instanceof(DocumentReference),
});

export function createGameSessionConverter({
  firestore: db,
}: {
  firestore: fs.Firestore;
}): fs.FirestoreDataConverter<GameSession> {
  return {
    fromFirestore: (snapshot) => {
      const data = GameSessionData.parse(snapshot.data());

      return {
        id: snapshot.id,
        name: data.name,
        startedAt: data.startedAt.toDate(),
        endedAt: data.endedAt ? data.endedAt.toDate() : null,
        buyinBb: data.buyinBb,
        rate: data.rate,
        creatorId: data.creator.id,
      };
    },
    toFirestore: (partialGameSession) => {
      GameSession.partial().parse(partialGameSession);

      return {
        name: partialGameSession.name,
        startedAt:
          partialGameSession.startedAt instanceof Date
            ? fs.Timestamp.fromDate(partialGameSession.startedAt)
            : partialGameSession.startedAt,
        endedAt:
          partialGameSession.endedAt instanceof Date
            ? fs.Timestamp.fromDate(partialGameSession.endedAt)
            : partialGameSession.endedAt,
        buyinBb: partialGameSession.buyinBb,
        rate: partialGameSession.rate,
        creator:
          typeof partialGameSession.creatorId === "string"
            ? fs.doc(db, "users", partialGameSession.creatorId)
            : partialGameSession.creatorId,
      };
    },
  };
}

const GameSessionCreateInput = GameSession.omit({
  id: true,
  startedAt: true,
  endedAt: true,
}).extend({
  startedAt: z.union([z.instanceof(FieldValue), z.instanceof(Date)]),
  endedAt: z.union([z.instanceof(FieldValue), z.instanceof(Date), z.null()]),
});

export function createGameSessionConverterForCreate({
  firestore: db,
}: {
  firestore: fs.Firestore;
}): fs.FirestoreDataConverter<z.infer<typeof GameSessionCreateInput>> {
  return {
    fromFirestore: (): any => {
      throw new Error(
        "gameSessionConverterForCreate doesn't support deserialization."
      );
    },
    toFirestore: (partialGameSession) => {
      console.log(partialGameSession);

      GameSessionCreateInput.partial().parse(partialGameSession);

      return {
        name: partialGameSession.name,
        startedAt:
          partialGameSession.startedAt instanceof Date
            ? fs.Timestamp.fromDate(partialGameSession.startedAt)
            : partialGameSession.startedAt,
        endedAt:
          partialGameSession.endedAt instanceof Date
            ? fs.Timestamp.fromDate(partialGameSession.endedAt)
            : partialGameSession.endedAt,
        buyinBb: partialGameSession.buyinBb,
        rate: partialGameSession.rate,
        creator:
          typeof partialGameSession.creatorId === "string"
            ? fs.doc(db, "users", partialGameSession.creatorId)
            : partialGameSession.creatorId,
        players: [],
      };
    },
  };
}
