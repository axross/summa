import * as fs from "firebase/firestore";
import * as React from "react";
import { z } from "zod";
import { userConverter } from "~/firestore/user";
import { useFirebase } from "~/hooks/use-firebase";
import { User } from "~/models/user";
import { useAuth } from "./use-auth";

type Input = Pick<z.infer<typeof User>, "name" | "username">;

export function useMyUserUpdate(): {
  update: (params: { input: Input }) => Promise<void>;
} {
  const { myself } = useAuth();
  const { firestore } = useFirebase();

  const update = React.useCallback(
    async ({ input }: { input: Input }) => {
      await fs.updateDoc(
        fs.doc(firestore, "users", myself.id).withConverter(userConverter),
        {
          name: input.name,
          username: input.username,
        }
      );
    },
    [firestore]
  );

  return { update };
}
