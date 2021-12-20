import * as fs from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { userConverter } from "~/firestore/user";
import { useFirebase } from "~/hooks/use-firebase";
import { User, UserId, UserUsername } from "~/models/user";

export function useUserByUsername({ username }: { username: UserUsername }) {
  const { firestore } = useFirebase();
  const [users, isLoading, error] = useCollectionData(
    fs.query<User>(
      fs.collection(firestore, "users").withConverter(userConverter),
      fs.where("username", "==", username),
      fs.limit(1)
    )
  );

  return {
    user: users ? users[0] : null,
    error,
    isLoading,
  };
}

export function useUserById({ id }: { id: UserId }) {
  const { firestore } = useFirebase();
  const [user, isLoading, error] = useDocumentData(
    fs.doc(firestore, "users", id).withConverter(userConverter)
  );

  return {
    user: user ?? null,
    error,
    isLoading,
  };
}
