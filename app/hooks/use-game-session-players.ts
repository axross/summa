import * as fs from "firebase/firestore";
import * as React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { createGameSessionPlayerConverter } from "~/firestore/game-session-player";
import { useFirebase } from "~/hooks/use-firebase";
import { GameSessionId } from "~/models/game-session";
import { UserId, UserUsername } from "~/models/user";

export function useGameSessionPlayers({ id }: { id: GameSessionId }) {
  const { firestore } = useFirebase();
  const converter = React.useMemo(
    () => createGameSessionPlayerConverter({ firestore }),
    [firestore]
  );
  const [players, isLoading, error] = useCollectionData(
    fs
      .collection(firestore, "gameSessions", id, "players")
      .withConverter(converter)
  );

  const addPlayer = React.useCallback(
    async (username: UserUsername) => {
      const [gameSessionSnapshot, usersSnapshot] = await Promise.all([
        fs.getDoc(fs.doc(firestore, "gameSessions", id)),
        fs.getDocs(
          fs.query(
            fs.collection(firestore, "users"),
            fs.where("username", "==", username),
            fs.limit(1)
          )
        ),
      ]);

      if (!gameSessionSnapshot) {
        throw new Error(`The game session (id: ${id}) was not found.`);
      }

      if (usersSnapshot.empty) {
        throw new Error(`The user (@${username}) was not found.`);
      }

      const user = usersSnapshot.docs[0];

      await fs.setDoc(
        fs
          .doc(firestore, "gameSessions", id, "players", user.id)
          .withConverter(createGameSessionPlayerConverter({ firestore })),
        {
          gameSessionId: id,
          userId: user.id,
          buyins: 1,
          stackBb: 200,
        }
      );
    },
    [firestore, id]
  );

  const removePlayer = React.useCallback(
    async (userId: UserId) => {
      await fs.deleteDoc(
        fs
          .doc(firestore, "gameSessions", id, "players", userId)
          .withConverter(createGameSessionPlayerConverter({ firestore }))
      );
    },
    [firestore, id]
  );

  return {
    players: players ?? [],
    error,
    isLoading,
    addPlayer,
    removePlayer,
  };
}
