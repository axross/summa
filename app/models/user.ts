import { z } from "zod";

export const UserId = z.string().nonempty();

export type UserId = z.infer<typeof UserId>;

export const UserUsername = z
  .string()
  .nonempty()
  .regex(/^[A-Za-z0-9_]+$/);

export type UserUsername = z.infer<typeof UserId>;

export const UserName = z.string().nonempty();

export type UserName = z.infer<typeof UserId>;

export const User = z.object({
  username: UserUsername,
  name: UserName,
  avatarUrl: z.string().url(),
});

export type User = z.infer<typeof User>;

export const UserAccount = User.extend({
  id: UserId,
  email: z.string().email(),
  isAdmin: z.boolean(),
});

export type UserAccount = z.infer<typeof UserAccount>;
