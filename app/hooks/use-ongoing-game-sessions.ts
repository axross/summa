import * as fs from "firebase/firestore";
import * as React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { createGameSessionConverter } from "~/firestore/game-session";
import { useAuth } from "~/hooks/use-auth";
import { useFirebase } from "~/hooks/use-firebase";
import { GameSession } from "~/models/game-session";

export function useOngoingGameSessions() {
  const { firestore } = useFirebase();
  const { myself } = useAuth();
  const converter = React.useMemo(
    () => createGameSessionConverter({ firestore }),
    [firestore]
  );
  const [gameSessions, isLoading, error] = useCollectionData(
    fs.query<GameSession>(
      fs.collection(firestore, "gameSessions").withConverter(converter),
      // firestore.where("creator", "==", firestore.doc(db, "users", myself.id)),
      fs.where(
        "players",
        "array-contains",
        fs.doc(firestore, "users", myself.id)
      ),
      fs.where("endedAt", "==", null),
      fs.orderBy("startedAt", "desc"),
      fs.limit(5)
    )
  );

  return { gameSessions: gameSessions ?? [], error, isLoading };
}
