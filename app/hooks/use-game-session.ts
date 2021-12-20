import * as fs from "firebase/firestore";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { createGameSessionConverter } from "~/firestore/game-session";
import { useFirebase } from "~/hooks/use-firebase";
import { GameSessionId } from "~/models/game-session";

export function useGameSession({ id }: { id: GameSessionId }) {
  const { firestore } = useFirebase();
  const converter = React.useMemo(
    () => createGameSessionConverter({ firestore }),
    [firestore]
  );
  const [gameSession, isLoading, error] = useDocumentData(
    fs.doc(firestore, "gameSessions", id).withConverter(converter)
  );

  return { gameSession: gameSession ?? null, error, isLoading };
}
