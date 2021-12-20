import * as fs from "firebase/firestore";
import { z } from "zod";
import { User, UserAccount, UserUsername } from "~/models/user";

const UserAccountData = z.object({
  email: UserAccount.shape.email,
  permissions: z.array(z.literal("ADMIN")),
});

const UserData = z.object({
  username: UserUsername,
  name: UserAccount.shape.name,
  avatarUrl: z.string(),
});

export const userAccountConverter: fs.FirestoreDataConverter<
  Pick<UserAccount, "id" | "email" | "isAdmin">
> = {
  fromFirestore: (snapshot) => {
    const data = UserAccountData.parse(snapshot.data());

    return {
      id: snapshot.id,
      email: data.email,
      isAdmin: data.permissions.includes("ADMIN"),
    };
  },
  toFirestore: (partialMyself) => {
    const checked = UserAccount.partial().parse(partialMyself);

    return {
      email: checked.email,
      permissions:
        typeof checked.isAdmin === "boolean"
          ? checked.isAdmin
            ? fs.arrayUnion("ADMIN")
            : fs.arrayRemove("ADMIN")
          : checked.isAdmin,
    };
  },
};

export const userConverter: fs.FirestoreDataConverter<User> = {
  fromFirestore: (snapshot) => {
    const data = UserData.parse(snapshot.data());

    return {
      username: data.username,
      name: data.name,
      avatarUrl: data.avatarUrl,
    };
  },
  toFirestore: (partialMyself) => {
    const checked = User.partial().parse(partialMyself);

    return {
      username: checked.username,
      name: checked.name,
      avatarUrl: checked.avatarUrl,
    };
  },
};
